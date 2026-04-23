import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Seller } from '@/types';

interface SettingsIndexProps {
    commissionStats: {
        average_commission: number;
        min_commission: number;
        max_commission: number;
        total_commission_earned: number;
    };
    sellers: {
        data: Seller[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
}

export default function SettingsIndex({ 
    commissionStats, 
    sellers, 
    filters 
}: SettingsIndexProps) {
    const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
    const [showBulkUpdate, setShowBulkUpdate] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        commission_rate: 0,
        reason: '',
    });

    const { data: bulkData, setData: setBulkData, patch: bulkPatch, processing: bulkProcessing, errors: bulkErrors } = useForm({
        commission_rate: 0,
        seller_ids: [] as number[],
        reason: '',
    });

    const { data: defaultData, setData: setDefaultData, patch: defaultPatch, processing: defaultProcessing } = useForm({
        default_commission_rate: 5.0,
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        
        router.get(route('admin.settings.index'), {
            ...filters,
            search: search || '',
        });
    };

    const startEditCommission = (seller: Seller) => {
        setData({
            commission_rate: seller.commission_rate,
            reason: '',
        });
        setEditingSeller(seller);
    };

    const submitCommissionUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSeller) return;

        patch(route('admin.settings.update-commission', editingSeller.id), {
            onSuccess: () => {
                reset();
                setEditingSeller(null);
            },
        });
    };

    const handleSellerSelection = (sellerId: number) => {
        setSelectedSellers(prev => 
            prev.includes(sellerId)
                ? prev.filter(id => id !== sellerId)
                : [...prev, sellerId]
        );
    };

    const selectAllSellers = () => {
        if (selectedSellers.length === sellers.data.length) {
            setSelectedSellers([]);
        } else {
            setSelectedSellers(sellers.data.map(seller => seller.id));
        }
    };

    const submitBulkUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setBulkData('seller_ids', selectedSellers);
        
        bulkPatch(route('admin.settings.bulk-commission'), {
            onSuccess: () => {
                setSelectedSellers([]);
                setShowBulkUpdate(false);
                setBulkData({
                    commission_rate: 0,
                    seller_ids: [],
                    reason: '',
                });
            },
        });
    };

    const submitDefaultCommission = (e: React.FormEvent) => {
        e.preventDefault();
        defaultPatch(route('admin.settings.default-commission'));
    };

    return (
        <AdminLayout>
            <Head title="Platform Settings & Commission Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Platform Settings & Commission Management</h2>
                                <div className="flex space-x-2">
                                    <a
                                        href={route('admin.settings.analytics')}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        View Analytics
                                    </a>
                                </div>
                            </div>

                            {/* Commission Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-800">
                                        {Number(commissionStats.average_commission || 0).toFixed(2)}%
                                    </div>
                                    <div className="text-blue-600">Average Commission</div>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-800">
                                        ${Number(commissionStats.total_commission_earned || 0).toFixed(2)}
                                    </div>
                                    <div className="text-green-600">Total Commission Earned</div>
                                </div>
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-800">
                                        {Number(commissionStats.min_commission || 0).toFixed(2)}%
                                    </div>
                                    <div className="text-purple-600">Minimum Commission</div>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-800">
                                        {Number(commissionStats.max_commission || 0).toFixed(2)}%
                                    </div>
                                    <div className="text-yellow-600">Maximum Commission</div>
                                </div>
                            </div>

                            {/* Default Commission Rate Setting */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Default Commission Rate for New Sellers</h3>
                                <form onSubmit={submitDefaultCommission} className="flex items-end gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Default Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="50"
                                            value={defaultData.default_commission_rate}
                                            onChange={(e) => setDefaultData('default_commission_rate', parseFloat(e.target.value))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={defaultProcessing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {defaultProcessing ? 'Updating...' : 'Update Default'}
                                    </button>
                                </form>
                            </div>

                            {/* Bulk Actions */}
                            {selectedSellers.length > 0 && (
                                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">
                                            {selectedSellers.length} seller(s) selected
                                        </span>
                                        <button
                                            onClick={() => setShowBulkUpdate(true)}
                                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Bulk Update Commission
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bulk Update Form */}
                            {showBulkUpdate && (
                                <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">Bulk Update Commission Rate</h3>
                                    <form onSubmit={submitBulkUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">New Commission Rate (%)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="50"
                                                value={bulkData.commission_rate}
                                                onChange={(e) => setBulkData('commission_rate', parseFloat(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                            {bulkErrors.commission_rate && <p className="text-red-500 text-xs mt-1">{bulkErrors.commission_rate}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
                                            <input
                                                type="text"
                                                value={bulkData.reason}
                                                onChange={(e) => setBulkData('reason', e.target.value)}
                                                placeholder="e.g., Performance adjustment"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>

                                        <div className="flex items-end space-x-2">
                                            <button
                                                type="submit"
                                                disabled={bulkProcessing}
                                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                            >
                                                {bulkProcessing ? 'Updating...' : 'Update All Selected'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowBulkUpdate(false)}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Edit Commission Form */}
                            {editingSeller && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">
                                        Update Commission for {editingSeller.store_name}
                                    </h3>
                                    <form onSubmit={submitCommissionUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Commission Rate (%) - Current: {editingSeller.commission_rate}%
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="50"
                                                value={data.commission_rate}
                                                onChange={(e) => setData('commission_rate', parseFloat(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                required
                                            />
                                            {errors.commission_rate && <p className="text-red-500 text-xs mt-1">{errors.commission_rate}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
                                            <input
                                                type="text"
                                                value={data.reason}
                                                onChange={(e) => setData('reason', e.target.value)}
                                                placeholder="e.g., High performance bonus"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>

                                        <div className="flex items-end space-x-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                            >
                                                {processing ? 'Updating...' : 'Update Commission'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingSeller(null)}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Search */}
                            <div className="mb-6">
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={filters.search}
                                        placeholder="Search sellers by name, email, or store name..."
                                        className="flex-1 rounded-md border-gray-300 shadow-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Search
                                    </button>
                                </form>
                            </div>

                            {/* Sellers Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSellers.length === sellers.data.length && sellers.data.length > 0}
                                                    onChange={selectAllSellers}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Seller Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Commission Rate
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sellers.data.map((seller) => (
                                            <tr key={seller.id} className={selectedSellers.includes(seller.id) ? 'bg-blue-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSellers.includes(seller.id)}
                                                        onChange={() => handleSellerSelection(seller.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm"
                                                    />
                                                </td>
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
                                                    <div className="text-sm font-medium text-gray-900">{seller.store_name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        Status: <span className="capitalize">{seller.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-lg font-bold text-indigo-600">
                                                        {seller.commission_rate}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => startEditCommission(seller)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Update Commission
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {sellers.last_page > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex space-x-1">
                                        {sellers.links.map((link, index) => (
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