'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ChevronRight, Minus, Plus, Truck, RotateCcw, ShieldCheck, Play, Image as ImageIcon } from 'lucide-react'
import { useProduct, useAddToCart } from '@/hooks/useApi'
import { formatPrice, getVariantLabel, cn, mediaUrl } from '@/lib/utils'
import type { ProductVariant, ProductImage, ProductVideo, VariantImage, VariantVideo } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type MediaItem =
    | { kind: 'image'; data: ProductImage | VariantImage; variantId?: string }
    | { kind: 'video'; data: ProductVideo | VariantVideo; variantId?: string }

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { data: product, isLoading } = useProduct(slug)
    const addToCart = useAddToCart()

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [activeMedia,     setActiveMedia]     = useState<MediaItem | null>(null)
    const [qty, setQty] = useState(1)

    const variant = selectedVariant ?? product?.variants?.[0] ?? null

    // Build unified media strip: product images/videos + all variant images/videos
    const mediaList: MediaItem[] = product ? [
        ...product.images.map(img => ({ kind: 'image' as const, data: img })),
        ...product.videos.map(vid => ({ kind: 'video' as const, data: vid })),
        ...product.variants.flatMap(v => [
            ...v.images.map(img => ({ kind: 'image' as const, data: img, variantId: v.id })),
            ...v.videos.map(vid => ({ kind: 'video' as const, data: vid, variantId: v.id })),
        ]),
    ] : []

    // When a variant is selected, its primary image becomes the main display
    // (unless user manually picked something via the strip)
    const variantDefaultMedia: MediaItem | null = variant?.primary_image
        ? { kind: 'image', data: variant.primary_image, variantId: variant.id }
        : variant?.images?.[0]
            ? { kind: 'image', data: variant.images[0], variantId: variant.id }
            : null

    // Priority: user picked via strip → variant's primary → product primary → first in list
    const currentMedia: MediaItem | null =
        activeMedia ??
        variantDefaultMedia ??
        (product?.primary_image ? { kind: 'image', data: product.primary_image } : null) ??
        mediaList[0] ??
        null

    if (isLoading) return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-3xl" />
                    <div className="flex gap-2">
                        {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-16 rounded-xl" />)}
                    </div>
                </div>
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )

    if (!product) return (
        <div className="flex flex-col items-center justify-center py-32">
            <p className="text-muted-foreground">Product not found.</p>
            <Button asChild size="sm" className="mt-4"><Link href="/shop/products">Back to shop</Link></Button>
        </div>
    )

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/shop/products" className="hover:text-foreground transition-colors">Products</Link>
                {product.category && (
                    <>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link href={`/shop/products?category_slug=${product.category.slug}`}
                              className="hover:text-foreground transition-colors">
                            {product.category.name}
                        </Link>
                    </>
                )}
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">

                {/* ── Media column ── */}
                <div className="space-y-3">

                    {/* Main viewer */}
                    <div className="aspect-square rounded-3xl overflow-hidden bg-muted relative">
                        {currentMedia?.kind === 'video' ? (
                            <VideoPlayer video={currentMedia.data} />
                        ) : currentMedia?.kind === 'image' && currentMedia.data.image_url ? (
                            <Image src={mediaUrl(currentMedia.data.image_url)!}
                                   alt={currentMedia.data.alt_text || product.name}
                                   width={600} height={600}
                                   loading="eager"
                                   priority
                                   className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center">
                                <ShoppingBag className="h-20 w-20 text-muted-foreground/20" />
                            </div>
                        )}
                    </div>

                    {/* Unified thumbnail strip: product images/videos + variant images/videos */}
                    {mediaList.length > 1 && (
                        <ScrollArea className="w-full">
                            <div className="flex gap-2 pb-2">
                                {mediaList.map((item, i) => {
                                    // An item is "active" if the user clicked it, or if it belongs to
                                    // the selected variant's primary image when no explicit pick was made
                                    const isActive = activeMedia
                                        ? activeMedia.data.id === item.data.id
                                        : currentMedia?.data.id === item.data.id

                                    // Dim thumbnails that belong to a different variant
                                    const belongsToOtherVariant =
                                        item.variantId !== undefined && item.variantId !== variant?.id

                                    const thumbSrc = item.kind === 'image'
                                        ? item.data.image_url
                                        : item.data.thumbnail_url

                                    return (
                                        <button key={item.data.id + i}
                                                onClick={() => {
                                                    // Clicking a variant's media also selects that variant
                                                    if (item.variantId) {
                                                        const v = product.variants.find(v => v.id === item.variantId)
                                                        if (v) setSelectedVariant(v)
                                                    }
                                                    setActiveMedia(item)
                                                }}
                                                className={cn(
                                                    'relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all',
                                                    isActive
                                                        ? 'border-brand-500 ring-2 ring-brand-500/20'
                                                        : 'border-border hover:border-muted-foreground/40',
                                                    belongsToOtherVariant && 'opacity-40',
                                                )}>
                                            {thumbSrc ? (
                                                <Image src={mediaUrl(thumbSrc)!} alt="" width={64} height={64} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                                    {item.kind === 'video'
                                                        ? <Play className="h-4 w-4 text-muted-foreground" />
                                                        : <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                                                </div>
                                            )}
                                            {item.kind === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Play className="h-4 w-4 text-white drop-shadow" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </div>

                {/* ── Details column ── */}
                <div className="flex flex-col gap-5">
                    {product.category && (
                        <Link href={`/shop/products?category_slug=${product.category.slug}`}>
                            <Badge variant="secondary" className="text-xs uppercase tracking-widest">
                                {product.category.name}
                            </Badge>
                        </Link>
                    )}

                    <div>
                        <h1 className="font-display text-3xl lg:text-4xl font-medium leading-tight">{product.name}</h1>
                        <p className="mt-3 text-2xl font-bold">
                            {variant ? formatPrice(variant.price) : formatPrice(product.base_price)}
                        </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    <Separator />

                    {/* Variant selector */}
                    {product.variants.length > 1 && (
                        <div>
                            <p className="text-sm font-semibold mb-3">
                                {variant ? getVariantLabel(variant.attributes) : 'Select variant'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map(v => (
                                    <Button key={v.id} size="sm"
                                            variant={variant?.id === v.id ? 'default' : 'outline'}
                                            onClick={() => { setSelectedVariant(v); setActiveMedia(null) }}>
                                        {getVariantLabel(v.attributes)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">Quantity</span>
                        <div className="flex items-center rounded-md border overflow-hidden">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none"
                                    onClick={() => setQty(q => Math.max(1, q - 1))}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 text-sm font-semibold min-w-[40px] text-center">{qty}</span>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none"
                                    onClick={() => setQty(q => q + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Add to cart */}
                    <Button size="lg" className="w-full"
                            onClick={() => variant && addToCart.mutate({ variant: variant.id, quantity: qty })}
                            disabled={!variant || addToCart.isPending}>
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        {addToCart.isPending ? 'Adding…' : 'Add to Cart'}
                    </Button>

                    {/* Variant attributes table */}
                    {variant && variant.attributes.length > 0 && (
                        <Card className="divide-y overflow-hidden">
                            {variant.attributes.map(attr => (
                                <div key={attr.id} className="flex justify-between px-4 py-3 text-sm">
                                    <span className="text-muted-foreground">{attr.name}</span>
                                    <span className="font-medium">{attr.value}</span>
                                </div>
                            ))}
                        </Card>
                    )}

                    {/* Perks */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Truck,       text: 'Free shipping $75+' },
                            { icon: RotateCcw,   text: '30-day returns' },
                            { icon: ShieldCheck, text: 'Secure checkout' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted text-center">
                                <Icon className="h-4 w-4 text-brand-600" />
                                <span className="text-xs text-muted-foreground">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Video player component ────────────────────────────────────────────────────

function VideoPlayer({ video }: { video: ProductVideo | VariantVideo }) {
    if (!video.playback_url) return (
        <div className="h-full w-full flex items-center justify-center bg-muted">
            <Play className="h-12 w-12 text-muted-foreground/30" />
        </div>
    )

    if (video.video_type === 'youtube') {
        const id = extractYouTubeId(video.playback_url)
        if (id) return (
            <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        )
    }

    if (video.video_type === 'vimeo') {
        const id = extractVimeoId(video.playback_url)
        if (id) return (
            <iframe
                src={`https://player.vimeo.com/video/${id}`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
            />
        )
    }

    // Direct upload
    return (
        <video controls className="h-full w-full object-contain bg-black"
               poster={mediaUrl(video.thumbnail_url) ?? undefined}>
            <source src={mediaUrl(video.playback_url) ?? ''} />
        </video>
    )
}

function extractYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return m?.[1] ?? null
}

function extractVimeoId(url: string): string | null {
    const m = url.match(/vimeo\.com\/(\d+)/)
    return m?.[1] ?? null
}