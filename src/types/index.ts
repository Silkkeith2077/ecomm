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

export interface ProductImage {
    id: string
    image_url: string | null
    alt_text: string
    is_primary: boolean
    order: number
}

export type VideoType = 'upload' | 'youtube' | 'vimeo'

export interface ProductVideo {
    id: string
    video_type: VideoType
    thumbnail_url: string | null
    playback_url: string | null
    title: string
    is_primary: boolean
    order: number
}

// Variant-level media — same shape as product-level
export interface VariantImage {
    id: string
    image_url: string | null
    alt_text: string
    is_primary: boolean
    order: number
}

export interface VariantVideo {
    id: string
    video_type: VideoType
    thumbnail_url: string | null
    playback_url: string | null
    title: string
    is_primary: boolean
    order: number
}

export interface MinimalProduct {
    id: string
    name: string
    slug: number
}

export interface ProductVariant {
    id: string
    product: MinimalProduct
    sku: string
    price: string
    is_active: boolean
    attributes: Attribute[]
    stock_quantity?: number
    // Variant-level media (from VariantImage / VariantVideo models)
    images: VariantImage[]
    videos: VariantVideo[]
    primary_image: VariantImage | null
    primary_video: VariantVideo | null
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
    variants: ProductVariant[]
    images: ProductImage[]
    videos: ProductVideo[]
    primary_image: ProductImage | null
    primary_video: ProductVideo | null
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

// types/chat.ts
// Mirrors apps/chat/models.py and serializers exactly

export type ChatRoomStatus = 'open' | 'assigned' | 'resolved' | 'closed'
export type ChatMessageType = 'text' | 'image' | 'file' | 'system'

export interface ChatParticipant {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
}

export interface ChatMessagePreview {
    body: string
    created_at: string
    type: ChatMessageType
}

export interface ChatRoom {
    id: string
    customer: ChatParticipant
    agent: ChatParticipant | null
    order: string | null
    subject: string
    status: ChatRoomStatus
    created_at: string
    updated_at: string
    latest_message: ChatMessagePreview | null
    unread_count: number
}

export interface ChatMessage {
    id: string
    room: string
    sender: ChatParticipant | null
    message_type: ChatMessageType
    body: string
    file: string | null
    is_read: boolean
    created_at: string
    is_own: boolean
}

// WebSocket payloads (from ChatConsumer send_json calls)
export interface WSChatMessage {
    id: string
    sender_email: string | null
    sender_name: string
    message_type: ChatMessageType
    body: string
    created_at: string
    is_own: boolean
    is_read: boolean
}

export interface WSTypingPayload {
    sender: string
    is_typing: boolean
}

export interface WSJoinLeavePayload {
    sender: string
}

export interface WSReadPayload {
    reader: string
}

export interface WSHistoryPayload {
    messages: WSChatMessage[]
}