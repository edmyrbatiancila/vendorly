<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);
        $price = fake()->randomFloat(2, 10, 500);
        $comparePrice = fake()->optional(0.3)->randomFloat(2, $price + 10, $price + 100);
        $stockQuantity = fake()->numberBetween(0, 100);

        return [
            'seller_id' => Seller::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . fake()->unique()->randomNumber(4),
            'description' => fake()->paragraph(3),
            'short_description' => fake()->sentence(),
            'sku' => strtoupper(fake()->unique()->lexify('???-###')),
            'price' => $price,
            'compare_price' => $comparePrice,
            'stock_quantity' => $stockQuantity,
            'min_stock_level' => 5,
            'stock_status' => $stockQuantity > 5 ? 'in_stock' : ($stockQuantity > 0 ? 'low_stock' : 'out_of_stock'),
            'track_inventory' => true,
            'weight' => fake()->optional()->randomFloat(2, 0.1, 10),
            'dimensions' => fake()->optional()->passthrough(json_encode([
                'length' => fake()->numberBetween(5, 50),
                'width' => fake()->numberBetween(5, 30),
                'height' => fake()->numberBetween(2, 20),
            ])),
            'is_active' => fake()->boolean(90), // 90% chance of being active
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
            'images' => fake()->optional()->passthrough(json_encode(
                fake()->randomElements([
                    'products/sample1.jpg',
                    'products/sample2.jpg',
                    'products/sample3.jpg',
                ], rand(1, 3))
            )),
            'attributes' => fake()->optional()->passthrough(json_encode(
                fake()->randomElement([
                    ['color' => 'red', 'size' => 'medium'],
                    ['color' => 'blue', 'size' => 'large'], 
                    ['color' => 'green', 'size' => 'small'],
                    ['material' => 'cotton', 'brand' => 'Generic'],
                    ['material' => 'polyester', 'brand' => 'Premium'],
                    ['color' => 'black', 'material' => 'leather'],
                ])
            )),
            'rating_avg' => fake()->randomFloat(2, 1, 5),
            'rating_count' => fake()->numberBetween(0, 50),
            'view_count' => fake()->numberBetween(0, 1000),
            'sales_count' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Create an active product.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create a featured product.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'is_active' => true,
        ]);
    }

    /**
     * Create a product with low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, 5),
            'stock_status' => 'low_stock',
        ]);
    }

    /**
     * Create an out of stock product.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'stock_status' => 'out_of_stock',
        ]);
    }

    /**
     * Create a product for a specific seller.
     */
    public function forSeller(Seller $seller): static
    {
        return $this->state(fn (array $attributes) => [
            'seller_id' => $seller->id,
        ]);
    }

    /**
     * Create a product in a specific category.
     */
    public function inCategory(Category $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }
}