<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'seller_id' => function (array $attributes) {
                return Product::find($attributes['product_id'])->seller_id ?? 1;
            },
            'product_name' => $this->faker->words(3, true),
            'product_sku' => $this->faker->unique()->regexify('[A-Z0-9]{8}'),
            'quantity' => $this->faker->numberBetween(1, 5),
            'unit_price' => $this->faker->randomFloat(2, 10, 500),
            'total_price' => function (array $attributes) {
                return $attributes['quantity'] * $attributes['unit_price'];
            },
            'product_options' => null,
        ];
    }

    public function forOrder(Order $order): static
    {
        return $this->state([
            'order_id' => $order->id,
        ]);
    }

    public function forProduct(Product $product): static
    {
        return $this->state([
            'product_id' => $product->id,
            'seller_id' => $product->seller_id,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'unit_price' => $product->price,
        ]);
    }
}