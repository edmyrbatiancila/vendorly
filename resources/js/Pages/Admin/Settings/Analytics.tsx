import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface AnalyticsProps {
    analytics: {
        daily_orders: Array<{
            date: string;
            orders: number;
            revenue: number;
        }>;
        revenue_by_category: Array<{
            category: string;
            revenue: number;
        }>;
        seller_performance: Array<{
            store_name: string;
            owner_name: string;
            total_orders: number;
            total_revenue: number;
            commission_rate: number;
        }>;
        platform_metrics: {
            total_users: number;
            active_sellers: number;
            pending_sellers: number;
            total_products: number;
            active_products: number;
            monthly_revenue: number;
            monthly_orders: number;
        };
    };
}

export default function Analytics({ analytics }: AnalyticsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <Head title="Platform Analytics & Activity Monitoring" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Platform Analytics & Activity Monitoring
                                </h2>
                                <a
                                    href={route('admin.settings.index')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Back to Settings
                                </a>
                            </div>

                            {/* Platform Metrics Overview */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Platform Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-800">
                                            {analytics.platform_metrics.total_users}
                                        </div>
                                        <div className="text-blue-600">Total Users</div>
                                    </div>
                                    <div className="bg-green-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-800">
                                            {analytics.platform_metrics.active_sellers}
                                        </div>
                                        <div className="text-green-600">Active Sellers</div>
                                    </div>
                                    <div className="bg-purple-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-800">
                                            {analytics.platform_metrics.active_products}
                                        </div>
                                        <div className="text-purple-600">Active Products</div>
                                    </div>
                                    <div className="bg-yellow-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-800">
                                            {analytics.platform_metrics.pending_sellers}
                                        </div>
                                        <div className="text-yellow-600">Pending Sellers</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-indigo-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-indigo-800">
                                            {formatCurrency(analytics.platform_metrics.monthly_revenue)}
                                        </div>
                                        <div className="text-indigo-600">This Month's Revenue</div>
                                    </div>
                                    <div className="bg-pink-100 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-pink-800">
                                            {analytics.platform_metrics.monthly_orders}
                                        </div>
                                        <div className="text-pink-600">This Month's Orders</div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Orders Chart */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Daily Orders & Revenue (Last 30 Days)</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Orders
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Revenue
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {analytics.daily_orders.length > 0 ? (
                                                    analytics.daily_orders.slice(-10).map((day, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatDate(day.date)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {day.orders}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                                {formatCurrency(day.revenue)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                                            No data available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue by Category */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Top Revenue Categories</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-4">
                                        {analytics.revenue_by_category.length > 0 ? (
                                            analytics.revenue_by_category.map((category, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {category.category}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            #{index + 1} Category
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {formatCurrency(category.revenue)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                No category data available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Top Seller Performance */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-4">Top Performing Sellers</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rank
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Store Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Owner
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Orders
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Revenue
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Commission Rate
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Platform Earnings
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {analytics.seller_performance.length > 0 ? (
                                                analytics.seller_performance.map((seller, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {seller.store_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{seller.owner_name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {seller.total_orders}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                            {formatCurrency(seller.total_revenue)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {seller.commission_rate}%
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                            {formatCurrency((seller.total_revenue * seller.commission_rate) / 100)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                        No seller performance data available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary Insights */}
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">Platform Insights</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-medium text-blue-700 mb-2">Growth Metrics</h4>
                                        <ul className="space-y-1 text-blue-600">
                                            <li>• {analytics.platform_metrics.active_sellers} active sellers generating revenue</li>
                                            <li>• {analytics.platform_metrics.pending_sellers} sellers awaiting approval</li>
                                            <li>• {analytics.platform_metrics.active_products} products available for purchase</li>
                                            <li>• {analytics.platform_metrics.monthly_orders} orders placed this month</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-700 mb-2">Revenue Analysis</h4>
                                        <ul className="space-y-1 text-blue-600">
                                            <li>• {formatCurrency(analytics.platform_metrics.monthly_revenue)} total monthly revenue</li>
                                            <li>• Top category generating highest revenue</li>
                                            <li>• Commission-based earnings from top sellers</li>
                                            <li>• Growth trend analysis available in daily data</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}