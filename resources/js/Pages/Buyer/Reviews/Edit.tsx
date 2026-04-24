import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Review, PageProps } from '@/types';
import { useState } from 'react';

interface EditReviewProps extends PageProps {
    review: Review;
}

export default function EditReview({ review }: EditReviewProps) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(review.images || []);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

    const { data, setData, patch, processing, errors } = useForm({
        rating: review.rating,
        comment: review.comment || '',
        images: [] as File[],
        remove_images: [] as string[],
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxImages = 5;
        const totalImages = existingImages.length - imagesToRemove.length + selectedImages.length + files.length;
        
        if (totalImages > maxImages) {
            alert(`You can only have up to ${maxImages} images total.`);
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

    const removeNewImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);
    };

    const removeExistingImage = (imagePath: string) => {
        const newImagesToRemove = [...imagesToRemove, imagePath];
        setImagesToRemove(newImagesToRemove);
        setData('remove_images', newImagesToRemove);
    };

    const restoreExistingImage = (imagePath: string) => {
        const newImagesToRemove = imagesToRemove.filter(path => path !== imagePath);
        setImagesToRemove(newImagesToRemove);
        setData('remove_images', newImagesToRemove);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (data.rating === 0) {
            alert('Please select a rating.');
            return;
        }

        const formData = new FormData();
        formData.append('rating', data.rating.toString());
        formData.append('comment', data.comment);
        
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        
        data.remove_images.forEach((imagePath, index) => {
            formData.append(`remove_images[${index}]`, imagePath);
        });

        router.patch(route('buyer.reviews.update', review.id), formData, {
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
            <Head title={`Edit Review - ${review.product?.name}`} />

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
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2 text-gray-400">/</span>
                                    <span className="text-gray-500">Edit Review</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Review Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Review</h1>

                                    {/* Product Info */}
                                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                {review.product?.images && review.product.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${review.product.images[0]}`}
                                                        alt={review.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{review.product?.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    From Order #{review.order_item?.order?.order_number}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Original review: {new Date(review.created_at).toLocaleDateString()}
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
                                        {errors.comment && (
                                            <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                                        )}
                                    </div>

                                    {/* Image Management */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Review Photos
                                        </label>
                                        
                                        {/* Existing Images */}
                                        {existingImages.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Photos</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {existingImages.map((imagePath, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={`/storage/${imagePath}`}
                                                                alt={`Review image ${index + 1}`}
                                                                className={`w-full h-24 object-cover rounded-md ${
                                                                    imagesToRemove.includes(imagePath) ? 'opacity-50' : ''
                                                                }`}
                                                            />
                                                            {imagesToRemove.includes(imagePath) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => restoreExistingImage(imagePath)}
                                                                    className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                                                                    title="Restore image"
                                                                >
                                                                    ↶
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage(imagePath)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                                    title="Remove image"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New Images */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">New Photos</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={preview}
                                                                alt={`New preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(index)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload Button */}
                                        {(existingImages.length - imagesToRemove.length + selectedImages.length) < 5 && (
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
                                                                Add more images
                                                            </span>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF up to 2MB each (max 5 total)
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

                                        {errors.images && (
                                            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                        <Link
                                            href={route('buyer.reviews.index')}
                                            className="text-gray-500 hover:text-gray-700 font-medium"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing || data.rating === 0}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Updating...' : 'Update Review'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                {/* Review History */}
                                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Review History</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created:</span>
                                            <span className="font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                review.is_approved 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {review.is_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>
                                        {review.is_verified && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Purchase:</span>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    Verified
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                            <span>Include helpful details about quality and performance</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>Update your review if your experience changes</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            <span>Don't include personal information</span>
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