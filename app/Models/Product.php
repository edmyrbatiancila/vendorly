<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'compare_price',
        'stock_quantity',
        'min_stock_level',
        'stock_status',
        'track_inventory',
        'weight',
        'dimensions',
        'is_active',
        'is_featured',
        'images',
        'attributes',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'dimensions' => 'array',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images' => 'array',
            'rating_avg' => 'decimal:2'
        ];
    }

    // Relationships
    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Helper methods
    public function isInStock(): bool
    {
        return $this->stock_status === 'in_stock' && $this->stock_quantity > 0;
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->min_stock_level;
    }

    public function hasDiscount(): bool
    {
        return !is_null($this->compare_price) && $this->compare_price > $this->price;
    }

    public function getDiscountPercentage(): float
    {
        if (!$this->hasDiscount()) {
            return 0;
        }

        return round((($this->compare_price - $this->price) / $this->compare_price) * 100, 2);
    }

    public function getPrimaryImage(): string
    {
        if (empty($this->images)) {
            return '/images/no-image.png';
        }

        return $this->images[0];
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'in_stock')->where('stock_quantity', '>', 0);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    {
        return $query->whereBetween('price', [$minPrice, $maxPrice]);
    }
}
