import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Order } from '@/types';

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
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

    const updateOrderStatus = (status: string) => {
        router.patch(route('admin.orders.update-status', order.id), { status }, {
            preserveScroll: true,
        });
    };

    const updatePaymentStatus = (payment_status: string) => {
        router.patch(route('admin.orders.update-payment-status', order.id), { payment_status }, {
            preserveScroll: true,
        });
    };

    const cancelOrder = () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.patch(route('admin.orders.cancel', order.id), {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Link
                                        href={route('admin.orders.index')}
                                        className="text-indigo-600 hover:text-indigo-900 mb-2 inline-block"
                                    >
                                        ← Back to Orders
                                    </Link>
                                    <h1 className="text-2xl font-semibold text-gray-900">Order #{order.order_number}</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Placed on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    {order.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateOrderStatus('processing')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                            >
                                                Mark as Processing
                                            </button>
                                            <button
                                                onClick={cancelOrder}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                            >
                                                Cancel Order
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'processing' && (
                                        <button
                                            onClick={() => updateOrderStatus('shipped')}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                                        >
                                            Mark as Shipped
                                        </button>
                                    )}
                                    {order.status === 'shipped' && (
                                        <button
                                            onClick={() => updateOrderStatus('delivered')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Order Details */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                                        {order.payment_status}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{order.payment_method}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                                                <dd className="mt-1 text-lg font-semibold text-gray-900">${order.total_amount}</dd>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mt-8">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.order_items?.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.product_name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    SKU: {item.product_sku}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {item.seller?.user?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                ${item.unit_price}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                                ${item.total_price}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer & Address Info */}
                                <div className="space-y-8">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="font-medium text-gray-900">{order.user?.name}</p>
                                            <p className="text-sm text-gray-600">{order.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Billing Address */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {order.billing_address && (
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="font-medium">{order.billing_address.name}</p>
                                                    <p>{order.billing_address.address}</p>
                                                    <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}</p>
                                                    <p>{order.billing_address.country}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {order.shipping_address && (
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p className="font-medium">{order.shipping_address.name}</p>
                                                    <p>{order.shipping_address.address}</p>
                                                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                                                    <p>{order.shipping_address.country}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal</span>
                                                <span>${order.subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Tax</span>
                                                <span>${order.tax_amount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Shipping</span>
                                                <span>${order.shipping_amount}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between font-medium">
                                                <span>Total</span>
                                                <span>${order.total_amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {order.notes && (
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-sm text-gray-600">{order.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}