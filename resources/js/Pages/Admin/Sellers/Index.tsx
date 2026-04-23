import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Seller } from '@/types';
import { useState } from 'react';

interface AdminSellersIndexProps {
    sellers: {
        data: Seller[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function AdminSellersIndex({ sellers, filters }: AdminSellersIndexProps) {
    const [status, setStatus] = useState(filters.status || '');
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get(route('admin.sellers.index'), {
            status: status || undefined,
            search: search || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'suspended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Sellers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Manage Sellers</h1>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 flex space-x-4">
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Search sellers..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Filter
                                </button>
                            </div>

                            {/* Sellers Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Seller
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Commission
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sellers.data.map((seller) => (
                                            <tr key={seller.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {seller.user?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {seller.user?.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{seller.store_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(seller.status)}`}>
                                                        {seller.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {seller.commission_rate}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(seller.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('admin.sellers.show', seller.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        View
                                                    </Link>
                                                    {seller.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => router.patch(route('admin.sellers.approve', seller.id))}
                                                                className="text-green-600 hover:text-green-900 mr-2"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const reason = prompt('Reason for rejection:');
                                                                    if (reason) {
                                                                        router.patch(route('admin.sellers.reject', seller.id), { reason });
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {seller.status === 'approved' && (
                                                        <button
                                                            onClick={() => router.patch(route('admin.sellers.suspend', seller.id))}
                                                            className="text-orange-600 hover:text-orange-900"
                                                        >
                                                            Suspend
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {sellers.last_page > 1 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Showing {((sellers.current_page - 1) * sellers.per_page) + 1} to {Math.min(sellers.current_page * sellers.per_page, sellers.total)} of {sellers.total} results
                                    </div>
                                    <div className="flex space-x-2">
                                        {sellers.current_page > 1 && (
                                            <Link
                                                href={route('admin.sellers.index', { ...filters, page: sellers.current_page - 1 })}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {sellers.current_page < sellers.last_page && (
                                            <Link
                                                href={route('admin.sellers.index', { ...filters, page: sellers.current_page + 1 })}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Next
                                            </Link>
                                        )}
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