import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Order } from '@/types';

interface OrdersIndexProps {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    stats: {
        total_orders: number;
        pending_orders: number;
        delivered_orders: number;
        total_revenue: number;
    };
    filters: {
        search?: string;
        status?: string;
        payment_status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function OrdersIndex({ orders, stats, filters }: OrdersIndexProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.orders.index'), {
            ...filters,
            [key]: value === filters[key as keyof typeof filters] ? '' : value,
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        
        router.get(route('admin.orders.index'), {
            ...filters,
            search,
        });
    };

    const handleDateFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const date_from = formData.get('date_from') as string;
        const date_to = formData.get('date_to') as string;
        
        router.get(route('admin.orders.index'), {
            ...filters,
            date_from,
            date_to,
        });
    };

    const updateOrderStatus = (order: Order, status: string) => {
        router.patch(route('admin.orders.update-status', order.id), { status }, {
            preserveScroll: true,
        });
    };

    const cancelOrder = (order: Order) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.patch(route('admin.orders.cancel', order.id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Orders Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-semibold text-blue-600">{stats.total_orders}</div>
                                    <div className="text-sm text-blue-600">Total Orders</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <div className="text-2xl font-semibold text-yellow-600">{stats.pending_orders}</div>
                                    <div className="text-sm text-yellow-600">Pending Orders</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-semibold text-green-600">{stats.delivered_orders}</div>
                                    <div className="text-sm text-green-600">Delivered Orders</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-semibold text-purple-600">${stats.total_revenue}</div>
                                    <div className="text-sm text-purple-600">Total Revenue</div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {/* Search */}
                                    <div>
                                        <form onSubmit={handleSearch}>
                                            <input
                                                type="text"
                                                name="search"
                                                placeholder="Search orders or customers..."
                                                defaultValue={filters.search}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </form>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <select
                                            value={filters.status || ''}
                                            onChange={(e) => handleFilter('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>

                                    {/* Payment Status Filter */}
                                    <div>
                                        <select
                                            value={filters.payment_status || ''}
                                            onChange={(e) => handleFilter('payment_status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Payment Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </div>

                                    {/* Date From */}
                                    <div>
                                        <input
                                            type="date"
                                            name="date_from"
                                            defaultValue={filters.date_from}
                                            onChange={(e) => handleFilter('date_from', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    {/* Date To */}
                                    <div>
                                        <input
                                            type="date"
                                            name="date_to"
                                            defaultValue={filters.date_to}
                                            onChange={(e) => handleFilter('date_to', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Orders Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{order.order_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.user?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.user?.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.order_items?.length || 0} items
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${order.total_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={route('admin.orders.show', order.id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            View
                                                        </Link>
                                                        {order.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateOrderStatus(order, 'processing')}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    Process
                                                                </button>
                                                                <button
                                                                    onClick={() => cancelOrder(order)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.status === 'processing' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order, 'shipped')}
                                                                className="text-purple-600 hover:text-purple-900"
                                                            >
                                                                Ship
                                                            </button>
                                                        )}
                                                        {order.status === 'shipped' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order, 'delivered')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Deliver
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-700">
                                        Showing {((orders.current_page - 1) * orders.per_page) + 1} to{' '}
                                        {Math.min(orders.current_page * orders.per_page, orders.total)} of{' '}
                                        {orders.total} results
                                    </div>
                                    <div className="flex space-x-1">
                                        {orders.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-indigo-600 text-white'
                                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
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