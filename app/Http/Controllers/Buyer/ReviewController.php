<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display buyer's reviews.
     */
    public function index(Request $request): Response
    {
        $reviews = Review::with(['product.seller', 'orderItem.order'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Buyer/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Show form for creating a review.
     */
    public function create(Request $request, OrderItem $orderItem): Response
    {
        // Ensure user owns this order item
        if ($orderItem->order->user_id !== $request->user()->id) {
            abort(404);
        }

        // Check if order is delivered
        if ($orderItem->order->status !== 'delivered') {
            return redirect()->back()
                ->with('error', 'You can only review products from delivered orders.');
        }

        // Check if review already exists
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('order_item_id', $orderItem->id)
            ->first();

        if ($existingReview) {
            return redirect()->route('buyer.reviews.edit', $existingReview)
                ->with('info', 'You have already reviewed this product. You can edit your review below.');
        }

        $orderItem->load(['product', 'order']);

        return Inertia::render('Buyer/Reviews/Create', [
            'orderItem' => $orderItem,
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'order_item_id' => 'required|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $orderItem = OrderItem::with('order')->findOrFail($request->order_item_id);

        // Ensure user owns this order item
        if ($orderItem->order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Check if order is delivered
        if ($orderItem->order->status !== 'delivered') {
            return response()->json([
                'success' => false,
                'message' => 'You can only review products from delivered orders.'
            ], 400);
        }

        // Check if review already exists
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('order_item_id', $orderItem->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.'
            ], 400);
        }

        $reviewImages = [];

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $reviewImages[] = $path;
            }
        }

        // Create review
        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $orderItem->product_id,
            'order_item_id' => $orderItem->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => $reviewImages,
            'is_verified' => true, // Since it's from a verified purchase
            'is_approved' => true, // Auto-approve or set to false for moderation
        ]);

        // Update product rating average
        $this->updateProductRating($orderItem->product_id);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully!',
            'review' => $review->load('user'),
        ]);
    }

    /**
     * Show form for editing a review.
     */
    public function edit(Request $request, Review $review): Response
    {
        // Ensure user owns this review
        if ($review->user_id !== $request->user()->id) {
            abort(404);
        }

        $review->load(['product', 'orderItem.order']);

        return Inertia::render('Buyer/Reviews/Edit', [
            'review' => $review,
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        // Ensure user owns this review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'string',
        ]);

        $reviewImages = $review->images ?? [];

        // Remove specified images
        if ($request->filled('remove_images')) {
            $reviewImages = array_diff($reviewImages, $request->remove_images);
            // TODO: Delete actual files from storage
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if (count($reviewImages) < 5) {
                    $path = $image->store('reviews', 'public');
                    $reviewImages[] = $path;
                }
            }
        }

        // Update review
        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'images' => array_values($reviewImages),
            'is_approved' => true, // Reset approval status if moderation is required
        ]);

        // Update product rating average
        $this->updateProductRating($review->product_id);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully!',
            'review' => $review->fresh(),
        ]);
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        // Ensure user owns this review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $productId = $review->product_id;

        // TODO: Delete review images from storage
        
        $review->delete();

        // Update product rating average
        $this->updateProductRating($productId);

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }

    /**
     * Get reviewable orders (delivered orders without reviews).
     */
    public function reviewable(Request $request): Response
    {
        $reviewableItems = OrderItem::with(['product', 'order'])
            ->whereHas('order', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->where('status', 'delivered');
            })
            ->whereDoesntHave('review', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Buyer/Reviews/Reviewable', [
            'reviewableItems' => $reviewableItems,
        ]);
    }

    /**
     * Update product rating average.
     */
    private function updateProductRating($productId): void
    {
        $product = Product::find($productId);
        
        if ($product) {
            $reviews = Review::where('product_id', $productId)
                ->where('is_approved', true);

            $ratingAvg = $reviews->avg('rating') ?: 0;
            $ratingCount = $reviews->count();

            $product->update([
                'rating_avg' => round($ratingAvg, 2),
                'rating_count' => $ratingCount,
            ]);
        }
    }
}