import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Product } from '@/types';
import { useState } from 'react';

interface SellerProductsIndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SellerProductsIndex({ products, filters }: SellerProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('seller.products.index'), {
            search: search || undefined,
            status: status || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (product: Product) => {
        if (!product.is_active) return 'bg-gray-100 text-gray-800';
        
        switch (product.stock_status) {
            case 'in_stock': return 'bg-green-100 text-green-800';
            case 'low_stock': return 'bg-yellow-100 text-yellow-800';
            case 'out_of_stock': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (product: Product) => {
        if (!product.is_active) return 'Inactive';
        return product.stock_status.replace('_', ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const toggleProductStatus = (product: Product) => {
        router.patch(route('seller.products.toggle-status', product.id));
    };

    return (
        <SellerLayout>
            <Head title="My Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                                <Link
                                    href={route('seller.products.create')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Add New Product
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 flex space-x-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Filter
                                </button>
                            </div>

                            {/* Products Grid */}
                            {products.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                                    <p className="text-gray-500 mb-4">Start by adding your first product to your store</p>
                                    <Link
                                        href={route('seller.products.create')}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                                    >
                                        Add Your First Product
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="aspect-square bg-gray-200 relative">
                                                {product.images && product.images.length > 0 ? (
                                                    <img 
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                                                        📦
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product)}`}>
                                                        {getStatusText(product)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                                                
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <span className="text-xl font-bold text-gray-900">
                                                            ${product.price}
                                                        </span>
                                                        {product.compare_price && (
                                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                                ${product.compare_price}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Stock: {product.stock_quantity}
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('seller.products.show', product.id)}
                                                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm text-center hover:bg-gray-200"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('seller.products.edit', product.id)}
                                                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm text-center hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleProductStatus(product)}
                                                        className={`flex-1 px-3 py-2 rounded-md text-sm ${
                                                            product.is_active 
                                                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        {product.is_active ? 'Disable' : 'Enable'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Showing {((products.current_page - 1) * products.per_page) + 1} to {Math.min(products.current_page * products.per_page, products.total)} of {products.total} products
                                    </div>
                                    <div className="flex space-x-2">
                                        {products.current_page > 1 && (
                                            <Link
                                                href={route('seller.products.index', { ...filters, page: products.current_page - 1 })}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {products.current_page < products.last_page && (
                                            <Link
                                                href={route('seller.products.index', { ...filters, page: products.current_page + 1 })}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}