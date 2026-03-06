// types/index.ts
// Mirrors the Django backend models exactly

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    is_active: boolean
    is_staff: boolean
    created_at: string
    updated_at: string
}

export interface Address {
    id: string
    user: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
    is_default: boolean
}

export interface AuthTokens {
    access: string
    refresh: string
}

export interface LoginResponse {
    access: string
    refresh: string
}

export interface RegisterResponse {
    user: User
    access: string
    refresh: string
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export interface Category {
    id: string
    parent: string | null
    name: string
    slug: string
    description: string
    image_url: string
    is_active: boolean
    children?: Category[]
}

export interface Attribute {
    id: string
    name: string
    value: string
}

export interface ProductVariant {
    id: string
    product: string
    sku: string
    price: string
    image_url: string
    is_active: boolean
    attributes: Attribute[]
    stock_quantity?: number
}

export interface Product {
    id: string
    category: Category | null
    name: string
    slug: string
    description: string
    base_price: string
    is_active: boolean
    created_at: string
    updated_at: string
    variants: ProductVariant[]
    // computed helpers
    min_price?: string
    max_price?: string
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
    id: string
    variant: ProductVariant & { product: Product }
    quantity: number
    subtotal: string        // computed: variant.price × quantity
    added_at: string
}

export interface Cart {
    id: string
    items: CartItem[]
    item_count: number
    total_price: string     // computed sum of all item subtotals
    updated_at: string
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'

export interface OrderItem {
    id: string
    variant: ProductVariant & { product: Product }
    quantity: number
    unit_price: string
    total_price: string
}

export interface Order {
    id: string
    user: string
    address: Address
    status: OrderStatus
    items: OrderItem[]
    subtotal: string
    discount_amount: string
    shipping_cost: string
    total: string
    coupon_code?: string
    tracking_number?: string
    notes?: string
    created_at: string
    updated_at: string
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type PaymentGateway = 'stripe' | 'paypal'

export interface Payment {
    id: string
    order: string
    gateway: PaymentGateway
    gateway_payment_id: string
    status: PaymentStatus
    amount: string
    currency: string
    created_at: string
}

// ─── Shipping ─────────────────────────────────────────────────────────────────

export interface ShippingMethod {
    id: string
    name: string
    carrier: string
    estimated_days_min: number
    estimated_days_max: number
    price: string
    is_active: boolean
}

export interface TrackingEvent {
    id: string
    status: string
    description: string
    location: string
    timestamp: string
}

export interface Shipment {
    id: string
    order: string
    tracking_number: string
    carrier: string
    status: string
    tracking_events: TrackingEvent[]
    shipped_at: string | null
    delivered_at: string | null
    estimated_delivery: string | null
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export interface CouponValidationResult {
    valid: boolean
    coupon_code?: string
    discount_type?: 'percentage' | 'fixed'
    discount_amount: string
    final_total: string
    summary: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'order' | 'payment' | 'shipment' | 'promotion' | 'system'

export interface Notification {
    id: string
    type: NotificationType
    title: string
    body: string
    is_read: boolean
    created_at: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface SalesSummary {
    total_revenue: string
    total_orders: number
    average_order_value: string
    period: string
}

// ─── API Errors ───────────────────────────────────────────────────────────────

export interface ApiError {
    error: true
    request_id: string
    status_code: number
    detail: Record<string, string[]> | string
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutPayload {
    address_id: string
    shipping_method_id: string
    coupon_code?: string
    gateway: PaymentGateway
    cart_items: { variant: string; quantity: number }[]
}

export interface CheckoutResult {
    order: Order
    payment_url?: string        // PayPal approval URL
    client_secret?: string      // Stripe payment intent
    payment_intent_id?: string
}