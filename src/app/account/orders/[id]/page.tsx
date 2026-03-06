'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Package, ShoppingBag, X } from 'lucide-react'
import { useOrder, useCancelOrder } from '@/hooks/useApi'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, getVariantLabel, cn } from '@/lib/utils'

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const { id }       = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id)
  const cancelOrder  = useCancelOrder()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 skeleton rounded w-1/3" />
        <div className="h-40 skeleton rounded-2xl" />
        <div className="h-60 skeleton rounded-2xl" />
      </div>
    )
  }

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-surface-500">Order not found.</p>
      <Link href="/account/orders" className="btn-primary btn-sm mt-4">Back to orders</Link>
    </div>
  )

  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/account/orders" className="btn-ghost btn-sm gap-1.5 -ml-2">
        <ChevronLeft className="h-4 w-4" />
        All Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-surface-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-surface-500 text-sm mt-1">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('badge text-sm px-3 py-1', ORDER_STATUS_COLOR[order.status])}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
          {['pending', 'confirmed'].includes(order.status) && (
            <button
              onClick={() => cancelOrder.mutate(order.id)}
              disabled={cancelOrder.isPending}
              className="btn-danger btn-sm"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <div className="card p-6">
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                    i <= currentStep
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'bg-white border-surface-300 text-surface-400'
                  )}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={cn(
                    'mt-2 text-[10px] font-medium capitalize hidden sm:block',
                    i <= currentStep ? 'text-brand-700' : 'text-surface-400'
                  )}>
                    {step}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-1 transition-colors',
                    i < currentStep ? 'bg-brand-500' : 'bg-surface-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card p-6">
        <h2 className="font-semibold text-surface-900 mb-4">Items</h2>
        <div className="divide-y divide-surface-100">
          {order.items?.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                {item.variant.image_url ? (
                  <Image src={item.variant.image_url} alt="" width={64} height={64} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-surface-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-surface-900 text-sm">{item.variant.product?.name}</p>
                {item.variant.attributes?.length > 0 && (
                  <p className="text-xs text-surface-500 mt-0.5">
                    {getVariantLabel(item.variant.attributes)}
                  </p>
                )}
                <p className="text-xs text-surface-400 mt-0.5">
                  {formatPrice(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-surface-900">{formatPrice(item.total_price)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-surface-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-surface-600">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {parseFloat(order.discount_amount) > 0 && (
            <div className="flex justify-between text-sm text-brand-700">
              <span>Discount</span>
              <span>−{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-surface-600">Shipping</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t border-surface-100 pt-2">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {order.address && (
        <div className="card p-6">
          <h2 className="font-semibold text-surface-900 mb-3">Delivery Address</h2>
          <address className="not-italic text-sm text-surface-600 space-y-1">
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
            <p>{order.address.country}</p>
          </address>
        </div>
      )}
    </div>
  )
}
