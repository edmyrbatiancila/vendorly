<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Admin\SellerController as AdminSellerController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Buyer\DashboardController as BuyerDashboardController;
use App\Http\Controllers\Seller\ProductController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    } elseif ($user->isSeller()) {
        return redirect()->route('seller.dashboard');
    } else {
        return redirect()->route('buyer.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard redirects based on role
    // Route::get('/dashboard', function () {
    //     $user = auth()->user();

    //     return match ($user->role) {
    //         'admin' => redirect()->route('admin.dashboard'),
    //         'seller' => redirect()->route('seller.dashboard'),
    //         'buyer' => redirect()->route('buyer.dashboard'),
    //         'default' => redirect()->route('/')
    //     };
    // });

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // User management
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
        Route::patch('/users/{user}/verify-email', [UserController::class, 'verifyEmail'])->name('users.verify-email');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Seller management
        Route::get('/sellers', [AdminSellerController::class, 'index'])->name('sellers.index');
        Route::get('/sellers/{seller}', [AdminSellerController::class, 'show'])->name('sellers.show');
        Route::patch('/sellers/{seller}/approve', [AdminSellerController::class, 'approve'])->name('sellers.approve');
        Route::patch('/sellers/{seller}/reject', [AdminSellerController::class, 'reject'])->name('sellers.reject');
        Route::patch('/sellers/{seller}/suspend', [AdminSellerController::class, 'suspend'])->name('sellers.suspend');

        // Product management
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/{product}', [AdminProductController::class, 'show'])->name('products.show');
        Route::patch('/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

        // Order management
        Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::patch('/orders/{order}/payment-status', [AdminOrderController::class, 'updatePaymentStatus'])->name('orders.update-payment-status');
        Route::patch('/orders/{order}/cancel', [AdminOrderController::class, 'cancel'])->name('orders.cancel');

        // Category management
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::patch('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::patch('/categories/{category}/toggle-status', [AdminCategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        // Platform settings and commission management
        Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
        Route::get('/settings/analytics', [AdminSettingsController::class, 'analytics'])->name('settings.analytics');
        Route::patch('/settings/commission/{seller}', [AdminSettingsController::class, 'updateCommission'])->name('settings.update-commission');
        Route::patch('/settings/bulk-commission', [AdminSettingsController::class, 'bulkUpdateCommission'])->name('settings.bulk-commission');
        Route::patch('/settings/default-commission', [AdminSettingsController::class, 'setDefaultCommission'])->name('settings.default-commission');
    });

    // Seller routes
    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        Route::get('/dashboard', [SellerDashboardController::class, 'index'])->name('dashboard');
        Route::get('/setup', [SellerDashboardController::class, 'setup'])->name('setup');
        Route::post('/setup', [SellerDashboardController::class, 'store'])->name('setup.store');
        
        // Product Management
        Route::resource('products', ProductController::class);
        Route::patch('/products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggle-status');
    });

    // Buyer routes
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
        Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');
    });
});

require __DIR__.'/auth.php';
