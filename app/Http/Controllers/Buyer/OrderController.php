<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display order history.
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['orderItems.product.seller'])
            ->where('user_id', $request->user()->id);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $orders = $query->latest()->paginate(10)->appends($request->all());

        // Get status counts for filters
        $statusCounts = Order::where('user_id', $request->user()->id)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Buyer/Orders/Index', [
            'orders' => $orders,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'from_date', 'to_date']),
        ]);
    }

    /**
     * Display checkout page.
     */
    public function checkout(Request $request): Response|RedirectResponse
    {
        $cartItems = Cart::with(['product.seller'])
            ->where('user_id', $request->user()->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('buyer.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Calculate order summary
        $orderSummary = $this->calculateOrderSummary($cartItems);

        // Get user's saved addresses (if implemented)
        $user = $request->user();
        $savedAddresses = []; // This would come from a user_addresses table if implemented

        return Inertia::render('Buyer/Orders/Checkout', [
            'cartItems' => $cartItems,
            'orderSummary' => $orderSummary,
            'savedAddresses' => $savedAddresses,
            'user' => $user,
        ]);
    }

    /**
     * Process checkout and create order.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.address_line_1' => 'required|string|max:255',
            'billing_address.city' => 'required|string|max:255',
            'billing_address.state' => 'required|string|max:255',
            'billing_address.postal_code' => 'required|string|max:20',
            'billing_address.country' => 'required|string|max:255',
            'shipping_address' => 'required|array',
            'payment_method' => 'required|string|in:credit_card,paypal,bank_transfer',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        
        // Get cart items
        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('buyer.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Calculate order totals
        $orderSummary = $this->calculateOrderSummary($cartItems);

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $orderSummary['subtotal'],
                'tax_amount' => $orderSummary['tax_amount'],
                'shipping_amount' => $orderSummary['shipping_amount'],
                'total_amount' => $orderSummary['total'],
                'currency' => 'USD',
                'billing_address' => $request->billing_address,
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'seller_id' => $cartItem->product->seller_id,
                    'product_name' => $cartItem->product->name,
                    'product_sku' => $cartItem->product->sku,
                    'unit_price' => $cartItem->product->price,
                    'quantity' => $cartItem->quantity,
                    'total_price' => $cartItem->product->price * $cartItem->quantity,
                    'product_options' => $cartItem->options,
                ]);

                // Update product stock
                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
                
                // Update sales count
                $cartItem->product->increment('sales_count', $cartItem->quantity);
            }

            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            // TODO: Process payment here (Stripe, PayPal, etc.)
            // For now, we'll mark as pending payment

            return redirect()->route('buyer.orders.show', $order)
                ->with('success', 'Order placed successfully! Order #' . $order->order_number);

        } catch (\Exception $e) {
            DB::rollback();
            
            return back()
                ->withErrors(['error' => 'Failed to create order. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, Order $order): Response
    {
        // Ensure user owns this order
        if ($order->user_id !== $request->user()->id) {
            abort(404);
        }

        $order->load(['orderItems.product.seller', 'orderItems.seller']);

        return Inertia::render('Buyer/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel an order (if allowed).
     */
    public function cancel(Request $request, Order $order): RedirectResponse
    {
        // Ensure user owns this order
        if ($order->user_id !== $request->user()->id) {
            abort(404);
        }

        // Check if order can be cancelled
        if (!in_array($order->status, ['pending', 'paid'])) {
            return back()->with('error', 'This order cannot be cancelled.');
        }

        DB::beginTransaction();

        try {
            // Update order status
            $order->update(['status' => 'cancelled']);

            // Restore product stock
            foreach ($order->orderItems as $orderItem) {
                $orderItem->product->increment('stock_quantity', $orderItem->quantity);
                $orderItem->product->decrement('sales_count', $orderItem->quantity);
            }

            DB::commit();

            return back()->with('success', 'Order cancelled successfully.');

        } catch (\Exception $e) {
            DB::rollback();
            
            return back()->with('error', 'Failed to cancel order. Please try again.');
        }
    }

    /**
     * Generate unique order number.
     */
    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
        } while (Order::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    /**
     * Calculate order summary.
     */
    private function calculateOrderSummary($cartItems): array
    {
        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $taxRate = 0.08; // 8% tax rate (configurable)
        $taxAmount = $subtotal * $taxRate;

        $shippingAmount = $subtotal > 100 ? 0 : 15; // Free shipping over $100

        $total = $subtotal + $taxAmount + $shippingAmount;

        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'shipping_amount' => $shippingAmount,
            'total' => round($total, 2),
            'item_count' => $cartItems->count(),
            'total_quantity' => $cartItems->sum('quantity'),
        ];
    }
}