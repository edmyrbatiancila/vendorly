import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Cart, User, PageProps } from '@/types';
import { useState } from 'react';

interface CheckoutProps extends PageProps {
    cartItems: Cart[];
    orderSummary: {
        subtotal: number;
        tax_amount: number;
        shipping_amount: number;
        total: number;
        item_count: number;
        total_quantity: number;
    };
    savedAddresses: any[];
    user: User;
}

export default function Checkout({ cartItems, orderSummary, savedAddresses, user }: CheckoutProps) {
    const [sameAsBilling, setSameAsBilling] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        billing_address: {
            first_name: user.name.split(' ')[0] || '',
            last_name: user.name.split(' ').slice(1).join(' ') || '',
            email: user.email,
            phone: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'United States',
        },
        shipping_address: {
            first_name: user.name.split(' ')[0] || '',
            last_name: user.name.split(' ').slice(1).join(' ') || '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'United States',
        },
        payment_method: 'credit_card',
        notes: '',
        same_as_billing: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = {
            ...data,
            shipping_address: sameAsBilling ? data.billing_address : data.shipping_address,
        };

        router.post(route('buyer.orders.store'), formData, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors: any) => {
                console.error('Checkout errors:', errors);
                setIsProcessing(false);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const updateBillingAddress = (field: string, value: string) => {
        setData('billing_address', {
            ...data.billing_address,
            [field]: value,
        });

        // If same as billing is checked, update shipping address too
        if (sameAsBilling) {
            setData('shipping_address', {
                ...data.shipping_address,
                [field]: value,
            });
        }
    };

    const updateShippingAddress = (field: string, value: string) => {
        setData('shipping_address', {
            ...data.shipping_address,
            [field]: value,
        });
    };

    const handleSameAsBillingChange = (checked: boolean) => {
        setSameAsBilling(checked);
        setData('same_as_billing', checked);

        if (checked) {
            setData('shipping_address', { ...data.billing_address });
        }
    };

    if (cartItems.length === 0) {
        router.get(route('buyer.cart.index'));
        return null;
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Checkout</h2>}
        >
            <Head title="Checkout" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Billing Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Billing Address</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="billing_first_name" className="block text-sm font-medium text-gray-700">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_first_name"
                                                value={data.billing_address.first_name}
                                                onChange={(e) => updateBillingAddress('first_name', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.first_name'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.first_name']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_last_name" className="block text-sm font-medium text-gray-700">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_last_name"
                                                value={data.billing_address.last_name}
                                                onChange={(e) => updateBillingAddress('last_name', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.last_name'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.last_name']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="billing_email"
                                                value={data.billing_address.email}
                                                onChange={(e) => updateBillingAddress('email', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.email'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.email']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_phone" className="block text-sm font-medium text-gray-700">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                id="billing_phone"
                                                value={data.billing_address.phone}
                                                onChange={(e) => updateBillingAddress('phone', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.phone'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.phone']}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="billing_address_line_1" className="block text-sm font-medium text-gray-700">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_address_line_1"
                                                value={data.billing_address.address_line_1}
                                                onChange={(e) => updateBillingAddress('address_line_1', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.address_line_1'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.address_line_1']}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="billing_address_line_2" className="block text-sm font-medium text-gray-700">
                                                Address Line 2 (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_address_line_2"
                                                value={data.billing_address.address_line_2}
                                                onChange={(e) => updateBillingAddress('address_line_2', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_city"
                                                value={data.billing_address.city}
                                                onChange={(e) => updateBillingAddress('city', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.city'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.city']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_state" className="block text-sm font-medium text-gray-700">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_state"
                                                value={data.billing_address.state}
                                                onChange={(e) => updateBillingAddress('state', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.state'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.state']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_postal_code" className="block text-sm font-medium text-gray-700">
                                                Postal Code *
                                            </label>
                                            <input
                                                type="text"
                                                id="billing_postal_code"
                                                value={data.billing_address.postal_code}
                                                onChange={(e) => updateBillingAddress('postal_code', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            />
                                            {errors['billing_address.postal_code'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.postal_code']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="billing_country" className="block text-sm font-medium text-gray-700">
                                                Country *
                                            </label>
                                            <select
                                                id="billing_country"
                                                value={data.billing_address.country}
                                                onChange={(e) => updateBillingAddress('country', e.target.value)}
                                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="United States">United States</option>
                                                <option value="Canada">Canada</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                            </select>
                                            {errors['billing_address.country'] && (
                                                <p className="mt-1 text-sm text-red-600">{errors['billing_address.country']}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sameAsBilling}
                                                onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Same as billing address</span>
                                        </label>
                                    </div>

                                    {!sameAsBilling && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Shipping address fields (similar to billing) */}
                                            <div>
                                                <label htmlFor="shipping_first_name" className="block text-sm font-medium text-gray-700">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_first_name"
                                                    value={data.shipping_address.first_name}
                                                    onChange={(e) => updateShippingAddress('first_name', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="shipping_last_name" className="block text-sm font-medium text-gray-700">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_last_name"
                                                    value={data.shipping_address.last_name}
                                                    onChange={(e) => updateShippingAddress('last_name', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="shipping_address_line_1" className="block text-sm font-medium text-gray-700">
                                                    Address Line 1 *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_address_line_1"
                                                    value={data.shipping_address.address_line_1}
                                                    onChange={(e) => updateShippingAddress('address_line_1', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="shipping_address_line_2" className="block text-sm font-medium text-gray-700">
                                                    Address Line 2 (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_address_line_2"
                                                    value={data.shipping_address.address_line_2}
                                                    onChange={(e) => updateShippingAddress('address_line_2', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_city"
                                                    value={data.shipping_address.city}
                                                    onChange={(e) => updateShippingAddress('city', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_state"
                                                    value={data.shipping_address.state}
                                                    onChange={(e) => updateShippingAddress('state', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="shipping_postal_code" className="block text-sm font-medium text-gray-700">
                                                    Postal Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="shipping_postal_code"
                                                    value={data.shipping_address.postal_code}
                                                    onChange={(e) => updateShippingAddress('postal_code', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700">
                                                    Country *
                                                </label>
                                                <select
                                                    id="shipping_country"
                                                    value={data.shipping_address.country}
                                                    onChange={(e) => updateShippingAddress('country', e.target.value)}
                                                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="United States">United States</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="United Kingdom">United Kingdom</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h3>
                                    
                                    <div className="space-y-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="credit_card"
                                                checked={data.payment_method === 'credit_card'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="rounded-full border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">Credit Card</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="paypal"
                                                checked={data.payment_method === 'paypal'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="rounded-full border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">PayPal</span>
                                        </label>

                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="bank_transfer"
                                                checked={data.payment_method === 'bank_transfer'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="rounded-full border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">Bank Transfer</span>
                                        </label>
                                    </div>

                                    {errors.payment_method && (
                                        <p className="mt-2 text-sm text-red-600">{errors.payment_method}</p>
                                    )}
                                </div>

                                {/* Order Notes */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-6">Order Notes (Optional)</h3>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Special instructions for your order..."
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-sm sticky top-8">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="px-6 py-4 max-h-64 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                    {item.product?.images && item.product.images.length > 0 ? (
                                                        <img
                                                            src={`/storage/${item.product.images[0]}`}
                                                            alt={item.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × ${item.product?.price}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="px-6 py-4 border-t border-gray-200 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal ({orderSummary.total_quantity} items)</span>
                                            <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">
                                                {orderSummary.shipping_amount === 0 ? 'FREE' : `$${orderSummary.shipping_amount.toFixed(2)}`}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">${orderSummary.tax_amount.toFixed(2)}</span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between text-lg font-medium">
                                                <span>Total</span>
                                                <span>${orderSummary.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <div className="px-6 py-4 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={processing || isProcessing}
                                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing || isProcessing ? 'Processing...' : 'Place Order'}
                                        </button>

                                        <div className="mt-4 text-center">
                                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                                <span>🔒</span>
                                                <span>Secure checkout with SSL encryption</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}