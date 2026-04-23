<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users with buyer role
        $buyers = User::where('role', 'buyer')->get();
        if ($buyers->isEmpty()) {
            // Create some buyer users if none exist
            $buyers = User::factory(5)->buyer()->create();
        }

        // Get existing sellers
        $sellers = Seller::with('products')->approved()->get();
        if ($sellers->isEmpty()) {
            // Create some basic sellers and products if none exist
            $sellerUsers = User::factory(3)->seller()->create();
            foreach ($sellerUsers as $user) {
                $seller = Seller::create([
                    'user_id' => $user->id,
                    'store_name' => fake()->company() . ' Store',
                    'store_description' => fake()->paragraph(),
                    'status' => 'approved',
                    'commission_rate' => 5.00,
                ]);

                // Create some products for each seller
                Product::factory(5)->create([
                    'seller_id' => $seller->id,
                    'category_id' => 1, // Assuming category with ID 1 exists
                    'is_active' => true,
                ]);
            }
            $sellers = Seller::with('products')->approved()->get();
        }

        // Create orders with order items
        foreach ($buyers->take(10) as $buyer) {
            // Each buyer gets 1-3 orders
            $orderCount = rand(1, 3);
            
            for ($i = 0; $i < $orderCount; $i++) {
                $order = Order::factory()->forUser($buyer)->create();
                
                // Add 1-4 items to each order
                $itemCount = rand(1, 4);
                $orderSubtotal = 0;
                
                for ($j = 0; $j < $itemCount; $j++) {
                    $seller = $sellers->random();
                    $product = $seller->products->where('is_active', true)->first();
                    
                    if ($product) {
                        $quantity = rand(1, 3);
                        $unitPrice = $product->price;
                        $totalPrice = $unitPrice * $quantity;
                        $orderSubtotal += $totalPrice;
                        
                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'seller_id' => $seller->id,
                            'product_name' => $product->name,
                            'product_sku' => $product->sku,
                            'unit_price' => $unitPrice,
                            'quantity' => $quantity,
                            'total_price' => $totalPrice,
                            'product_options' => null,
                        ]);
                    }
                }
                
                // Update order totals
                $taxAmount = $orderSubtotal * 0.08;
                $shippingAmount = rand(5, 25);
                $totalAmount = $orderSubtotal + $taxAmount + $shippingAmount;
                
                $order->update([
                    'subtotal' => $orderSubtotal,
                    'tax_amount' => $taxAmount,
                    'shipping_amount' => $shippingAmount,
                    'total_amount' => $totalAmount,
                ]);
            }
        }

        // Create some additional orders with specific states for demo
        Order::factory(5)->pending()->create();
        Order::factory(8)->delivered()->create(); 
        Order::factory(3)->cancelled()->create();
    }
}