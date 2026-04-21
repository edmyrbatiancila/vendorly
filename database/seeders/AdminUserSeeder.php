<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@vendorly.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now()
        ]);

        // Create sample seller
        $seller = User::create([
            'name' => 'John Seller',
            'email' => 'seller@vendorly.com',
            'password' => Hash::make('seller123'),
            'role' => 'seller',
            'is_active' => true,
            'email_verified_at' => now()
        ]);

        // Create saple buyer
        User::create([
            'name' => 'Jane Buyer',
            'email' => 'buyer@vendorly.com',
            'password' => Hash::make('buyer123'),
            'role' => 'buyer',
            'is_active' => true,
            'email_verified_at' => now()
        ]);
    }
}
