<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller) {
            return redirect()->route('seller.setup');
        }

        $query = $seller->products()->with('category');

        // Search filter
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('sku', 'like', '%'.$request->search.'%');
        }

        // Status filter
        if ($request->has('status') && $request->status !== '') {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'out_of_stock') {
                $query->where('stock_status', 'out_of_stock');
            }
        }

        $products = $query->latest()->paginate(12);

        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        $categories = Category::active()->get();

        return Inertia::render('Seller/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $seller = $request->user()->seller;

        if (!$seller || $seller->status !== 'approved') {
            abort(403, 'You must be an approved seller to create products');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0|gt:price',
            'sku' => 'required|string|max:100|unique:products',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'track_inventory' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string', // Base64 or URLs
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);
        $originalSlug = $validated['slug'];
        $counter = 1;

        // Ensure slug is unique
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Set seller ID
        $validated['seller_id'] = $seller->id;

        // Set stock status based on quantity
        if ($validated['stock_quantity'] <= 0) {
            $validated['stock_status'] = 'out_of_stock';
        } elseif ($validated['stock_quantity'] <= $validated['min_stock_level']) {
            $validated['stock_status'] = 'low_stock';
        } else {
            $validated['stock_status'] = 'in_stock';
        }

        $product = Product::create($validated);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        // Ensure the product belongs to the current seller
        if ($product->seller_id !== Auth::user()->seller->id) {
            abort(403);
        }

        $product->load('category');

        return Inertia::render('Seller/Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product): Response
    {
        // Ensure the product belongs to the current seller
        if ($product->seller_id !== Auth::user()->seller->id) {
            abort(403);
        }

        $categories = Category::active()->get();
        $product->load('category');

        return Inertia::render('Seller/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        // Ensure the product belongs to the current seller
        if ($product->seller_id !== Auth::user()->seller->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0|gt:price',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'track_inventory' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        // Update slug if name changed
        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $originalSlug = $validated['slug'];
            $counter = 1;

            while (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Update stock status based on quantity
        if ($validated['stock_quantity'] <= 0) {
            $validated['stock_status'] = 'out_of_stock';
        } elseif ($validated['stock_quantity'] <= $validated['min_stock_level']) {
            $validated['stock_status'] = 'low_stock';
        } else {
            $validated['stock_status'] = 'in_stock';
        }

        $product->update($validated);

        return redirect()->route('seller.products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        // Ensure the product belongs to the current seller
        if ($product->seller_id !== Auth::user()->seller->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('seller.products.index')
            ->with('success', 'Product deleted successfully!');
    }

    /**
     * Toggle product active status.
     */
    public function toggleStatus(Product $product)
    {
        // Ensure the product belongs to the current seller
        if ($product->seller_id !== Auth::user()->seller->id) {
            abort(403);
        }

        $product->update([
            'is_active' => !$product->is_active
        ]);

        $status = $product->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Product {$status} successfully!");
    }
}