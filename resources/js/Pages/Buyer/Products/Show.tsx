import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, PageProps } from '@/types';
import { useState } from 'react';

interface ProductShowProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductShow({ product, relatedProducts }: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const addToCart = async () => {
        setIsAddingToCart(true);
        try {
            const response = await fetch(route('buyer.cart.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Product added to cart!');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                ⭐
            </span>
        ));
    };

    const getDiscountPercentage = () => {
        if (!product.compare_price || product.compare_price <= product.price) return null;
        return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
    };

    return (
        <AuthenticatedLayout>
            <Head title={product.name} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href={route('buyer.products.index')} className="text-gray-700 hover:text-gray-900">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link href={`${route('buyer.products.index')}?category=${product.category?.id}`} className="text-gray-700 hover:text-gray-900">
                                        {product.category?.name}
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-500">{product.name}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Product Images */}
                        <div>
                            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={`/storage/${product.images[selectedImage]}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                                                selectedImage === index ? 'border-indigo-600' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-gray-600">SKU: {product.sku}</p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="flex items-center">
                                    {renderStars(product.rating_avg)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating_avg.toFixed(1)} ({product.rating_count} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-4">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${product.price}
                                    </span>
                                    {product.compare_price && product.compare_price > product.price && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                ${product.compare_price}
                                            </span>
                                            <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                                {getDiscountPercentage()}% OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock_quantity > 0 ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                        <span className="text-green-700 font-medium">
                                            In Stock ({product.stock_quantity} available)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                        <span className="text-red-700 font-medium">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Seller Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="font-medium text-gray-900 mb-2">Sold by</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-indigo-600 font-medium">
                                            {product.seller?.store_name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.seller?.store_name}</p>
                                        <p className="text-sm text-gray-600">Verified Seller</p>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            {product.stock_quantity > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <label htmlFor="quantity" className="font-medium text-gray-700">
                                            Quantity:
                                        </label>
                                        <select
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={addToCart}
                                            disabled={isAddingToCart}
                                            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                        <Link
                                            href={route('buyer.cart.index')}
                                            className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                                        >
                                            View Cart
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Short Description */}
                            {product.short_description && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                                    <p className="text-gray-700">{product.short_description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                            <div className="space-y-6">
                                {product.reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {review.user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{review.user?.name}</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex">{renderStars(review.rating)}</div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-700 ml-14">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={route('buyer.products.show', relatedProduct.id)}
                                        className="group"
                                    >
                                        <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="aspect-square bg-gray-200 overflow-hidden">
                                                {relatedProduct.images && relatedProduct.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${relatedProduct.images[0]}`}
                                                        alt={relatedProduct.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="flex items-center space-x-1 mb-2">
                                                    {renderStars(relatedProduct.rating_avg)}
                                                    <span className="text-sm text-gray-500">
                                                        ({relatedProduct.rating_count})
                                                    </span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    ${relatedProduct.price}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}