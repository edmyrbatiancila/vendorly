<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_sellers' => Seller::count(),
            'pending_sellers' => Seller::where('status', 'pending')->count(),
            'approved_sellers' => Seller::where('status', 'approved')->count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('is_active', true)->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_revenue' => Order::where('status', 'delivered')->sum('total_amount'),
        ];

        $recent_orders = Order::with(['user', 'orderItems.product'])
            ->latest()
            ->take(10)
            ->get();

        $recent_sellers = Seller::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recent_orders' => $recent_orders,
            'recent_sellers' => $recent_sellers
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
}
