<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): Response
    {
        $query = Product::with(['seller.user', 'category']);

        // Filter by search
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->has('category') && $request->category !== '') {
            $query->where('category_id', $request->category);
        }

        // Filter by seller
        if ($request->has('seller') && $request->seller !== '') {
            $query->where('seller_id', $request->seller);
        }

        // Filter by status (active/inactive)
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === '1');
        }

        $products = $query->latest()
            ->paginate(15)
            ->withQueryString();

        $categories = Category::active()->orderBy('name')->get();
        $sellers = Seller::with('user')->approved()->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'sellers' => $sellers,
            'filters' => $request->only(['search', 'category', 'seller', 'status'])
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load([
            'seller.user',
            'category',
            'reviews.user',
            'orderItems.order'
        ]);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Update the product status.
     */
    public function toggleStatus(Product $product)
    {
        $product->update([
            'is_active' => !$product->is_active
        ]);

        return back()->with('message', 'Product status updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Check if product has orders
        if ($product->orderItems()->count() > 0) {
            return back()->with('error', 'Cannot delete product with existing orders.');
        }

        $product->delete();

        return back()->with('message', 'Product deleted successfully.');
    }
}