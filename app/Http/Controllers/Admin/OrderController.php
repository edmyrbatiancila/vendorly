<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['user', 'orderItems.product', 'orderItems.seller']);

        // Filter by search (order number or customer name)
        if ($request->has('search') && $request->search !== '') {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                  });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== '') {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'delivered_orders' => Order::where('status', 'delivered')->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
        ];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'payment_status', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load([
            'user',
            'orderItems.product',
            'orderItems.seller.user'
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update the order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,paid,processing,shipped,delivered,cancelled,refunded',
        ]);

        $order->update([
            'status' => $request->status,
            'shipped_at' => $request->status === 'shipped' ? now() : null,
            'delivered_at' => $request->status === 'delivered' ? now() : null,
        ]);

        return back()->with('message', 'Order status updated successfully.');
    }

    /**
     * Update the payment status.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded',
        ]);

        $order->update([
            'payment_status' => $request->payment_status
        ]);

        return back()->with('message', 'Payment status updated successfully.');
    }

    /**
     * Cancel an order.
     */
    public function cancel(Order $order)
    {
        if (!in_array($order->status, ['pending', 'paid'])) {
            return back()->with('error', 'Cannot cancel order with current status.');
        }

        $order->update([
            'status' => 'cancelled'
        ]);

        return back()->with('message', 'Order cancelled successfully.');
    }
}