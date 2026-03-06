'use client'

import { useProducts } from '@/hooks/useApi'
import { ProductCard } from './ProductCard'

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ page_size: 8 })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="h-4 skeleton rounded w-3/4" />
            <div className="h-4 skeleton rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {data?.results.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
