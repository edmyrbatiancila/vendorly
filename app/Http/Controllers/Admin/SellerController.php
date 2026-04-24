<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Seller::with('user');

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search !== '' ) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            })
            ->orWhere('store_name', 'like', "%{$request->search}%");
        }

        $sellers = $query->latest()->paginate(15);

        return Inertia::render('Admin/Sellers/Index', [
            'sellers' => $sellers,
            'filters' => $request->only(['status', 'search']),
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
    public function show(Seller $seller): Response
    {
        $seller->load(['user', 'products' => function($query) {
            $query->with('category')->latest()->take(10);
        }]);

        $stats = [
            'total_products' => $seller->products()->count(),
            'active_products' => $seller->products()->where('is_active', true)->count(),
            'total_sales' => $seller->orderItems()->sum('total_price'),
            'total_orders' => $seller->orderItems()->distinct('order_id')->count()
        ];

        return Inertia::render('Admin/Sellers/Show', [
            'seller' => $seller,
            'stats' => $stats,
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

    public function approve(Seller $seller)
    {
        if ($seller->status === 'approved') {
            return back()->with('error', 'Seller is already approved.');
        }

        $seller->update(['status' => 'approved']);

        // Activate the seller's user account
        $seller->user->update(['is_active' => true]);

        return back()->with('success', 'Seller approved successfully');
    }

    public function reject(Request $request, Seller $seller)
    {
        if ($seller->status !== 'pending') {
            return back()->with('error', 'Only pending sellers can be rejected.');
        }

        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $seller->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return back()->with('success', 'Seller rejected successfully');
    }

    public function suspend(Request $request, Seller $seller)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $seller->update([
            'status' => 'suspended',
            'rejection_reason' => $request->reason
        ]);

        return back()->with('success', 'Seller suspended successfully');
    }

    /**
     * Bulk approve sellers.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'seller_ids' => 'required|array',
            'seller_ids.*' => 'exists:sellers,id'
        ]);

        $sellers = Seller::whereIn('id', $request->seller_ids)
            ->where('status', 'pending')
            ->get();

        foreach ($sellers as $seller) {
            $seller->update(['status' => 'approved']);
            $seller->user->update(['is_active' => true]);
        }

        return back()->with('success', "Successfully approved {$sellers->count()} sellers.");
    }
}
