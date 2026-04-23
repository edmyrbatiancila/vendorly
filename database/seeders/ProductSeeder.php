<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\Seller;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing categories and sellers
        $categories = Category::active()->get();
        $sellers = Seller::approved()->with('user')->get();

        if ($categories->isEmpty()) {
            $this->command->warn('No categories found. Please run CategorySeeder first.');
            return;
        }

        if ($sellers->isEmpty()) {
            $this->command->warn('No approved sellers found. Please run UserSeeder first.');
            return;
        }

        $this->command->info('Creating products for ' . $sellers->count() . ' sellers across ' . $categories->count() . ' categories...');

        // Create products for each seller
        foreach ($sellers as $seller) {
            // Create 8-15 products per seller
            $productCount = fake()->numberBetween(8, 15);
            
            for ($i = 0; $i < $productCount; $i++) {
                $category = $categories->random();
                
                // Create different types of products with various states
                $productType = fake()->randomElement([
                    'active_featured',
                    'active_regular', 
                    'active_regular',
                    'active_regular',
                    'low_stock',
                    'out_of_stock',
                    'inactive'
                ]);

                switch ($productType) {
                    case 'active_featured':
                        Product::factory()
                            ->active()
                            ->featured()
                            ->forSeller($seller)
                            ->inCategory($category)
                            ->create();
                        break;
                        
                    case 'low_stock':
                        Product::factory()
                            ->active()
                            ->lowStock()
                            ->forSeller($seller)
                            ->inCategory($category)
                            ->create();
                        break;
                        
                    case 'out_of_stock':
                        Product::factory()
                            ->active()
                            ->outOfStock()
                            ->forSeller($seller)
                            ->inCategory($category)
                            ->create();
                        break;
                        
                    case 'inactive':
                        Product::factory()
                            ->forSeller($seller)
                            ->inCategory($category)
                            ->create(['is_active' => false]);
                        break;
                        
                    default: // active_regular
                        Product::factory()
                            ->active()
                            ->forSeller($seller)
                            ->inCategory($category)
                            ->create();
                        break;
                }
            }
        }

        // Create some additional featured products from top sellers
        $topSellers = $sellers->take(5);
        foreach ($topSellers as $seller) {
            $featuredCount = fake()->numberBetween(2, 4);
            for ($i = 0; $i < $featuredCount; $i++) {
                $category = $categories->random();
                Product::factory()
                    ->active()
                    ->featured()
                    ->forSeller($seller)
                    ->inCategory($category)
                    ->create([
                        'compare_price' => fake()->numberBetween(50, 500),
                    ]);
            }
        }

        // Get final counts
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $lowStockProducts = Product::where('stock_status', 'low_stock')->count();
        $outOfStockProducts = Product::where('stock_status', 'out_of_stock')->count();

        $this->command->info('Product seeding completed!');
        $this->command->info('- Total products: ' . $totalProducts);
        $this->command->info('- Active products: ' . $activeProducts);
        $this->command->info('- Featured products: ' . $featuredProducts);
        $this->command->info('- Low stock products: ' . $lowStockProducts);
        $this->command->info('- Out of stock products: ' . $outOfStockProducts);
        
        // Display breakdown by category
        $this->command->info('Products by category:');
        foreach ($categories as $category) {
            $count = Product::where('category_id', $category->id)->count();
            $this->command->info('  - ' . $category->name . ': ' . $count . ' products');
        }
    }
}