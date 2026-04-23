<?php

namespace Database\Factories;

use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Seller>
 */
class SellerFactory extends Factory
{
    protected $model = Seller::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->seller(),
            'store_name' => fake()->company() . ' Store',
            'store_description' => fake()->paragraph(),
            'store_logo' => fake()->optional()->imageUrl(200, 200, 'business'),
            'store_banner' => fake()->optional()->imageUrl(800, 300, 'business'),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'suspended']),
            'rejection_reason' => null,
            'commission_rate' => fake()->randomFloat(2, 3, 10),
            'business_info' => [
                'business_type' => fake()->randomElement(['individual', 'company', 'partnership']),
                'tax_id' => fake()->numerify('##-#######'),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
            ],
        ];
    }

    /**
     * Create an approved seller.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'rejection_reason' => null,
        ]);
    }

    /**
     * Create a pending seller.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'rejection_reason' => null,
        ]);
    }

    /**
     * Create a rejected seller.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    /**
     * Create a suspended seller.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
            'rejection_reason' => fake()->sentence(),
        ]);
    }

    /**
     * Create a seller with a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}