<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display platform settings and commission configuration.
     */
    public function index(Request $request): Response
    {
        // Get commission rate statistics
        $commissionStats = [
            'average_commission' => Seller::avg('commission_rate') ?? 0,
            'min_commission' => Seller::min('commission_rate') ?? 0,
            'max_commission' => Seller::max('commission_rate') ?? 0,
            'total_commission_earned' => $this->calculateTotalCommissionEarned(),
        ];

        // Get sellers for commission management with pagination
        $sellersQuery = Seller::with('user')
            ->where('status', 'approved');

        if ($request->has('search') && $request->search !== '') {
            $sellersQuery->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            })->orWhere('store_name', 'like', '%' . $request->search . '%');
        }

        $sellers = $sellersQuery->paginate(10)->withQueryString();

        return Inertia::render('Admin/Settings/Index', [
            'commissionStats' => $commissionStats,
            'sellers' => $sellers,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Update commission rate for a specific seller.
     */
    public function updateCommission(Request $request, Seller $seller)
    {
        $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:20',
            'reason' => 'required|string|max:500',
        ]);

        $oldRate = $seller->commission_rate;
        
        $seller->update([
            'commission_rate' => $request->commission_rate,
        ]);

        // Log the commission change (you can implement a proper log system)
        Log::info("Commission rate updated for seller {$seller->id}", [
            'seller_id' => $seller->id,
            'old_rate' => $oldRate,
            'new_rate' => $request->commission_rate,
            'reason' => $request->reason,
            'updated_by' => Auth::id(),
        ]);

        return back()->with('message', 
            "Commission rate updated from {$oldRate}% to {$request->commission_rate}% for {$seller->store_name}."
        );
    }

    /**
     * Bulk update commission rates.
     */
    public function bulkUpdateCommission(Request $request)
    {
        $request->validate([
            'commission_rate' => 'required|numeric|min:0|max:20',
            'seller_ids' => 'required|array',
            'seller_ids.*' => 'exists:sellers,id',
            'reason' => 'required|string|max:500',
        ]);

        $updated = Seller::whereIn('id', $request->seller_ids)
            ->update(['commission_rate' => $request->commission_rate]);

        Log::info("Bulk commission rate update", [
            'seller_count' => $updated,
            'new_rate' => $request->commission_rate,
            'reason' => $request->reason,
            'updated_by' => Auth::id(),
        ]);

        return back()->with('message', 
            "Commission rate updated to {$request->commission_rate}% for {$updated} sellers."
        );
    }

    /**
     * Set default commission rate for new sellers.
     */
    public function setDefaultCommission(Request $request)
    {
        $request->validate([
            'default_commission_rate' => 'required|numeric|min:0|max:20',
        ]);

        // Store in config or settings table (for now using cache)
        cache()->put('default_commission_rate', $request->default_commission_rate, now()->addYears(10));

        return back()->with('message', 
            "Default commission rate set to {$request->default_commission_rate}% for new sellers."
        );
    }

    /**
     * Calculate total commission earned by platform.
     */
    private function calculateTotalCommissionEarned(): float
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('orders.status', 'delivered')
            ->selectRaw('SUM(order_items.total_price * sellers.commission_rate / 100) as total_commission')
            ->value('total_commission') ?? 0;
    }

    /**
     * Get platform analytics and activity monitoring.
     */
    public function analytics(): Response
    {
        $analytics = [
            'daily_orders' => $this->getDailyOrdersChart(),
            'revenue_by_category' => $this->getRevenueByCategoryChart(),
            'seller_performance' => $this->getTopSellersData(),
            'platform_metrics' => $this->getPlatformMetrics(),
        ];

        return Inertia::render('Admin/Settings/Analytics', [
            'analytics' => $analytics,
        ]);
    }

    /**
     * Get daily orders chart data for last 30 days.
     */
    private function getDailyOrdersChart(): array
    {
        return DB::table('orders')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(total_amount) as revenue')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'orders' => $item->count,
                    'revenue' => (float) $item->revenue,
                ];
            })->toArray();
    }

    /**
     * Get revenue by category chart data.
     */
    private function getRevenueByCategoryChart(): array
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('orders.status', 'delivered')
            ->selectRaw('categories.name, SUM(order_items.total_price) as revenue')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'category' => $item->name,
                    'revenue' => (float) $item->revenue,
                ];
            })->toArray();
    }

    /**
     * Get top sellers performance data.
     */
    private function getTopSellersData(): array
    {
        return DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->join('users', 'sellers.user_id', '=', 'users.id')
            ->where('orders.status', 'delivered')
            ->selectRaw('
                sellers.store_name, 
                users.name as owner_name,
                COUNT(DISTINCT order_items.order_id) as total_orders,
                SUM(order_items.total_price) as total_revenue,
                sellers.commission_rate
            ')
            ->groupBy('sellers.id', 'sellers.store_name', 'users.name', 'sellers.commission_rate')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get platform key metrics.
     */
    private function getPlatformMetrics(): array
    {
        return [
            'total_users' => User::count(),
            'active_sellers' => Seller::where('status', 'approved')->count(),
            'pending_sellers' => Seller::where('status', 'pending')->count(),
            'total_products' => DB::table('products')->count(),
            'active_products' => DB::table('products')->where('is_active', true)->count(),
            'monthly_revenue' => DB::table('orders')
                ->where('status', 'delivered')
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            'monthly_orders' => DB::table('orders')
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
        ];
    }
}