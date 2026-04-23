import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Category } from '@/types';

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    parentCategories: Category[];
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
    stats: {
        total_categories: number;
        active_categories: number;
        parent_categories: number;
        child_categories: number;
    };
}

export default function CategoriesIndex({ 
    categories, 
    parentCategories, 
    filters, 
    stats 
}: CategoriesIndexProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        description: '',
        parent_id: '',
        sort_order: 0,
        is_active: true,
    });

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.categories.index'), {
            ...filters,
            [key]: value === filters[key as keyof typeof filters] ? '' : value,
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        
        router.get(route('admin.categories.index'), {
            ...filters,
            search: search || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCategory) {
            patch(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    reset();
                    setEditingCategory(null);
                },
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    reset();
                    setIsCreating(false);
                },
            });
        }
    };

    const toggleCategoryStatus = (category: Category) => {
        router.patch(route('admin.categories.toggle-status', category.id));
    };

    const deleteCategory = (category: Category) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', category.id));
        }
    };

    const startEdit = (category: Category) => {
        setData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id?.toString() || '',
            sort_order: category.sort_order,
            is_active: category.is_active,
        });
        setEditingCategory(category);
        setIsCreating(true);
    };

    const cancelEdit = () => {
        reset();
        setEditingCategory(null);
        setIsCreating(false);
    };

    return (
        <AdminLayout>
            <Head title="Category Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Category Management</h2>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={isCreating}
                                >
                                    Add New Category
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-800">{stats.total_categories}</div>
                                    <div className="text-blue-600">Total Categories</div>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-800">{stats.active_categories}</div>
                                    <div className="text-green-600">Active Categories</div>
                                </div>
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-800">{stats.parent_categories}</div>
                                    <div className="text-purple-600">Parent Categories</div>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-800">{stats.child_categories}</div>
                                    <div className="text-yellow-600">Child Categories</div>
                                </div>
                            </div>

                            {/* Create/Edit Form */}
                            {isCreating && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">
                                        {editingCategory ? 'Edit Category' : 'Create New Category'}
                                    </h3>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                                            <select
                                                value={data.parent_id}
                                                onChange={(e) => setData('parent_id', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            >
                                                <option value="">None (Root Category)</option>
                                                {parentCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                                            <input
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">Active</label>
                                        </div>

                                        <div className="md:col-span-2 flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                            >
                                                {processing ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Filters */}
                            <div className="mb-6 flex flex-wrap gap-4">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Search categories..."
                                        className="rounded-md border-gray-300 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Search
                                    </button>
                                </form>

                                <select
                                    onChange={(e) => handleFilter('status', e.target.value)}
                                    value={filters.status || ''}
                                    className="rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="1">Active Only</option>
                                    <option value="0">Inactive Only</option>
                                </select>

                                <select
                                    onChange={(e) => handleFilter('type', e.target.value)}
                                    value={filters.type || ''}
                                    className="rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">All Types</option>
                                    <option value="parent">Parent Categories</option>
                                    <option value="child">Child Categories</option>
                                </select>
                            </div>

                            {/* Categories Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Parent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sort Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.data.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-500">{category.description}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.parent?.name || '—'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getStatusColor(category.is_active)}`}>
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.sort_order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => startEdit(category)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => toggleCategoryStatus(category)}
                                                        className={category.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                                                    >
                                                        {category.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(category)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {categories.last_page > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex space-x-1">
                                        {categories.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}