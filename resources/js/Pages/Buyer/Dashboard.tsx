import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Order } from '@/types';

interface BuyerDashboardProps {
    stats: {
        total_orders: number;
        pending_orders: number;
        delivered_orders: number;
        total_spent: number;
        cart_items: number;
        pending_reviews: number;
    };
    recent_orders: Order[];
}

export default function BuyerDashboard({ stats, recent_orders }: BuyerDashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                                <p className="text-gray-600 mt-2">Here's what's happening with your orders</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">📦</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.total_orders}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">⏳</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.pending_orders}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">✅</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Delivered</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.delivered_orders}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">💰</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
                                                <dd className="text-lg font-medium text-gray-900">${stats.total_spent}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">🛒</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Cart Items</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.cart_items}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-pink-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">⭐</span>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                                                <dd className="text-lg font-medium text-gray-900">{stats.pending_reviews}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white border rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                                </div>
                                <div className="px-6 py-4">
                                    {recent_orders.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                                            <p className="text-gray-500 text-lg">No orders yet</p>
                                            <p className="text-gray-400 mt-2 mb-6">Start shopping to see your orders here!</p>
                                            <Link 
                                                href={route('buyer.products.index')} 
                                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium inline-flex items-center space-x-2"
                                            >
                                                <span>Browse Products</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recent_orders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <Link 
                                                                    href={route('buyer.orders.show', order.id)} 
                                                                    className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                                                >
                                                                    Order #{order.order_number}
                                                                </Link>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    ${order.total_amount}
                                                                </p>
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {order.order_items && order.order_items.length > 0 && (
                                                            <div className="mt-2 flex items-center justify-between">
                                                                <p className="text-sm text-gray-600">
                                                                    {order.order_items.length} item(s): {' '}
                                                                    {order.order_items.slice(0, 2).map(item => item.product_name).join(', ')}
                                                                    {order.order_items.length > 2 && ` +${order.order_items.length - 2} more`}
                                                                </p>
                                                                {order.status === 'delivered' && (
                                                                    <Link 
                                                                        href={route('buyer.reviews.reviewable')} 
                                                                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                                                                    >
                                                                        Write Review
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Browse Products */}
                                    <Link href={route('buyer.products.index')} className="group">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform group-hover:scale-105">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold">Browse Products</h3>
                                                <span className="text-2xl">🛍️</span>
                                            </div>
                                            <p className="text-blue-100 mb-4">Discover amazing products from our sellers</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-100">Start Shopping</span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Shopping Cart */}
                                    <Link href={route('buyer.cart.index')} className="group">
                                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform group-hover:scale-105">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold">Shopping Cart</h3>
                                                <div className="relative">
                                                    <span className="text-2xl">🛒</span>
                                                    {stats.cart_items > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {stats.cart_items}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-indigo-100 mb-4">
                                                {stats.cart_items > 0 
                                                    ? `${stats.cart_items} item${stats.cart_items > 1 ? 's' : ''} in cart` 
                                                    : 'Your cart is empty'
                                                }
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-indigo-100">
                                                    {stats.cart_items > 0 ? 'View Cart' : 'Start Shopping'}
                                                </span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Track Orders */}
                                    <Link href={route('buyer.orders.index')} className="group">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 transform group-hover:scale-105">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold">Track Orders</h3>
                                                <span className="text-2xl">📦</span>
                                            </div>
                                            <p className="text-green-100 mb-4">
                                                {stats.total_orders > 0 
                                                    ? `${stats.pending_orders} pending order${stats.pending_orders !== 1 ? 's' : ''}` 
                                                    : 'No orders yet'
                                                }
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-green-100">View All Orders</span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Reviews */}
                                    <Link href={route('buyer.reviews.index')} className="group">
                                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg text-white hover:from-pink-600 hover:to-pink-700 transition-all duration-200 transform group-hover:scale-105">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold">My Reviews</h3>
                                                <div className="relative">
                                                    <span className="text-2xl">⭐</span>
                                                    {stats.pending_reviews > 0 && (
                                                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                            {stats.pending_reviews}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-pink-100 mb-4">
                                                {stats.pending_reviews > 0 
                                                    ? `${stats.pending_reviews} item${stats.pending_reviews > 1 ? 's' : ''} to review` 
                                                    : 'Manage your product reviews'
                                                }
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-pink-100">
                                                    {stats.pending_reviews > 0 ? 'Write Reviews' : 'View Reviews'}
                                                </span>
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Additional Navigation */}
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Need Help?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Link href={route('buyer.reviews.reviewable')} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                                <span className="text-yellow-600 text-xl">📝</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Write a Review</h3>
                                                <p className="text-sm text-gray-500">Share your experience</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <Link href={route('profile.edit')} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                <span className="text-purple-600 text-xl">⚙️</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Account Settings</h3>
                                                <p className="text-sm text-gray-500">Manage your profile</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <a href="#" className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 text-xl">💬</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Contact Support</h3>
                                                <p className="text-sm text-gray-500">Get help with orders</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}