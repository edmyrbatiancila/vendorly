import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Cart, PageProps } from '@/types';
import { useState } from 'react';

interface CartIndexProps extends PageProps {
    cartItems: Cart[];
    cartSummary: {
        subtotal: number;
        tax_amount: number;
        shipping_amount: number;
        total: number;
        item_count: number;
        total_quantity: number;
    };
}

export default function CartIndex({ cartItems, cartSummary }: CartIndexProps) {
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [isRemoving, setIsRemoving] = useState<number | null>(null);

    const updateQuantity = async (cartItemId: number, newQuantity: number) => {
        setIsUpdating(cartItemId);
        try {
            const response = await fetch(route('buyer.cart.update', cartItemId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    quantity: newQuantity,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                router.reload({ only: ['cartItems', 'cartSummary'] });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            alert('Failed to update cart item.');
        } finally {
            setIsUpdating(null);
        }
    };

    const removeItem = async (cartItemId: number) => {
        setIsRemoving(cartItemId);
        try {
            const response = await fetch(route('buyer.cart.destroy', cartItemId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                router.reload({ only: ['cartItems', 'cartSummary'] });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item.');
        } finally {
            setIsRemoving(null);
        }
    };

    const clearCart = async () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        try {
            const response = await fetch(route('buyer.cart.clear'), {
                method: 'DELETE',
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
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart.');
        }
    };

    if (cartItems.length === 0) {
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Shopping Cart</h2>}
            >
                <Head title="Shopping Cart" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <div className="text-6xl text-gray-300 mb-4">🛒</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                                <Link
                                    href={route('buyer.products.index')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Shopping Cart</h2>}
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Cart Items ({cartSummary.item_count})
                                    </h3>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                {/* Product Image */}
                                                <Link href={route('buyer.products.show', item.product!.id)}>
                                                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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
                                                </Link>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={route('buyer.products.show', item.product!.id)}
                                                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                                    >
                                                        {item.product?.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        by {item.product?.seller?.store_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU: {item.product?.sku}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${item.product?.price}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        disabled={item.quantity <= 1 || isUpdating === item.id}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-medium">
                                                        {isUpdating === item.id ? '...' : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= (item.product?.stock_quantity || 0) || isUpdating === item.id}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Total Price */}
                                                <div className="text-sm font-medium text-gray-900">
                                                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={isRemoving === item.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                >
                                                    {isRemoving === item.id ? '...' : '🗑️'}
                                                </button>
                                            </div>

                                            {/* Stock Warning */}
                                            {item.product && item.quantity > item.product.stock_quantity && (
                                                <div className="mt-2 text-sm text-red-600">
                                                    Only {item.product.stock_quantity} items available in stock
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm sticky top-8">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                </div>

                                <div className="px-6 py-4 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cartSummary.total_quantity} items)</span>
                                        <span className="font-medium">${cartSummary.subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {cartSummary.shipping_amount === 0 ? 'FREE' : `$${cartSummary.shipping_amount.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">${cartSummary.tax_amount.toFixed(2)}</span>
                                    </div>

                                    {cartSummary.shipping_amount === 0 && cartSummary.subtotal < 100 && (
                                        <div className="text-sm text-gray-500 bg-green-50 p-3 rounded-md">
                                            Add ${(100 - cartSummary.subtotal).toFixed(2)} more for free shipping!
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-medium">
                                            <span>Total</span>
                                            <span>${cartSummary.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200">
                                    <Link
                                        href={route('buyer.orders.checkout')}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-center block"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <Link
                                        href={route('buyer.products.index')}
                                        className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-center block"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>

                                {/* Security Info */}
                                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <span>🔒</span>
                                        <span>Secure checkout with SSL encryption</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}