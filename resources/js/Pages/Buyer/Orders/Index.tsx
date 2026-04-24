import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order, PageProps } from '@/types';
import { useState } from 'react';

interface OrdersIndexProps extends PageProps {
    orders: {
        data: Order[];
        links: any[];
        meta: any;
    };
    statusCounts: Record<string, number>;
    filters: {
        status?: string;
        from_date?: string;
        to_date?: string;
    };
}

export default function OrdersIndex({ orders, statusCounts, filters }: OrdersIndexProps) {
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    const applyFilters = () => {
        const params: any = {};
        if (selectedStatus) params.status = selectedStatus;
        if (fromDate) params.from_date = fromDate;
        if (toDate) params.to_date = toDate;

        router.get(route('buyer.orders.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSelectedStatus('');
        setFromDate('');
        setToDate('');
        router.get(route('buyer.orders.index'));
    };

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

    const cancelOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(route('buyer.orders.cancel', orderId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                router.reload();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order.');
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Orders</h2>}
        >
            <Head title="My Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Status Tabs */}
                    <div className="mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => {
                                        setSelectedStatus('');
                                        applyFilters();
                                    }}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        !selectedStatus
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    All Orders {orders.meta.total > 0 && `(${orders.meta.total})`}
                                </button>
                                {Object.entries(statusCounts).map(([status, count]) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setSelectedStatus(status);
                                            applyFilters();
                                        }}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                                            selectedStatus === status
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {status.replace('_', ' ')} ({count})
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">From Date</label>
                                <input
                                    type="date"
                                    id="from_date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">To Date</label>
                                <input
                                    type="date"
                                    id="to_date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={applyFilters}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border">
                                    {/* Order Header */}
                                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    Order #{order.order_number}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-lg font-medium text-gray-900">
                                                    ${order.total_amount}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.order_items?.length} item(s)
                                                </p>
                                            </div>
                                            <Link
                                                href={route('buyer.orders.show', order.id)}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    {order.order_items && order.order_items.length > 0 && (
                                        <div className="px-6 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {order.order_items.slice(0, 3).map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                                                            {item.product?.images && item.product.images.length > 0 ? (
                                                                <img
                                                                    src={`/storage/${item.product.images[0]}`}
                                                                    alt={item.product_name}
                                                                    className="w-full h-full object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                    No Image
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {item.product_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.quantity} × ${item.unit_price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.order_items.length > 3 && (
                                                    <div className="flex items-center justify-center text-gray-500 text-sm">
                                                        +{order.order_items.length - 3} more items
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Actions */}
                                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
                                        <div>
                                            {order.status === 'delivered' && (
                                                <Link
                                                    href={route('buyer.reviews.reviewable')}
                                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Write Reviews
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex space-x-3">
                                            {(order.status === 'pending' || order.status === 'paid') && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            <Link
                                                href={route('buyer.orders.show', order.id)}
                                                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                            >
                                                View Order
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm text-center py-12">
                            <div className="text-6xl text-gray-300 mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500 mb-6">
                                {selectedStatus 
                                    ? `You don't have any ${selectedStatus} orders.`
                                    : "You haven't placed any orders yet."
                                }
                            </p>
                            <Link
                                href={route('buyer.products.index')}
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.meta.total > orders.meta.per_page && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {orders.links.find(link => link.label === '&laquo; Previous')?.url && (
                                    <Link
                                        href={orders.links.find(link => link.label === '&laquo; Previous')!.url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {orders.links.find(link => link.label === 'Next &raquo;')?.url && (
                                    <Link
                                        href={orders.links.find(link => link.label === 'Next &raquo;')!.url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{orders.meta.from}</span> to{' '}
                                        <span className="font-medium">{orders.meta.to}</span> of{' '}
                                        <span className="font-medium">{orders.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === orders.links.length - 1 ? 'rounded-r-md' : ''
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