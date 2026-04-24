import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { OrderItem, PageProps } from '@/types';
import { useState } from 'react';

interface CreateReviewProps extends PageProps {
    orderItem: OrderItem;
}

export default function CreateReview({ orderItem }: CreateReviewProps) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        order_item_id: orderItem.id,
        rating: 0,
        comment: '',
        images: [] as File[],
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxImages = 5;
        
        if (selectedImages.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        const newImages = [...selectedImages, ...files];
        setSelectedImages(newImages);
        setData('images', newImages);

        // Create previews
        const newPreviews = [...imagePreviews];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (data.rating === 0) {
            alert('Please select a rating.');
            return;
        }

        const formData = new FormData();
        formData.append('order_item_id', data.order_item_id.toString());
        formData.append('rating', data.rating.toString());
        formData.append('comment', data.comment);
        
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        router.post(route('buyer.reviews.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
        });
    };

    const setRating = (rating: number) => {
        setData('rating', rating);
    };

    const renderStars = (rating: number, interactive = false) => {
        return Array.from({ length: 5 }, (_, index) => (
            <button
                key={index}
                type="button"
                onClick={interactive ? () => setRating(index + 1) : undefined}
                className={`text-2xl ${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'} ${
                    index < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                disabled={!interactive}
            >
                ⭐
            </button>
        ));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Review ${orderItem.product_name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href={route('buyer.reviews.index')} className="text-gray-700 hover:text-gray-900">
                                    My Reviews
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <Link href={route('buyer.reviews.reviewable')} className="text-gray-700 hover:text-gray-900">
                                        Write Reviews
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-500">New Review</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Review Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h1>

                                    {/* Product Info */}
                                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                {orderItem.product?.images && orderItem.product.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${orderItem.product.images[0]}`}
                                                        alt={orderItem.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{orderItem.product_name}</h3>
                                                <p className="text-sm text-gray-500">SKU: {orderItem.product_sku}</p>
                                                <p className="text-sm text-gray-500">
                                                    From Order #{orderItem.order?.order_number}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Overall Rating *
                                        </label>
                                        <div className="flex items-center space-x-1">
                                            {renderStars(data.rating, true)}
                                            <span className="ml-3 text-sm text-gray-600">
                                                {data.rating > 0 ? `${data.rating} out of 5 stars` : 'Click to rate'}
                                            </span>
                                        </div>
                                        {errors.rating && (
                                            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                                        )}
                                    </div>

                                    {/* Review Comment */}
                                    <div className="mb-6">
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Review
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={6}
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            placeholder="Share your experience with this product. What did you like or dislike? How would you use it again?"
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Help other buyers by sharing your experience with this product.
                                        </p>
                                        {errors.comment && (
                                            <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add Photos (Optional)
                                        </label>
                                        <div className="space-y-4">
                                            {/* Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload Button */}
                                            {selectedImages.length < 5 && (
                                                <div>
                                                    <label
                                                        htmlFor="images"
                                                        className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400"
                                                    >
                                                        <div className="space-y-1 text-center">
                                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className="flex text-sm text-gray-600">
                                                                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Upload images
                                                                </span>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                PNG, JPG, GIF up to 2MB each (max 5 images)
                                                            </p>
                                                        </div>
                                                    </label>
                                                    <input
                                                        id="images"
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                        className="hidden"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {errors.images && (
                                            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <Link
                                            href={route('buyer.reviews.reviewable')}
                                            className="text-gray-500 hover:text-gray-700 font-medium"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing || data.rating === 0}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Review Guidelines */}
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Review Guidelines</h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Share your honest experience with the product</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Include helpful details about quality, fit, and performance</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Add photos to show the product in use</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            <span>Don't include personal information</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            <span>Avoid inappropriate language or content</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h4 className="text-sm font-medium text-blue-800">
                                                    Verified Purchase
                                                </h4>
                                                <p className="mt-1 text-sm text-blue-700">
                                                    Your review will be marked as a verified purchase since you bought this product.
                                                </p>
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