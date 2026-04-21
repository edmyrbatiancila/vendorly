import { User } from "@/types";
import { Link, usePage } from "@inertiajs/react";


interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Vendorly Admin
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {auth.user.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="mt-8 px-4">
                        <div className="space-y-2">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/sellers"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Sellers
                            </Link>
                            <Link
                                href="/admin/products"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Products
                            </Link>
                            <Link
                                href="/admin/orders"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                            >
                                Users
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}