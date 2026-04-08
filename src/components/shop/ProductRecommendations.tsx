'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useApi'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductRecommendationsProps {
  currentProduct: Product
  title?: string
  description?: string
  showViewAll?: boolean
}

export function ProductRecommendations({
  currentProduct,
  title = 'You May Also Like',
  description = 'Products similar to the one you\'re viewing',
  showViewAll = true,
}: ProductRecommendationsProps) {
  // Fetch similar products based on category
  const { data: recommendations, isLoading } = useProducts({
    category_slug: currentProduct.category?.slug,
    page_size: 4,
  })

  // Filter out the current product
  const similarProducts = recommendations?.results.filter(
    p => p.id !== currentProduct.id
  ) || []

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-8 skeleton rounded w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square skeleton rounded-2xl" />
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-4 skeleton rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (similarProducts.length === 0) {
    return null
  }

  return (
    <section className="recommendations-section">
      <div className="recommendations-header">
        <div>
          <h2 className="section-heading">{title}</h2>
          {description && <p className="text-surface-500 mt-1">{description}</p>}
        </div>
        {showViewAll && (
          <Link href={`/shop/products?category=${currentProduct.category?.slug}`} className="recommendations-link">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="recommendations-grid">
        {similarProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i === 0} />
        ))}
      </div>
    </section>
  )
}
