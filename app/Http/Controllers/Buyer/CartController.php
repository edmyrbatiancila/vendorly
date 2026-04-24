<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(Request $request): Response
    {
        $cartItems = Cart::with(['product.seller'])
            ->where('user_id', $request->user()->id)
            ->get();

        $cartSummary = $this->calculateCartSummary($cartItems);

        return Inertia::render('Buyer/Cart/Index', [
            'cartItems' => $cartItems,
            'cartSummary' => $cartSummary,
        ]);
    }

    /**
     * Add product to cart.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'options' => 'nullable|array',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is available
        if (!$product->is_active || $product->stock_status !== 'in_stock') {
            return response()->json([
                'success' => false,
                'message' => 'Product is not available for purchase.'
            ], 400);
        }

        // Check stock availability
        if ($request->quantity > $product->stock_quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds available stock.'
            ], 400);
        }

        // Check if item already exists in cart
        $existingCartItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + $request->quantity;
            
            if ($newQuantity > $product->stock_quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Total quantity would exceed available stock.'
                ], 400);
            }

            $existingCartItem->update([
                'quantity' => $newQuantity,
                'options' => $request->options ?? $existingCartItem->options,
            ]);

            $cartItem = $existingCartItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'options' => $request->options,
            ]);
        }

        // Get updated cart count
        $cartCount = Cart::where('user_id', $request->user()->id)->count();

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully.',
            'cartItem' => $cartItem->load('product'),
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, Cart $cartItem): JsonResponse
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock availability
        if ($request->quantity > $cartItem->product->stock_quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Requested quantity exceeds available stock.',
                'max_quantity' => $cartItem->product->stock_quantity,
            ], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        // Get updated cart summary
        $cartItems = Cart::with('product')->where('user_id', $request->user()->id)->get();
        $cartSummary = $this->calculateCartSummary($cartItems);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully.',
            'cartItem' => $cartItem->fresh('product'),
            'cartSummary' => $cartSummary,
        ]);
    }

    /**
     * Remove item from cart.
     */
    public function destroy(Request $request, Cart $cartItem): JsonResponse
    {
        // Ensure user owns this cart item
        if ($cartItem->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $cartItem->delete();

        // Get updated cart summary
        $cartItems = Cart::with('product')->where('user_id', $request->user()->id)->get();
        $cartSummary = $this->calculateCartSummary($cartItems);
        $cartCount = Cart::where('user_id', $request->user()->id)->count();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart.',
            'cartSummary' => $cartSummary,
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Clear all cart items.
     */
    public function clear(Request $request): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully.',
            'cartCount' => 0,
        ]);
    }

    /**
     * Get cart count for navigation.
     */
    public function count(Request $request): JsonResponse
    {
        $cartCount = Cart::where('user_id', $request->user()->id)->count();

        return response()->json([
            'cartCount' => $cartCount,
        ]);
    }

    /**
     * Calculate cart summary (subtotal, tax, shipping, total).
     */
    private function calculateCartSummary($cartItems): array
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