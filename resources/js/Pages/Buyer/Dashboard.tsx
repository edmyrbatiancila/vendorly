import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Order } from '@/types';

interface BuyerDashboardProps {
    stats: {
        total_orders: number;
        pending_orders: number;
        delivered_orders: number;
        total_spent: number;
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white border rounded-lg p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">O</span>
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
                                                <span className="text-white text-sm font-medium">P</span>
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
                                                <span className="text-white text-sm font-medium">D</span>
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
                                                <span className="text-white text-sm font-medium">$</span>
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
                                            <p className="text-gray-400 mt-2">Start shopping to see your orders here!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {recent_orders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    Order #{order.order_number}
                                                                </p>
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
                                                            <div className="mt-2">
                                                                <p className="text-sm text-gray-600">
                                                                    {order.order_items.length} item(s): {' '}
                                                                    {order.order_items.slice(0, 2).map(item => item.product_name).join(', ')}
                                                                    {order.order_items.length > 2 && ` +${order.order_items.length - 2} more`}
                                                                </p>
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
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold">Browse Products</h3>
                                    <p className="text-blue-100 mt-2">Discover amazing products from our sellers</p>
                                    <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 font-medium">
                                        Start Shopping
                                    </button>
                                </div>

                                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold">Track Orders</h3>
                                    <p className="text-green-100 mt-2">Monitor your order status and delivery</p>
                                    <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-100 font-medium">
                                        View All Orders
                                    </button>
                                </div>

                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                                    <h3 className="text-lg font-semibold">Account Settings</h3>
                                    <p className="text-purple-100 mt-2">Update your profile and preferences</p>
                                    <button className="mt-4 bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100 font-medium">
                                        Manage Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}