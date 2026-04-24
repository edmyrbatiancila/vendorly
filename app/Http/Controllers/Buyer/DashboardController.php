<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the buyer dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'total_orders' => $user->orders()->count(),
            'pending_orders' => $user->orders()->where('status', 'pending')->count(),
            'delivered_orders' => $user->orders()->where('status', 'delivered')->count(),
            'total_spent' => $user->orders()->sum('total_amount'),
            'cart_items' => $user->cartItems()->count(),
            'pending_reviews' => $user->orderItems()
                ->whereHas('order', function ($query) {
                    $query->where('status', 'delivered');
                })
                ->whereDoesntHave('review')
                ->count(),
        ];

        $recent_orders = $user->orders()
            ->with(['orderItems.product'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Buyer/Dashboard', [
            'stats' => $stats,
            'recent_orders' => $recent_orders,
        ]);
    }
}