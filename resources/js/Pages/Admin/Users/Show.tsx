import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User } from '@/types';
import { useState } from 'react';

interface UserShowProps {
    user: User;
    stats: {
        total_orders: number;
        total_spent: number;
        products_count: number;
        seller_revenue: number;
    };
}

export default function UserShow({ user, stats }: UserShowProps) {
    const [selectedRole, setSelectedRole] = useState(user.role);

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

    const toggleUserStatus = () => {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
            preserveScroll: true,
        });
    };

    const updateUserRole = () => {
        if (selectedRole !== user.role) {
            if (confirm(`Are you sure you want to change this user's role from ${user.role} to ${selectedRole}?`)) {
                router.patch(route('admin.users.update-role', user.id), {
                    role: selectedRole
                }, {
                    preserveScroll: true,
                });
            }
        }
    };

    const verifyEmail = () => {
        if (confirm('Are you sure you want to manually verify this user\'s email?')) {
            router.patch(route('admin.users.verify-email', user.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const deleteUser = () => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            router.delete(route('admin.users.destroy', user.id), {
                onSuccess: () => {
                    router.visit(route('admin.users.index'));
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title={`User: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <Link
                                        href={route('admin.users.index')}
                                        className="text-indigo-600 hover:text-indigo-900 mb-2 inline-block"
                                    >
                                        ← Back to Users
                                    </Link>
                                    <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
                                    <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={toggleUserStatus}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                                            user.is_active
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                        }`}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    {!user.email_verified_at && (
                                        <button
                                            onClick={verifyEmail}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={deleteUser}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                                        >
                                            Delete User
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* User Avatar */}
                            <div className="mb-6 flex justify-center">
                                <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <span className="text-3xl font-medium leading-none text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                    <dl className="grid grid-cols-1 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.is_active)}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                                    <dl className="grid grid-cols-1 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{stats.total_orders}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                                            <dd className="mt-1 text-sm text-gray-900">${stats.total_spent.toFixed(2)}</dd>
                                        </div>
                                        {user.role === 'seller' && (
                                            <>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Products</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{stats.products_count}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Seller Revenue</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">${stats.seller_revenue.toFixed(2)}</dd>
                                                </div>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Role Management */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Role Management</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="role-select" className="text-sm font-medium text-gray-700">
                                            Change Role:
                                        </label>
                                        <select
                                            id="role-select"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'seller' | 'buyer')}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="seller">Seller</option>
                                            <option value="buyer">Buyer</option>
                                        </select>
                                        {selectedRole !== user.role && (
                                            <button
                                                onClick={updateUserRole}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                            >
                                                Update Role
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Changing a user's role will affect their permissions and access to different parts of the system.
                                    </p>
                                </div>
                            </div>

                            {/* Seller Information */}
                            {user.seller && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Seller Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Store Name</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.seller.store_name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Store Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        user.seller.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        user.seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        user.seller.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {user.seller.status}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Commission Rate</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{user.seller.commission_rate}%</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Store Created</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {new Date(user.seller.created_at).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        </dl>
                                        {user.seller.store_description && (
                                            <div className="mt-4">
                                                <dt className="text-sm font-medium text-gray-500">Store Description</dt>
                                                <dd className="mt-1 text-sm text-gray-700">{user.seller.store_description}</dd>
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <Link
                                                href={route('admin.sellers.show', user.seller.id)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                View Seller Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recent Activity */}
                            {user.orders && user.orders.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-3">
                                            {user.orders.slice(0, 5).map((order) => (
                                                <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-900">${order.total_amount}</p>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {user.orders.length > 5 && (
                                            <div className="mt-3 text-center">
                                                <p className="text-sm text-gray-500">Showing 5 of {user.orders.length} orders</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Timeline</h3>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(user.created_at).toLocaleString()}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(user.updated_at).toLocaleString()}
                                        </dd>
                                    </div>
                                    {user.email_verified_at && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(user.email_verified_at).toLocaleString()}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}