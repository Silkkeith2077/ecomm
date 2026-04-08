'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tag, Check, Loader2, CreditCard, AlertCircle, Shield, Truck } from 'lucide-react'
import { toast } from 'sonner'
import {
    useCart, useAddresses, useShippingMethods,
    useValidateCoupon, useCheckout, useCreateAddress,
} from '@/hooks/useApi'
import { formatPrice, cn } from '@/lib/utils'
import type { CheckoutPayload } from '@/types'

const addressSchema = z.object({
    line1:       z.string().min(3, 'Required'),
    line2:       z.string().optional(),
    city:        z.string().min(2, 'Required'),
    state:       z.string().min(2, 'Required'),
    postal_code: z.string().min(3, 'Required'),
    country:     z.string().min(2, 'Required'),
})
type AddressForm = z.infer<typeof addressSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const { data: cart }       = useCart()
    const { data: addresses }  = useAddresses()
    const { data: methods }    = useShippingMethods()
    const validateCoupon       = useValidateCoupon()
    const checkout             = useCheckout()
    const createAddress        = useCreateAddress()

    const [selectedAddress,  setSelectedAddress]  = useState<string>('')
    const [selectedShipping, setSelectedShipping] = useState<string>('')
    const [couponCode,       setCouponCode]        = useState('')
    const [couponResult,     setCouponResult]      = useState<{ discount_amount: string; summary: string } | null>(null)
    const [gateway,          setGateway]           = useState<'stripe' | 'paypal'>('stripe')
    const [newAddrOpen,      setNewAddrOpen]       = useState(false)

    const form = useForm<AddressForm>({ resolver: zodResolver(addressSchema) })

    const selectedMethod = methods?.find(m => m.id === selectedShipping)
    const subtotal       = parseFloat(cart?.total_price ?? '0')
    const discount       = parseFloat(couponResult?.discount_amount ?? '0')
    const shipping       = parseFloat(selectedMethod?.price ?? '0')
    const total          = Math.max(0, subtotal - discount + shipping)

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return
        try {
            const result = await validateCoupon.mutateAsync({
                code: couponCode.toUpperCase(),
                subtotal: cart?.total_price ?? '0',
            })
            setCouponResult(result)
            toast.success(result.summary)
        } catch {
            setCouponResult(null)
        }
    }

    const handleSaveAddress = async (data: AddressForm) => {
        const addr = await createAddress.mutateAsync({ ...data, is_default: false })
        setSelectedAddress(addr.id)
        setNewAddrOpen(false)
        form.reset()
    }

    const handleCheckout = async () => {
        if (!selectedAddress) return toast.error('Please select a delivery address')
        if (!selectedShipping) return toast.error('Please select a shipping method')
        if (!cart?.items.length) return toast.error('Your cart is empty')

        const payload: CheckoutPayload = {
            address_id:        selectedAddress,
            // shipping_method_id: selectedShipping,
            coupon_code:       couponResult ? couponCode : undefined,
            gateway,
            cart_items: cart.items.map(i => ({ variant: i.variant.id, quantity: i.quantity })),
        }

        const result = await checkout.mutateAsync(payload)

        if (result.payment_url) {
            // PayPal — redirect to approval URL
            window.location.href = result.payment_url
        } else {
            // Stripe — redirect to order success (would normally load Stripe Elements)
            toast.success('Order placed!')
            router.push(`/account/orders/${result.order.id}`)
        }
    }

    const steps = [
        { num: 1, label: 'Address', done: !!selectedAddress },
        { num: 2, label: 'Shipping', done: !!selectedShipping && !!selectedAddress },
        { num: 3, label: 'Payment', done: !!selectedShipping && !!selectedAddress },
    ]

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-12">
                <h1 className="section-heading mb-6">Checkout</h1>

                {/* Progress Steps */}
                <div className="checkout-steps">
                    {steps.map((step, idx) => (
                        <div key={step.num} className="flex items-center">
                            <div className={cn('checkout-step', step.done && 'checkout-step-done')}>
                                {step.done ? <Check className="h-5 w-5" /> : step.num}
                            </div>
                            <span className="text-sm font-medium ml-2 hidden sm:inline">{step.label}</span>
                            {idx < steps.length - 1 && (
                                <div className={cn('checkout-step-line', step.done && 'checkout-step-line-done')} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Trust Signals */}
                <div className="checkout-trust mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span>Fast shipping</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-purple-600" />
                        <span>100% Satisfaction</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Left col */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Address */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-surface-900 mb-4">Delivery Address</h2>
                        {addresses && addresses.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {addresses.map(addr => (
                                    <button
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className={cn(
                                            'w-full text-left rounded-xl border p-4 transition-all',
                                            selectedAddress === addr.id
                                                ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                                                : 'border-surface-200 hover:border-surface-300'
                                        )}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-surface-900">{addr.line1}</p>
                                                {addr.line2 && <p className="text-xs text-surface-500">{addr.line2}</p>}
                                                <p className="text-xs text-surface-500">
                                                    {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                                                </p>
                                            </div>
                                            {selectedAddress === addr.id && (
                                                <Check className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                        {addr.is_default && (
                                            <span className="badge bg-surface-100 text-surface-600 ring-surface-200 mt-2 text-[10px]">
                        Default
                      </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setNewAddrOpen(!newAddrOpen)}
                            className="btn-outline btn-sm w-full"
                        >
                            + Add new address
                        </button>

                        {newAddrOpen && (
                            <form
                                onSubmit={form.handleSubmit(handleSaveAddress)}
                                className="mt-4 space-y-3 border-t border-surface-100 pt-4"
                            >
                                {([
                                    ['line1', 'Street address'],
                                    ['line2', 'Apartment, suite, etc. (optional)'],
                                    ['city', 'City'],
                                    ['state', 'State'],
                                    ['postal_code', 'ZIP / Postal code'],
                                    ['country', 'Country'],
                                ] as const).map(([field, placeholder]) => (
                                    <div key={field}>
                                        <input
                                            {...form.register(field)}
                                            placeholder={placeholder}
                                            className="input text-sm"
                                        />
                                        {form.formState.errors[field] && (
                                            <p className="text-xs text-red-500 mt-1">
                                                {form.formState.errors[field]?.message}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    disabled={createAddress.isPending}
                                    className="btn-primary btn-sm w-full"
                                >
                                    {createAddress.isPending ? 'Saving…' : 'Save Address'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Shipping */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-surface-900 mb-4">Shipping Method</h2>
                        {!methods?.length && (
                            <p className="text-sm text-surface-500">No shipping methods available.</p>
                        )}
                        <div className="space-y-3">
                            {methods?.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedShipping(method.id)}
                                    className={cn(
                                        'w-full text-left rounded-xl border p-4 transition-all',
                                        selectedShipping === method.id
                                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                                            : 'border-surface-200 hover:border-surface-300'
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-surface-900">{method.name}</p>
                                            <p className="text-xs text-surface-500">
                                                {method.carrier} · {method.estimated_days_min}–{method.estimated_days_max} business days
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-surface-900">{formatPrice(method.price)}</span>
                                            {selectedShipping === method.id && (
                                                <Check className="h-4 w-4 text-brand-600" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment gateway */}
                    <div className="card p-6">
                        <h2 className="font-semibold text-surface-900 mb-4">Payment Method</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {(['stripe', 'paypal'] as const).map(gw => (
                                <button
                                    key={gw}
                                    onClick={() => setGateway(gw)}
                                    className={cn(
                                        'flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium capitalize transition-all',
                                        gateway === gw
                                            ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                                            : 'border-surface-200 text-surface-700 hover:border-surface-300'
                                    )}
                                >
                                    <CreditCard className="h-4 w-4" />
                                    {gw === 'stripe' ? 'Credit Card' : 'PayPal'}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-surface-500 mt-3 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Your payment info is handled securely by {gateway === 'stripe' ? 'Stripe' : 'PayPal'}.
                        </p>
                    </div>
                </div>

                {/* Order summary */}
                <div className="lg:col-span-2">
                    <div className="card p-6 sticky top-24">
                        <h2 className="font-semibold text-surface-900 mb-4">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                            {cart?.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-surface-100 shrink-0 overflow-hidden">
                                        {item.variant.images?.[0]?.image_url && (
                                            <img src={item.variant.images?.[0]?.image_url} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-surface-900 truncate">
                                            {item.variant.product?.name}
                                        </p>
                                        <p className="text-xs text-surface-500">×{item.quantity}</p>
                                    </div>
                                    <p className="text-xs font-semibold text-surface-900">{formatPrice(item.subtotal)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-surface-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-600">Subtotal</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            {couponResult && discount > 0 && (
                                <div className="flex justify-between text-sm text-brand-700">
                                    <span>Discount</span>
                                    <span>−{formatPrice(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-surface-600">Shipping</span>
                                <span className="font-medium">{shipping > 0 ? formatPrice(shipping) : '—'}</span>
                            </div>
                            <div className="flex justify-between text-base font-semibold border-t border-surface-100 pt-2 mt-2">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="mt-4 flex gap-2">
                            <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Coupon code"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    className="input text-sm pl-8"
                                />
                            </div>
                            <button
                                onClick={handleApplyCoupon}
                                disabled={validateCoupon.isPending}
                                className="btn-outline btn-sm px-4 shrink-0"
                            >
                                {validateCoupon.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Apply'}
                            </button>
                        </div>
                        {couponResult && (
                            <p className="text-xs text-brand-700 mt-2 flex items-center gap-1.5">
                                <Check className="h-3.5 w-3.5" />
                                {couponResult.summary}
                            </p>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={checkout.isPending || !cart?.items.length}
                            className="btn-primary w-full btn-lg mt-5"
                        >
                            {checkout.isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                            ) : (
                                `Place Order · ${formatPrice(total)}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
