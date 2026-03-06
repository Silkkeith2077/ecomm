'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useProduct, useAddToCart } from '@/hooks/useApi'
import { formatPrice, getVariantLabel, cn } from '@/lib/utils'
import type { ProductVariant } from '@/types'

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { data: product, isLoading } = useProduct(slug)
    const addToCart = useAddToCart()

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [qty, setQty] = useState(1)

    const variant = selectedVariant ?? product?.variants?.[0] ?? null

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
                    <div className="aspect-square skeleton rounded-3xl" />
                    <div className="space-y-4 pt-4">
                        <div className="h-8 skeleton rounded w-3/4" />
                        <div className="h-6 skeleton rounded w-1/4" />
                        <div className="h-20 skeleton rounded" />
                        <div className="h-12 skeleton rounded" />
                    </div>
                </div>
            </div>
        )
    }

    if (!product) return (
        <div className="flex flex-col items-center justify-center py-32">
            <p className="text-surface-500">Product not found.</p>
            <Link href="/shop/products" className="btn-primary btn-sm mt-4">Back to shop</Link>
        </div>
    )

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-surface-500 mb-8">
                <Link href="/" className="hover:text-surface-900 transition-colors">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/shop/products" className="hover:text-surface-900 transition-colors">Products</Link>
                {product.category && (
                    <>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link
                            href={`/shop/products?category_slug=${product.category.slug}`}
                            className="hover:text-surface-900 transition-colors"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-surface-900 font-medium">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Image */}
                <div className="space-y-3">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-surface-100">
                        {variant?.image_url ? (
                            <Image
                                src={variant.image_url}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <ShoppingBag className="h-20 w-20 text-surface-300" />
                            </div>
                        )}
                    </div>

                    {/* Variant thumbnails */}
                    {product.variants.length > 1 && (
                        <div className="flex gap-2 flex-wrap">
                            {product.variants.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v)}
                                    className={cn(
                                        'h-16 w-16 rounded-xl overflow-hidden border-2 transition-all',
                                        variant?.id === v.id
                                            ? 'border-brand-500 ring-2 ring-brand-500/20'
                                            : 'border-surface-200 hover:border-surface-300'
                                    )}
                                >
                                    {v.image_url ? (
                                        <Image src={v.image_url} alt={v.sku} width={64} height={64} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-surface-100 flex items-center justify-center text-[10px] text-surface-500 font-mono p-1 text-center">
                                            {getVariantLabel(v.attributes).slice(0, 8)}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6">
                    {product.category && (
                        <Link
                            href={`/shop/products?category_slug=${product.category.slug}`}
                            className="text-xs text-brand-600 font-semibold uppercase tracking-widest hover:text-brand-700"
                        >
                            {product.category.name}
                        </Link>
                    )}

                    <div>
                        <h1 className="font-display text-3xl lg:text-4xl font-medium text-surface-900 leading-tight">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-2xl font-bold text-surface-900">
                            {variant ? formatPrice(variant.price) : formatPrice(product.base_price)}
                        </p>
                    </div>

                    <p className="text-surface-600 leading-relaxed">{product.description}</p>

                    {/* Variant selector */}
                    {product.variants.length > 1 && (
                        <div>
                            <p className="text-sm font-semibold text-surface-900 mb-3">
                                {variant ? getVariantLabel(variant.attributes) : 'Select variant'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={cn(
                                            'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                                            variant?.id === v.id
                                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                : 'border-surface-200 text-surface-700 hover:border-surface-300 hover:bg-surface-50'
                                        )}
                                    >
                                        {getVariantLabel(v.attributes)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-surface-900">Quantity</span>
                        <div className="flex items-center gap-1 rounded-xl border border-surface-200 overflow-hidden">
                            <button
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                className="px-3 py-2.5 text-surface-600 hover:bg-surface-100 transition-colors"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 text-sm font-semibold text-surface-900 min-w-[40px] text-center">
                {qty}
              </span>
                            <button
                                onClick={() => setQty(q => q + 1)}
                                className="px-3 py-2.5 text-surface-600 hover:bg-surface-100 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Add to cart */}
                    <button
                        onClick={() => variant && addToCart.mutate({ variant: variant.id, quantity: qty })}
                        disabled={!variant || addToCart.isPending}
                        className="btn-primary btn-lg w-full"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {addToCart.isPending ? 'Adding…' : 'Add to Cart'}
                    </button>

                    {/* Attributes */}
                    {variant && variant.attributes.length > 0 && (
                        <div className="rounded-2xl border border-surface-200 divide-y divide-surface-100">
                            {variant.attributes.map(attr => (
                                <div key={attr.id} className="flex justify-between px-4 py-3 text-sm">
                                    <span className="text-surface-500">{attr.name}</span>
                                    <span className="font-medium text-surface-900">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Perks */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Truck,       text: 'Free shipping $75+' },
                            { icon: RotateCcw,   text: '30-day returns' },
                            { icon: ShieldCheck, text: 'Secure checkout' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-50 text-center">
                                <Icon className="h-4 w-4 text-brand-600" />
                                <span className="text-xs text-surface-600">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}