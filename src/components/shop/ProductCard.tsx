'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { cn, formatPrice, mediaUrl } from '@/lib/utils'
import { useAddToCart } from '@/hooks/useApi'
import type { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Props { product: Product; className?: string; priority?: boolean }

export function ProductCard({ product, className, priority = false }: Props) {
    const addToCart    = useAddToCart()
    const firstVariant = product.variants?.[0]

    // Prefer product-level primary image, fall back to first image, then variant image
    const displayImage = mediaUrl(
        product.primary_image?.image_url ??
        product.images?.[0]?.image_url ??
        firstVariant?.primary_image?.image_url
    )

    const displayPrice = firstVariant ? formatPrice(firstVariant.price) : formatPrice(product.base_price)
    const hasMultiplePrices = product.variants?.length > 1 &&
        product.variants.some(v => v.price !== product.variants[0].price)

    return (
        <Card className={cn('group relative overflow-hidden transition-shadow hover:shadow-md', className)}>
            <Link href={`/shop/products/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-muted">
                    {displayImage ? (
                        <Image src={displayImage} alt={product.primary_image?.alt_text || product.name}
                               width={400} height={400}
                               priority={priority}
                               className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
                <CardContent className="p-3">
                    {product.category && (
                        <Badge variant="secondary" className="text-xs mb-1.5">{product.category.name}</Badge>
                    )}
                    <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-brand-700 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-semibold text-sm">
                            {hasMultiplePrices && <span className="text-xs text-muted-foreground font-normal mr-1">from</span>}
                            {displayPrice}
                        </p>
                        {product.variants?.length > 1 && (
                            <span className="text-xs text-muted-foreground">{product.variants.length} variants</span>
                        )}
                    </div>
                </CardContent>
            </Link>

            {firstVariant && (
                <Button size="icon"
                        className="absolute bottom-16 right-3 h-9 w-9 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
                        onClick={() => addToCart.mutate({ variant: firstVariant.id, quantity: 1 })}
                        disabled={addToCart.isPending}
                        aria-label="Add to cart"
                >
                    <ShoppingBag className="h-4 w-4" />
                </Button>
            )}
        </Card>
    )
}