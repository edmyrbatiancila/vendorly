import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Review, PageProps } from '@/types';

interface ReviewsIndexProps extends PageProps {
    reviews: {
        data: Review[];
        links: any[];
        meta: any;
    };
}

export default function ReviewsIndex({ reviews }: ReviewsIndexProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                ⭐
            </span>
        ));
    };

    const deleteReview = async (reviewId: number) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await fetch(route('buyer.reviews.destroy', reviewId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review.');
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Reviews</h2>}
        >
            <Head title="My Reviews" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
                            <p className="text-gray-600 mt-1">Manage your product reviews and ratings</p>
                        </div>
                        <Link
                            href={route('buyer.reviews.reviewable')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Write New Review
                        </Link>
                    </div>

                    {/* Reviews List */}
                    {reviews.data.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.data.map((review) => (
                                <div key={review.id} className="bg-white rounded-lg shadow-sm border">
                                    <div className="p-6">
                                        <div className="flex items-start space-x-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
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

                                            {/* Review Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Link
                                                        href={route('buyer.products.show', review.product!.id)}
                                                        className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                                                    >
                                                        {review.product?.name}
                                                    </Link>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route('buyer.reviews.edit', review.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteReview(review.id)}
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <div className="flex items-center">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {review.rating} out of 5 stars
                                                    </span>
                                                    {review.is_verified && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            Verified Purchase
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Review Comment */}
                                                {review.comment && (
                                                    <div className="mb-3">
                                                        <p className="text-gray-700 text-sm leading-relaxed">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Review Images */}
                                                {review.images && review.images.length > 0 && (
                                                    <div className="mb-3">
                                                        <div className="flex space-x-2 overflow-x-auto">
                                                            {review.images.map((image, index) => (
                                                                <div key={index} className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                                                                    <img
                                                                        src={`/storage/${image}`}
                                                                        alt={`Review image ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Review Metadata */}
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>
                                                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                    {!review.is_approved && (
                                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                                            Pending Approval
                                                        </span>
                                                    )}
                                                    <span>
                                                        Order #{review.order_item?.order?.order_number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm text-center py-12">
                            <div className="text-6xl text-gray-300 mb-4">⭐</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                            <p className="text-gray-500 mb-6">
                                You haven't written any product reviews yet.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    href={route('buyer.reviews.reviewable')}
                                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Write Your First Review
                                </Link>
                                <Link
                                    href={route('buyer.orders.index')}
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    View Orders
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {reviews.meta.total > reviews.meta.per_page && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {reviews.links.find(link => link.label === '&laquo; Previous')?.url && (
                                    <Link
                                        href={reviews.links.find(link => link.label === '&laquo; Previous')!.url}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {reviews.links.find(link => link.label === 'Next &raquo;')?.url && (
                                    <Link
                                        href={reviews.links.find(link => link.label === 'Next &raquo;')!.url}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{reviews.meta.from}</span> to{' '}
                                        <span className="font-medium">{reviews.meta.to}</span> of{' '}
                                        <span className="font-medium">{reviews.meta.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        {reviews.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                    index === reviews.links.length - 1 ? 'rounded-r-md' : ''
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