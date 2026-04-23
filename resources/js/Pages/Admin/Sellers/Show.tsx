import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Seller } from '@/types';

interface AdminSellersShowProps {
    seller: Seller;
}

export default function AdminSellersShow({ seller }: AdminSellersShowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'suspended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this seller?')) {
            router.patch(route('admin.sellers.approve', seller.id));
        }
    };

    const handleReject = () => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.patch(route('admin.sellers.reject', seller.id), { reason });
        }
    };

    const handleSuspend = () => {
        if (confirm('Are you sure you want to suspend this seller?')) {
            router.patch(route('admin.sellers.suspend', seller.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Seller: ${seller.store_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{seller.store_name}</h1>
                                    <p className="text-lg text-gray-600 mt-1">Seller Details</p>
                                </div>
                                <div className="flex space-x-3">
                                    {seller.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={handleApprove}
                                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                            >
                                                Approve Seller
                                            </button>
                                            <button
                                                onClick={handleReject}
                                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                            >
                                                Reject Seller
                                            </button>
                                        </>
                                    )}
                                    {seller.status === 'approved' && (
                                        <button
                                            onClick={handleSuspend}
                                            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                                        >
                                            Suspend Seller
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Seller Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Name</label>
                                            <p className="text-lg text-gray-900">{seller.user?.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-lg text-gray-900">{seller.user?.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status</label>
                                            <div className="mt-1">
                                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(seller.status)}`}>
                                                    {seller.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Commission Rate</label>
                                            <p className="text-lg text-gray-900">{seller.commission_rate}%</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                                            <p className="text-lg text-gray-900">
                                                {new Date(seller.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Store Information */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Store Name</label>
                                            <p className="text-lg text-gray-900">{seller.store_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Description</label>
                                            <p className="text-gray-900">{seller.store_description || 'No description provided'}</p>
                                        </div>
                                        {seller.store_logo && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Store Logo</label>
                                                <div className="mt-2">
                                                    <img 
                                                        src={seller.store_logo} 
                                                        alt="Store Logo"
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Information */}
                            {seller.business_info && (
                                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                                    <pre className="whitespace-pre-wrap text-gray-700">
                                        {JSON.stringify(seller.business_info, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {seller.status === 'rejected' && seller.rejection_reason && (
                                <div className="mt-6 bg-red-50 border border-red-200 p-6 rounded-lg">
                                    <h2 className="text-xl font-semibold text-red-900 mb-2">Rejection Reason</h2>
                                    <p className="text-red-800">{seller.rejection_reason}</p>
                                </div>
                            )}

                            {/* Products Summary */}
                            <div className="mt-6 bg-white border p-6 rounded-lg">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Statistics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {seller.products?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Products</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">0</div>
                                        <div className="text-sm text-gray-500">Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">$0</div>
                                        <div className="text-sm text-gray-500">Revenue</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">5.0</div>
                                        <div className="text-sm text-gray-500">Rating</div>
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