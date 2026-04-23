<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::with(['seller']);

        // Filter by search
        if ($request->has('search') && $request->search !== '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        // Filter by status (active/inactive)
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === '1');
        }

        // Filter by email verification
        if ($request->has('verified') && $request->verified !== '') {
            if ($request->verified === '1') {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        // Get stats for dashboard
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'seller_users' => User::where('role', 'seller')->count(),
            'buyer_users' => User::where('role', 'buyer')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status', 'verified']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load(['seller.products', 'orders.orderItems']);

        // Get user statistics
        $userStats = [
            'total_orders' => $user->orders()->count(),
            'total_spent' => $user->orders()->where('status', 'delivered')->sum('total_amount'),
            'products_count' => $user->seller ? $user->seller->products()->count() : 0,
            'seller_revenue' => $user->seller ? 
                $user->seller->orderItems()->whereHas('order', function($q) {
                    $q->where('status', 'delivered');
                })->sum('total_price') : 0,
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'stats' => $userStats,
        ]);
    }

    /**
     * Toggle user active status.
     */
    public function toggleStatus(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active
        ]);

        return back()->with('message', 'User status updated successfully.');
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,seller,buyer'
        ]);

        $oldRole = $user->role;
        
        $user->update([
            'role' => $request->role
        ]);

        // If changing from seller role, handle seller account
        if ($oldRole === 'seller' && $request->role !== 'seller' && $user->seller) {
            $user->seller->update(['status' => 'suspended']);
        }

        return back()->with('message', 'User role updated successfully.');
    }

    /**
     * Verify user email manually.
     */
    public function verifyEmail(User $user)
    {
        if (!$user->email_verified_at) {
            $user->update([
                'email_verified_at' => now()
            ]);
            
            return back()->with('message', 'User email verified successfully.');
        }

        return back()->with('message', 'User email is already verified.');
    }

    /**
     * Delete a user account.
     */
    public function destroy(User $user)
    {
        // Check if user has any orders or is referenced in other places
        if ($user->orders()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete user with existing orders.']);
        }

        // Delete associated seller account if exists
        if ($user->seller) {
            $user->seller->delete();
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('message', 'User deleted successfully.');
    }
}