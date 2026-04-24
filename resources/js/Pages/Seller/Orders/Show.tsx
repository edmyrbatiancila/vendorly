import { Head, Link, router } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Order, OrderItem } from '@/types';

interface SellerOrderShowProps {
    order: Order;
    orderItems: OrderItem[];
}

export default function SellerOrderShow({ order, orderItems }: SellerOrderShowProps) {
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateOrderStatus = (orderItemId: number, status: string) => {
        router.patch(route('seller.orders.update-status', orderItemId), {
            status: status
        }, {
            onSuccess: () => {
                // Handle success - page will refresh
            }
        });
    };

    const totalSellerAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);

    return (
        <SellerLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('seller.orders.index')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Orders
                        </Link>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Order Header */}
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Order #{order.order_number}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Placed on {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Customer</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div>
                                            <p className="font-medium">{order.user?.name}</p>
                                            <p className="text-gray-600">{order.user?.email}</p>
                                        </div>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {order.shipping_address ? (
                                            <div>
                                                <p>{order.shipping_address.line1}</p>
                                                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                                                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                                                <p>{order.shipping_address.country}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No shipping address</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {order.payment_status || 'Pending'}
                                        </span>
                                    </dd>
                                </div>

                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Total Order Value</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="space-y-1">
                                            <p>Subtotal: {formatCurrency(order.subtotal)}</p>
                                            <p>Tax: {formatCurrency(order.tax_amount)}</p>
                                            <p>Shipping: {formatCurrency(order.shipping_amount)}</p>
                                            <p className="font-bold border-t pt-1">Total: {formatCurrency(order.total_amount)}</p>
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Products in this Order</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Products from your store in this order (Your earnings: {formatCurrency(totalSellerAmount)})
                            </p>
                        </div>

                        <div className="border-t border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                SKU
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.product_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.product?.category?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.product_sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(item.unit_price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(item.total_price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {order.status === 'paid' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => updateOrderStatus(item.id, 'processing')}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Mark Processing
                                                            </button>
                                                        </div>
                                                    )}
                                                    {order.status === 'processing' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => updateOrderStatus(item.id, 'shipped')}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Mark Shipped
                                                            </button>
                                                        </div>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => updateOrderStatus(item.id, 'delivered')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        </div>
                                                    )}
                                                    {(['delivered', 'cancelled', 'refunded'].includes(order.status)) && (
                                                        <span className="text-gray-400">No actions available</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Notes</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <p className="text-sm text-gray-700">{order.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}