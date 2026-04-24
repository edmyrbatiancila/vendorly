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
use App\Http\Controllers\Buyer\ProductController as BuyerProductController;
use App\Http\Controllers\Buyer\CartController as BuyerCartController;
use App\Http\Controllers\Buyer\OrderController as BuyerOrderController;
use App\Http\Controllers\Buyer\ReviewController as BuyerReviewController;
use App\Http\Controllers\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use Illuminate\Support\Facades\Auth;
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
    $user = Auth::user();

    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'seller') {
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
        Route::patch('/sellers/bulk-approve', [AdminSellerController::class, 'bulkApprove'])->name('sellers.bulk-approve');

        // Product management
        Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/products/{product}', [AdminProductController::class, 'show'])->name('products.show');
        Route::patch('/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('/products/bulk-status', [AdminProductController::class, 'bulkUpdateStatus'])->name('products.bulk-status');

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
        Route::resource('products', SellerProductController::class);
        Route::patch('/products/{product}/toggle-status', [SellerProductController::class, 'toggleStatus'])->name('products.toggle-status');

        // Order Management
        Route::get('/orders', [SellerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [SellerOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{orderItem}/status', [SellerOrderController::class, 'updateStatus'])->name('orders.update-status');

        // Analytics & Reports
        Route::get('/analytics', [SellerDashboardController::class, 'analytics'])->name('analytics');
        Route::get('/inventory', [SellerDashboardController::class, 'inventory'])->name('inventory');
    });

    // Buyer routes
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
        Route::get('/dashboard', [BuyerDashboardController::class, 'index'])->name('dashboard');

        // Product browsing
        Route::get('/products', [BuyerProductController::class, 'index'])->name('products.index');
        Route::get('/products/{product}', [BuyerProductController::class, 'show'])->name('products.show');

        // Cart management
        Route::get('/cart', [BuyerCartController::class, 'index'])->name('cart.index');
        Route::post('/cart', [BuyerCartController::class, 'store'])->name('cart.store');
        Route::patch('/cart/{cartItem}', [BuyerCartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/{cartItem}', [BuyerCartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [BuyerCartController::class, 'clear'])->name('cart.clear');
        Route::get('/cart/count', [BuyerCartController::class, 'count'])->name('cart.count');

        // Order management
        Route::get('/orders', [BuyerOrderController::class, 'index'])->name('orders.index');
        Route::get('/checkout', [BuyerOrderController::class, 'checkout'])->name('orders.checkout');
        Route::post('/orders', [BuyerOrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{order}', [BuyerOrderController::class, 'show'])->name('orders.show');
        Route::patch('/orders/{order}/cancel', [BuyerOrderController::class, 'cancel'])->name('orders.cancel');

        // Review management
        Route::get('/reviews', [BuyerReviewController::class, 'index'])->name('reviews.index');
        Route::get('/reviews/reviewable', [BuyerReviewController::class, 'reviewable'])->name('reviews.reviewable');
        Route::get('/reviews/create/{orderItem}', [BuyerReviewController::class, 'create'])->name('reviews.create');
        Route::post('/reviews', [BuyerReviewController::class, 'store'])->name('reviews.store');
        Route::get('/reviews/{review}/edit', [BuyerReviewController::class, 'edit'])->name('reviews.edit');
        Route::patch('/reviews/{review}', [BuyerReviewController::class, 'update'])->name('reviews.update');
        Route::delete('/reviews/{review}', [BuyerReviewController::class, 'destroy'])->name('reviews.destroy');
    });
});

require __DIR__.'/auth.php';
