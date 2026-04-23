import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User } from '@/types';
import { useState } from 'react';

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
        verified?: string;
    };
    stats: {
        total_users: number;
        active_users: number;
        verified_users: number;
        admin_users: number;
        seller_users: number;
        buyer_users: number;
    };
}

export default function UsersIndex({ users, filters, stats }: UsersIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'seller': return 'bg-blue-100 text-blue-800';
            case 'buyer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleFilter = (key: string, value: string) => {
        router.get(route('admin.users.index'), {
            ...filters,
            [key]: value === filters[key as keyof typeof filters] ? '' : value,
        });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            ...filters,
            search: searchQuery,
        });
    };

    const toggleUserStatus = (user: User) => {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
            preserveScroll: true,
        });
    };

    const deleteUser = (user: User) => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.total_users}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-green-600">Active</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.active_users}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-600">Verified</p>
                                    <p className="text-2xl font-bold text-yellow-900">{stats.verified_users}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-purple-600">Admins</p>
                                    <p className="text-2xl font-bold text-purple-900">{stats.admin_users}</p>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-indigo-600">Sellers</p>
                                    <p className="text-2xl font-bold text-indigo-900">{stats.seller_users}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600">Buyers</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.buyer_users}</p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    {/* Search */}
                                    <form onSubmit={handleSearch} className="col-span-2">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search users by name or email..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </form>

                                    {/* Role Filter */}
                                    <select
                                        value={filters.role || ''}
                                        onChange={(e) => handleFilter('role', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="seller">Seller</option>
                                        <option value="buyer">Buyer</option>
                                    </select>

                                    {/* Status Filter */}
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilter('status', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Email Verification Filter */}
                                    <select
                                        value={filters.verified || ''}
                                        onChange={(e) => handleFilter('verified', e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Email Status</option>
                                        <option value="1">Verified</option>
                                        <option value="0">Unverified</option>
                                    </select>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                                                                <span className="text-sm font-medium leading-none text-white">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.is_active)}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link
                                                        href={route('admin.users.show', user.id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => toggleUserStatus(user)}
                                                        className={`${
                                                            user.is_active
                                                                ? 'text-red-600 hover:text-red-900'
                                                                : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    >
                                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {users.data.length} of {users.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {users.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
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