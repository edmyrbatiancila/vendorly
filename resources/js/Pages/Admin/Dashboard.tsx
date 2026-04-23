import AdminLayout from "@/Layouts/AdminLayout";
import { Order, Seller } from "@/types";
import { Head } from "@inertiajs/react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Legend
} from 'recharts';

interface AdminDashboardProps {
    stats: {
        total_users: number;
        total_sellers: number;
        pending_sellers: number;
        approved_sellers: number;
        total_products: number;
        active_products: number;
        total_orders: number;
        pending_orders: number;
        total_revenue: number;
    };
    analytics: {
        monthlyRevenue: Array<{ name: string; revenue: number; month: number; year: number }>;
        monthlyOrders: Array<{ name: string; orders: number; month: number; year: number }>;
        orderStatusStats: Array<{ name: string; value: number }>;
        topCategories: Array<{ name: string; value: number }>;
        sellerGrowth: Array<{ name: string; sellers: number; month: number; year: number }>;
    };
    recent_orders: Order[];
    recent_sellers: Seller[];
}

export default function AdminDashboard({ stats, analytics, recent_orders, recent_sellers }: AdminDashboardProps) {
    // Colors for pie charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">👥</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{stats.total_users}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🏪</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Sellers</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{stats.total_sellers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">⏳</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Pending Sellers</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{stats.pending_sellers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{stats.total_products}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">💰</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                            <dd className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_revenue)}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Monthly Revenue Chart */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analytics.monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#8884d8" 
                                        strokeWidth={3}
                                        dot={{ fill: '#8884d8' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Monthly Orders Chart */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.monthlyOrders}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="orders" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Order Status Distribution */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.orderStatusStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analytics.orderStatusStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top Categories */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.topCategories} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Seller Growth */}
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Growth</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analytics.sellerGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="sellers" 
                                        stroke="#8884d8" 
                                        fill="#8884d8" 
                                        fillOpacity={0.6}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white shadow-lg rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                            </div>
                            <div className="px-6 py-4">
                                {recent_orders.length === 0 ? (
                                    <p className="text-gray-500">No recent orders</p>
                                ) : (
                                    <div className="space-y-4">
                                        {recent_orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between border-b pb-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                                                    <p className="text-sm text-gray-500">{order.user?.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pending Sellers */}
                        <div className="bg-white shadow-lg rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Pending Seller Applications</h3>
                            </div>
                            <div className="px-6 py-4">
                                {recent_sellers.length === 0 ? (
                                    <p className="text-gray-500">No pending applications</p>
                                ) : (
                                    <div className="space-y-4">
                                        {recent_sellers.map((seller) => (
                                            <div key={seller.id} className="flex items-center justify-between border-b pb-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{seller.store_name}</p>
                                                    <p className="text-sm text-gray-500">{seller.user?.name}</p>
                                                </div>
                                                <div>
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        {seller.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}