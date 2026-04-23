<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

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

        // Monthly Revenue Analytics (last 12 months)
        $monthlyRevenue = Order::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(total_amount) as revenue')
        )
        ->where('status', 'delivered')
        ->where('created_at', '>=', Carbon::now()->subYear())
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'name' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                'revenue' => (float) $item->revenue,
                'month' => $item->month,
                'year' => $item->year,
            ];
        })
        ->reverse()
        ->values();

        // Monthly Orders Analytics (last 12 months)
        $monthlyOrders = Order::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as orders')
        )
        ->where('created_at', '>=', Carbon::now()->subYear())
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'name' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                'orders' => (int) $item->orders,
                'month' => $item->month,
                'year' => $item->year,
            ];
        })
        ->reverse()
        ->values();

        // Order Status Distribution
        $orderStatusStats = Order::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => ucfirst($item->status),
                    'value' => (int) $item->count,
                ];
            });

        // Top Categories by Products
        $topCategories = DB::table('categories')
            ->join('products', 'categories.id', '=', 'products.category_id')
            ->select('categories.name', DB::raw('COUNT(products.id) as product_count'))
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('product_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (int) $item->product_count,
                ];
            });

        // Seller Growth (last 12 months)
        $sellerGrowth = Seller::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as sellers')
        )
        ->where('created_at', '>=', Carbon::now()->subYear())
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get()
        ->map(function ($item) {
            return [
                'name' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                'sellers' => (int) $item->sellers,
                'month' => $item->month,
                'year' => $item->year,
            ];
        })
        ->reverse()
        ->values();

        $recent_orders = Order::with(['user', 'orderItems.product'])
            ->latest()
            ->take(5)
            ->get();

        $recent_sellers = Seller::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'analytics' => [
                'monthlyRevenue' => $monthlyRevenue,
                'monthlyOrders' => $monthlyOrders,
                'orderStatusStats' => $orderStatusStats,
                'topCategories' => $topCategories,
                'sellerGrowth' => $sellerGrowth,
            ],
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
