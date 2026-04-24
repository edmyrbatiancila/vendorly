<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return redirect()->route('seller.setup');
        }

        $stats = [
            'total_products' => $seller->products()->count(),
            'active_products' => $seller->products()->where('is_active', true)->count(),
            'total_orders' => $seller->orderItems()->distinct('order_id')->count(),
            'pending_orders' => $seller->orderItems()
                ->whereHas('order', function($query) {
                    $query->whereIn('status', ['pending', 'paid']);
                })
                ->distinct('order_id')
                ->count(),
            'total_revenue' => $seller->orderItems()
                ->whereHas('order', function($query) {
                    $query->where('status', 'delivered');
                })
                ->sum('total_price'),
            'low_stock_products' => $seller->products()
                ->whereRaw('stock_quantity <= min_stock_level')
                ->count(),
        ];

        $recent_orders = $seller->orderItems()
            ->with(['order.user', 'product'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Seller/Dashboard', [
            'seller' => $seller,
            'stats' => $stats,
            'recent_orders' => $recent_orders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function setup(): Response
    {
        return Inertia::render('Seller/Setup');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_description' => 'required|string|max:1000',
        ]);

        $seller = Seller::create([
            'user_id' => $request->user()->id,
            'store_name' => $request->store_name,
            'store_description' => $request->store_description,
            'status' => 'pending',
        ]);

        return redirect()->route('seller.dashboard')
            ->with('success', 'Store setup submitted! Please wait for admin approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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

    public function analytics(Request $request): Response
    {
        $seller = $request->user()->seller;

        // Monthly revenue data
        $monthlyRevenue = $seller->orderItems()
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, SUM(total_price) as revenue')
            ->whereHas('order', fn($q) => $q->where('status', 'delivered'))
            ->whereYear('created_at', now()->year)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Top performing products
        $topProducts = $seller->products()
            ->withSum(['orderItems as total_sold' => function($query) {
                $query->whereHas('order', fn($q) => $q->where('status', 'delivered'));
            }], 'quantity')
            ->withSum(['orderItems as total_revenue' => function($query) {
                $query->whereHas('order', fn($q) => $q->where('status', 'delivered'));
            }], 'total_price')
            ->orderBy('total_revenue', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Seller/Analytics', [
            'monthlyRevenue' => $monthlyRevenue,
            'topProducts' => $topProducts,
            'seller' => $seller
        ]);
    }

    public function inventory(Request $request): Response
    {
        $seller = $request->user()->seller;

        $lowStockProducts = $seller->products()
            ->whereRaw('stock_quantity <= min_stock_level')
            ->where('stock_quantity', '>', 0)
            ->with('category')
            ->get();

        $outOfStockProducts = $seller->products()
            ->where('stock_quantity', 0)
            ->with('category')
            ->get();

        return Inertia::render('Seller/Inventory', [
            'lowStockProducts' => $lowStockProducts,
            'outOfStockProducts' => $outOfStockProducts
        ]);
    }
}
