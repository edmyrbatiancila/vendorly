import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, Category, PageProps } from '@/types';
import { useState, useEffect } from 'react';

interface ProductsIndexProps extends PageProps {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    priceRange: {
        min_price: number;
        max_price: number;
    };
    filters: {
        search?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        min_rating?: string;
        sort?: string;
    };
}

export default function ProductsIndex({ 
    products, 
    categories, 
    priceRange, 
    filters 
}: ProductsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [minRating, setMinRating] = useState(filters.min_rating || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');

    const applyFilters = () => {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (minRating) params.min_rating = minRating;
        if (sortBy !== 'latest') params.sort = sortBy;

        router.get(route('buyer.products.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setMinRating('');
        setSortBy('latest');
        router.get(route('buyer.products.index'));
    };

    const addToCart = async (productId: number) => {
        try {
            const response = await fetch(route('buyer.cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                // Show success message (you can implement a toast system)
                alert('Product added to cart!');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart.');
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                ⭐
            </span>
        ));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Browse Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min Price"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="1">1+ Stars</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Best Rating</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={applyFilters}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Showing {products.data.length} of {products.meta.total} products
                        </p>
                    </div>

                    {/* Product Grid */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {products.data.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                    <Link href={route('buyer.products.show', product.id)}>
                                        <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${product.images[0]}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <Link href={route('buyer.products.show', product.id)}>
                                            <h3 className="font-medium text-gray-900 mb-2 hover:text-indigo-600 line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="mb-2">
                                            <div className="flex items-center space-x-1 mb-1">
                                                {renderStars(product.rating_avg)}
                                                <span className="text-sm text-gray-500">
                                                    ({product.rating_count})
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                                {product.compare_price && (
                                                    <span className="text-sm text-gray-500 line-through ml-2">
                                                        ${product.compare_price}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.stock_quantity} left
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-600">
                                                by {product.seller?.store_name}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => addToCart(product.id)}
                                            disabled={product.stock_quantity === 0}
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.meta.total > products.meta.per_page && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {products.links.find(link => link.label === '&laquo; Previous')?.url && (
                                    <Link
                                        href={products.links.find(link => link.label === '&laquo; Previous')!.url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {products.links.find(link => link.label === 'Next &raquo;')?.url && (
                                    <Link
                                        href={products.links.find(link => link.label === 'Next &raquo;')!.url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{products.meta.from}</span> to{' '}
                                        <span className="font-medium">{products.meta.to}</span> of{' '}
                                        <span className="font-medium">{products.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === products.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}