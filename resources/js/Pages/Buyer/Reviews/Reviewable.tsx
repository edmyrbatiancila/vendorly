import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { OrderItem, PageProps } from '@/types';

interface ReviewableProps extends PageProps {
    reviewableItems: {
        data: OrderItem[];
        links: any[];
        meta: any;
    };
}

export default function Reviewable({ reviewableItems }: ReviewableProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Write Reviews</h2>}
        >
            <Head title="Write Reviews" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Write Product Reviews</h1>
                        <p className="text-gray-600 mt-1">
                            Share your experience with products you've purchased
                        </p>
                    </div>

                    {/* Reviewable Items */}
                    {reviewableItems.data.length > 0 ? (
                        <div className="space-y-6">
                            {reviewableItems.data.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                                    <div className="flex items-center space-x-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                            {item.product?.images && item.product.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.product.images[0]}`}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                {item.product_name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                SKU: {item.product_sku}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>Order #{item.order?.order_number}</span>
                                                <span>•</span>
                                                <span>
                                                    Delivered on {new Date(item.order?.delivered_at || item.order?.created_at || new Date()).toLocaleDateString()}
                                                </span>
                                                <span>•</span>
                                                <span>Quantity: {item.quantity}</span>
                                                <span>•</span>
                                                <span>${item.unit_price} each</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex-shrink-0">
                                            <Link
                                                href={route('buyer.reviews.create', item.id)}
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                            >
                                                Write Review
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Additional Product Info */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Sold by</p>
                                                    <p className="font-medium text-gray-900">
                                                        {item.seller?.store_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Paid</p>
                                                    <p className="font-medium text-gray-900">
                                                        ${item.total_price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Order Status</p>
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Delivered
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm text-center py-12">
                            <div className="text-6xl text-gray-300 mb-4">📝</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nothing to review</h3>
                            <p className="text-gray-500 mb-6">
                                You don't have any delivered orders that need reviews.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    href={route('buyer.products.index')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Start Shopping
                                </Link>
                                <Link
                                    href={route('buyer.orders.index')}
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    View Orders
                                </Link>
                                <Link
                                    href={route('buyer.reviews.index')}
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    My Reviews
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {reviewableItems.meta.total > reviewableItems.meta.per_page && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {reviewableItems.links.find(link => link.label === '&laquo; Previous')?.url && (
                                    <Link
                                        href={reviewableItems.links.find(link => link.label === '&laquo; Previous')!.url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {reviewableItems.links.find(link => link.label === 'Next &raquo;')?.url && (
                                    <Link
                                        href={reviewableItems.links.find(link => link.label === 'Next &raquo;')!.url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{reviewableItems.meta.from}</span> to{' '}
                                        <span className="font-medium">{reviewableItems.meta.to}</span> of{' '}
                                        <span className="font-medium">{reviewableItems.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        {reviewableItems.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === reviewableItems.links.length - 1 ? 'rounded-r-md' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Helper Info */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    About Product Reviews
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        You can only review products from delivered orders. Your reviews help other buyers make informed decisions and help sellers improve their products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}