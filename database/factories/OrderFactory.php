<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10, 500);
        $taxAmount = $subtotal * 0.08; // 8% tax
        $shippingAmount = fake()->randomFloat(2, 5, 25);
        $totalAmount = $subtotal + $taxAmount + $shippingAmount;

        $statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed'];
        $status = fake()->randomElement($statuses);
        
        // Set realistic payment status based on order status
        $paymentStatus = match($status) {
            'cancelled' => 'failed',
            'delivered', 'shipped', 'processing' => 'paid',
            default => fake()->randomElement($paymentStatuses)
        };

        return [
            'order_number' => 'ORD-' . strtoupper(fake()->unique()->lexify('??????')),
            'user_id' => User::factory(),
            'status' => $status,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'total_amount' => $totalAmount,
            'currency' => 'USD',
            'billing_address' => json_encode([
                'name' => fake()->name(),
                'address' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip' => fake()->postcode(),
                'country' => 'United States'
            ]),
            'shipping_address' => json_encode([
                'name' => fake()->name(),
                'address' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip' => fake()->postcode(),
                'country' => 'United States'
            ]),
            'payment_method' => fake()->randomElement(['stripe', 'paypal', 'card']),
            'payment_status' => $paymentStatus,
            'payment_details' => json_encode([
                'transaction_id' => fake()->uuid(),
                'method' => fake()->randomElement(['visa', 'mastercard', 'paypal'])
            ]),
            'notes' => fake()->optional()->sentence(),
            'shipped_at' => $status === 'shipped' || $status === 'delivered' ? fake()->dateTimeBetween('-30 days', 'now') : null,
            'delivered_at' => $status === 'delivered' ? fake()->dateTimeBetween('-15 days', 'now') : null,
            'created_at' => fake()->dateTimeBetween('-60 days', 'now'),
        ];
    }

    /**
     * Create a pending order.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipped_at' => null,
            'delivered_at' => null,
        ]);
    }

    /**
     * Create a delivered order.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
            'shipped_at' => fake()->dateTimeBetween('-30 days', '-15 days'),
            'delivered_at' => fake()->dateTimeBetween('-15 days', 'now'),
        ]);
    }

    /**
     * Create a cancelled order.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_status' => 'failed',
            'shipped_at' => null,
            'delivered_at' => null,
        ]);
    }

    /**
     * Create an order with a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}