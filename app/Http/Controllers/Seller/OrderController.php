<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $seller = $request->user()->seller;

        $query = OrderItem::with(['order.user', 'product'])
            ->where('seller_id', $seller->id);

        // Status filter
        if ($request->has('status') && $request->status !== '') {
            $query->whereHas('order', function($q) use ($request) {
                $q->where('status', $request->status);
            });
        }

        // Date filter
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereHas('order', function($q) use ($request) {
                $q->whereDate('created_at', '>=', $request->date_from);
            });
        }

        $orderItems = $query->latest()->paginate(20);

        return Inertia::render('Seller/Orders/Index', [
            'orderItems' => $orderItems,
            'filters' => $request->only(['status', 'date_from', 'date_to']),
            'stats' => [
                'total_orders' => $seller->orderItems()->distinct('order_id')->count(),
                'pending_orders' => $seller->orderItems()
                    ->whereHas('order', fn($q) => $q->where('status', 'pending'))
                    ->distinct('order_id')->count(),
                'processing_orders' => $seller->orderItems()
                    ->whereHas('order', fn($q) => $q->where('status', 'processing'))
                    ->distinct('order_id')->count(),
                'shipped_orders' => $seller->orderItems()
                    ->whereHas('order', fn($q) => $q->where('status', 'shipped'))
                    ->distinct('order_id')->count(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): Response
    {
        $seller = Auth::user()->seller;

        // Ensure seller can only see orders containing their products
        $orderItems = $order->orderItems()
            ->where('seller_id', $seller->id)
            ->with('product')
            ->get();

        if ($orderItems->isEmpty()) {
            abort(403, 'Order not found');
        }

        $order->load('user');

        return Inertia::render('Seller/Orders/Show', [
            'order' => $order,
            'orderItems' => $orderItems
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateStatus(Request $request, OrderItem $orderItem)
    {
        $seller = Auth::user()->seller;

        if ($orderItem->seller_id !== $seller->id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:processing,shipped,delivered,'
        ]);

        // Update the main order status if all items from all sellers
        $order = $orderItem->order;
        $order->orderItems()->where('seller_id', $seller->id)->update([
            'status' => $validated['status']
        ]);

        return back()->with('success', 'Order status updated successfully!');
    }
}
