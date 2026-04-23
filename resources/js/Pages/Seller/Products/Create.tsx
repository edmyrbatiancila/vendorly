import { Head } from '@inertiajs/react';
import SellerLayout from '@/Layouts/SellerLayout';
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface SellerProductsCreateProps {
    categories: Category[];
}

export default function SellerProductsCreate({ categories }: SellerProductsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        short_description: '',
        category_id: '',
        price: '',
        compare_price: '',
        sku: '',
        stock_quantity: '',
        min_stock_level: '5',
        track_inventory: true,
        weight: '',
        images: [] as string[],
        is_active: true,
        is_featured: false,
    });

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('seller.products.store'));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                newImages.push(base64);
                newPreviews.push(base64);
                
                if (newImages.length === files.length) {
                    setData('images', [...data.images, ...newImages]);
                    setImagePreview([...imagePreview, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreview(newPreviews);
    };

    return (
        <SellerLayout>
            <Head title="Add New Product" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                            Category *
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                                        Short Description
                                    </label>
                                    <textarea
                                        id="short_description"
                                        rows={2}
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Brief product description (optional)"
                                    />
                                    {errors.short_description && <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Full Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={6}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Detailed product description"
                                        required
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Price * ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="price"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="compare_price" className="block text-sm font-medium text-gray-700">
                                            Compare Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="compare_price"
                                            value={data.compare_price}
                                            onChange={(e) => setData('compare_price', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Original price (optional)"
                                        />
                                        {errors.compare_price && <p className="mt-1 text-sm text-red-600">{errors.compare_price}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Product SKU"
                                            required
                                        />
                                        {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                                    </div>
                                </div>

                                {/* Inventory */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            id="stock_quantity"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData('stock_quantity', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="min_stock_level" className="block text-sm font-medium text-gray-700">
                                            Min Stock Level *
                                        </label>
                                        <input
                                            type="number"
                                            id="min_stock_level"
                                            value={data.min_stock_level}
                                            onChange={(e) => setData('min_stock_level', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.min_stock_level && <p className="mt-1 text-sm text-red-600">{errors.min_stock_level}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="weight"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Product weight"
                                        />
                                        {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                                    </div>
                                </div>

                                {/* Product Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Product Images</label>
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                                    </div>
                                    
                                    {imagePreview.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {imagePreview.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image}
                                                        alt={`Preview ${index}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Settings */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="track_inventory"
                                            checked={data.track_inventory}
                                            onChange={(e) => setData('track_inventory', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="track_inventory" className="ml-2 block text-sm text-gray-900">
                                            Track Inventory
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                            Active Product
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                            Featured Product
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}