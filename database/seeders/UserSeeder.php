<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Seller;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Factories\SellerFactory;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create additional admin users
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@vendorly.com',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create seller users with seller profiles
        $sellers = User::factory(15)->seller()->create();
        
        // Ensure first 10 sellers are approved for product seeding
        foreach ($sellers->take(10) as $index => $sellerUser) {
            Seller::factory()->create([
                'user_id' => $sellerUser->id,
                'status' => 'approved',
            ]);
        }
        
        // Create remaining sellers with random statuses
        foreach ($sellers->slice(10) as $sellerUser) {
            Seller::factory()->create([
                'user_id' => $sellerUser->id,
                'status' => fake()->randomElement(['pending', 'rejected', 'suspended']),
            ]);
        }

        // Create buyer users
        User::factory(25)->buyer()->create();

        // Create some inactive users for testing
        User::factory(5)->create([
            'role' => 'buyer',
            'is_active' => false,
        ]);

        // Create some unverified users
        User::factory(8)->create([
            'role' => 'buyer',
            'email_verified_at' => null,
        ]);

        $this->command->info('Created users: ');
        $this->command->info('- Admins: ' . User::where('role', 'admin')->count());
        $this->command->info('- Sellers: ' . User::where('role', 'seller')->count());
        $this->command->info('- Buyers: ' . User::where('role', 'buyer')->count());
        $this->command->info('- Total: ' . User::count());
    }
}