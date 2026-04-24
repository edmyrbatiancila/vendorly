import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order, PageProps, Step } from '@/types';

interface OrderShowProps extends PageProps {
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

    const getStatusSteps = (): Step[] => {
        const steps = [
            { key: 'pending', label: 'Order Placed', completed: true },
            { key: 'paid', label: 'Payment Confirmed', completed: false },
            { key: 'processing', label: 'Processing', completed: false },
            { key: 'shipped', label: 'Shipped', completed: false },
            { key: 'delivered', label: 'Delivered', completed: false },
        ];

        const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
        const currentStatusIndex = statusOrder.indexOf(order.status);

        if (order.status === 'cancelled' || order.status === 'refunded') {
            return steps.map(step => ({ ...step, completed: false }));
        }

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentStatusIndex,
            current: index === currentStatusIndex,
        }));
    };

    const cancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(route('buyer.orders.cancel', order.id), {
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

    const statusSteps = getStatusSteps();

    return (
        <AuthenticatedLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href={route('buyer.orders.index')} className="text-gray-700 hover:text-gray-900">
                                    Orders
                                </Link>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-500">Order #{order.order_number}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="space-y-8">
                        {/* Order Header */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        Order #{order.order_number}
                                    </h1>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                    {(order.status === 'pending' || order.status === 'paid') && (
                                        <button
                                            onClick={cancelOrder}
                                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
                                <div className="flex items-center justify-between">
                                    {statusSteps.map((step, stepIdx) => (
                                        <div key={step.key} className="flex flex-col items-center">
                                            <div className="flex items-center">
                                                <div
                                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                                        step.completed
                                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                                            : step.current
                                                            ? 'border-indigo-600 text-indigo-600'
                                                            : 'border-gray-300 text-gray-300'
                                                    }`}
                                                >
                                                    {step.completed ? (
                                                        <span className="text-sm font-bold">✓</span>
                                                    ) : (
                                                        <span className="text-sm font-bold">{stepIdx + 1}</span>
                                                    )}
                                                </div>
                                                {stepIdx < statusSteps.length - 1 && (
                                                    <div
                                                        className={`w-full h-0.5 ml-4 ${
                                                            step.completed ? 'bg-indigo-600' : 'bg-gray-300'
                                                        }`}
                                                        style={{ width: '80px' }}
                                                    />
                                                )}
                                            </div>
                                            <p
                                                className={`mt-2 text-sm text-center ${
                                                    step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                                                }`}
                                            >
                                                {step.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {order.shipped_at && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                        <p className="text-sm text-blue-800">
                                            <strong>Shipped:</strong> {new Date(order.shipped_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {order.delivered_at && (
                                    <div className="mt-6 p-4 bg-green-50 rounded-md">
                                        <p className="text-sm text-green-800">
                                            <strong>Delivered:</strong> {new Date(order.delivered_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Order Items */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    {/* Product Image */}
                                                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {item.product_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            SKU: {item.product_sku}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Sold by {item.seller?.store_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            ${item.total_price.toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            ${item.unit_price.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Review Button */}
                                                {order.status === 'delivered' && (
                                                    <div className="mt-4 flex justify-end">
                                                        <Link
                                                            href={route('buyer.reviews.create', item.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                        >
                                                            Write a Review
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary & Details */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Order Summary */}
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">
                                                {order.shipping_amount === 0 ? 'FREE' : `$${order.shipping_amount.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">${order.tax_amount.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between text-lg font-medium">
                                                <span>Total</span>
                                                <span>${order.total_amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Method</p>
                                            <p className="font-medium capitalize">
                                                {order.payment_method?.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Status</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.payment_status === 'paid' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Addresses</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Billing Address</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>{order.billing_address?.first_name} {order.billing_address?.last_name}</p>
                                                <p>{order.billing_address?.address_line_1}</p>
                                                {order.billing_address?.address_line_2 && (
                                                    <p>{order.billing_address.address_line_2}</p>
                                                )}
                                                <p>
                                                    {order.billing_address?.city}, {order.billing_address?.state} {order.billing_address?.postal_code}
                                                </p>
                                                <p>{order.billing_address?.country}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                                                <p>{order.shipping_address?.address_line_1}</p>
                                                {order.shipping_address?.address_line_2 && (
                                                    <p>{order.shipping_address.address_line_2}</p>
                                                )}
                                                <p>
                                                    {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                                                </p>
                                                <p>{order.shipping_address?.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                {order.notes && (
                                    <div className="bg-white rounded-lg shadow-sm">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
                                        </div>
                                        <div className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{order.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}