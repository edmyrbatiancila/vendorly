import { Head, Link } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Product } from '@/types';

interface SellerProductShowProps {
    product: Product;
}

export default function SellerProductShow({ product }: SellerProductShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStockStatusColor = (product: Product) => {
        if (product.stock_quantity === 0) return 'bg-red-100 text-red-800';
        if (product.stock_quantity <= product.min_stock_level) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStockStatusText = (product: Product) => {
        if (product.stock_quantity === 0) return 'Out of Stock';
        if (product.stock_quantity <= product.min_stock_level) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <SellerLayout>
            <Head title={`Product: ${product.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('seller.products.index')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Products
                        </Link>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Product Header */}
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStockStatusColor(product)}`}>
                                        {getStockStatusText(product)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-3">
                                <Link
                                    href={route('seller.products.edit', product.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Product
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this product?')) {
                                            // Handle delete
                                        }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Delete Product
                                </button>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {product.category?.name || 'Uncategorized'}
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {product.description || 'No description provided'}
                                    </dd>
                                </div>

                                {product.short_description && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Short Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {product.short_description}
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Pricing</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="space-y-1">
                                            <p><span className="font-medium">Price:</span> {formatCurrency(product.price)}</p>
                                            {product.compare_price && (
                                                <p><span className="font-medium">Compare Price:</span> {formatCurrency(product.compare_price)}</p>
                                            )}
                                            {product.compare_price && (
                                                <p className="text-green-600">
                                                    <span className="font-medium">Discount:</span> 
                                                    {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% off
                                                </p>
                                            )}
                                        </div>
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Inventory</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p><span className="font-medium">Current Stock:</span> {product.stock_quantity}</p>
                                                <p><span className="font-medium">Min Stock Level:</span> {product.min_stock_level}</p>
                                            </div>
                                            <div>
                                                <p><span className="font-medium">Stock Status:</span> {getStockStatusText(product)}</p>
                                                <p><span className="font-medium">Track Inventory:</span> {product.track_inventory ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </dd>
                                </div>

                                {product.weight && (
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Weight</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {product.weight} kg
                                        </dd>
                                    </div>
                                )}

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="space-y-1">
                                            <p><span className="font-medium">Active:</span> {product.is_active ? 'Yes' : 'No'}</p>
                                            <p><span className="font-medium">Featured:</span> {product.is_featured ? 'Yes' : 'No'}</p>
                                        </div>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Dates</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="space-y-1">
                                            <p><span className="font-medium">Created:</span> {formatDate(product.created_at)}</p>
                                            <p><span className="font-medium">Last Updated:</span> {formatDate(product.updated_at)}</p>
                                        </div>
                                    </dd>
                                </div>

                                {product.images && product.images.length > 0 && (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Images</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <div className="grid grid-cols-3 gap-4">
                                                {product.images.slice(0, 6).map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={image}
                                                            alt={`${product.name} - Image ${index + 1}`}
                                                            className="h-24 w-24 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Sales Summary */}
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Performance</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Sales statistics for this product
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-sm text-gray-500">Units Sold</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(0)}</div>
                                    <div className="text-sm text-gray-500">Total Revenue</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">0</div>
                                    <div className="text-sm text-gray-500">Total Orders</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}