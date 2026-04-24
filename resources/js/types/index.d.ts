export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'seller' | 'buyer';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    seller?: Seller;
    orders?: Order[];
}

export interface Seller {
    id: number;
    user_id: number;
    store_name: string;
    store_description?: string;
    store_logo?: string;
    store_banner?: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    rejection_reason?: string;
    commission_rate: number;
    business_info?: any;
    created_at: string;
    updated_at: string;
    user?: User;
    products?: Product[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent_id?: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    parent?: Category;
    children?: Category[];
    products?: Product[];
}

export interface Product {
    id: number;
    seller_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    sku: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    min_stock_level: number;
    stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
    track_inventory: boolean;
    weight?: number;
    dimensions?: any;
    is_active: boolean;
    is_featured: boolean;
    images?: string[];
    attributes?: any;
    rating_avg: number;
    rating_count: number;
    view_count: number;
    sales_count: number;
    created_at: string;
    updated_at: string;
    seller?: Seller;
    category?: Category;
    reviews?: Review[];
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number;
    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    total_amount: number;
    currency: string;
    billing_address: any;
    shipping_address: any;
    payment_method?: string;
    payment_status: string;
    payment_details?: any;
    notes?: string;
    shipped_at?: string;
    delivered_at?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    seller_id: number;
    product_name: string;
    product_sku: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    product_options?: any;
    created_at: string;
    updated_at: string;
    order?: Order;
    product?: Product;
    seller?: Seller;
}

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    order_item_id: number;
    rating: number;
    comment?: string;
    images?: string[];
    is_verified: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    product?: Product;
    order_item?: OrderItem;
}

export interface Step {
    key: string;
    label: string;
    completed: boolean;
    current?: boolean;
}

export interface Cart {
    id: number;
    user_id?: number;
    session_id?: string;
    product_id: number;
    quantity: number;
    options?: any;
    created_at: string;
    updated_at: string;
    product?: Product;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
