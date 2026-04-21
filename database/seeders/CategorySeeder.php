<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices and accessories',
                'children' => [
                    'Mobile Phones',
                    'Laptops & Computers',
                    'Audio & Headphones',
                    'Cameras',
                    'Gaming'
                ]
            ],
            [
                'name' => 'Fashion',
                'description' => 'Clothing and fashion accessories',
                'children' => [
                    "Men's Clothing",
                    "Women's Clothing",
                    "Shoes",
                    "Bags & Accessories",
                    "Jewelry"
                ]
            ],
            [
                'name' => 'Home & Living',
                'description' => 'Home and living essentials',
                'children' => [
                    'Furniture',
                    'Home Decor',
                    'Kitchen & Dining',
                    'Bedding & Bath',
                    'Garden & Outdoor'
                ]
            ]
        ];

        foreach ($categories as $categoryData) {
            $parent = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'is_active' => true
            ]);

            foreach ($categoryData['children'] as $index => $childName) {
                Category::create([
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'parent_id' => $parent->id,
                    'is_active' => true,
                    'sort_order' => $index
                ]);
            }
        }
    }
}
