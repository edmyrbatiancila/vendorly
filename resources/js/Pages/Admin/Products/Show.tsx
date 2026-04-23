import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Product } from '@/types';

interface ProductShowProps {
    product: Product;
}

export default function ProductShow({ product }: ProductShowProps) {
    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const toggleProductStatus = () => {
        router.put(route('admin.products.toggleStatus', product.id), {}, {
            preserveScroll: true,
        });
    };

    const deleteProduct = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', product.id), {
                onSuccess: () => {
                    router.visit(route('admin.products.index'));
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Product: ${product.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Link
                                        href={route('admin.products.index')}
                                        className="text-indigo-600 hover:text-indigo-900 mb-2 inline-block"
                                    >
                                        ← Back to Products
                                    </Link>
                                    <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                                    <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={toggleProductStatus}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            product.is_active
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                    >
                                        {product.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={deleteProduct}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                    >
                                        Delete Product
                                    </button>
                                </div>
                            </div>

                            {/* Product Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Product Images */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                                    {product.images && product.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {product.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`/storage/${image}`}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg border"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 rounded-lg border flex items-center justify-center">
                                            <p className="text-gray-500">No images available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
                                        <dl className="grid grid-cols-1 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.is_active)}`}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                    ${product.price}
                                                    {product.compare_price && (
                                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                                            ${product.compare_price}
                                                        </span>
                                                    )}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Stock Quantity</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{product.stock_quantity}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{product.category?.name || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Seller</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <Link
                                                        href={route('admin.sellers.show', product.seller?.id || 0)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {product.seller?.store_name} ({product.seller?.user?.name})
                                                    </Link>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                                <div className="prose max-w-none">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{product.description}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Product Specifications */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Specifications</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        {product.weight && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{product.weight} kg</dd>
                                            </div>
                                        )}
                                        {product.dimensions && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Track Inventory</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.track_inventory ? 'Yes' : 'No'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Min Stock Level</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.min_stock_level}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Dates */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
                                    <dl className="grid grid-cols-1 gap-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(product.created_at).toLocaleString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(product.updated_at).toLocaleString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            {product.reviews && product.reviews.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h3>
                                    <div className="space-y-4">
                                        {product.reviews.slice(0, 5).map((review) => (
                                            <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{review.user?.name}</p>
                                                        <div className="flex items-center mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`text-sm ${
                                                                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {review.comment && (
                                                    <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}