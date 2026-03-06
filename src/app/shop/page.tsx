'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCategories, useProducts } from '@/hooks/useApi'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'

export default function ShopPage() {
  const { data: categories, isLoading: catsLoading } = useCategories()
  const { data: newArrivals } = useProducts({ ordering: '-created_at', page_size: 4 })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Header */}
      <div>
        <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest mb-2">Browse</p>
        <h1 className="section-heading">Shop by Category</h1>
        <p className="text-surface-500 mt-2 max-w-lg">
          Explore our full range of products across every category.
        </p>
      </div>

      {/* Category grid */}
      <CategoryGrid />

      {/* All categories list with subcategories */}
      {!catsLoading && categories && categories.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-medium text-surface-900 mb-6">All Departments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="card p-5">
                <Link
                  href={`/shop/products?category=${cat.slug}`}
                  className="font-semibold text-surface-900 hover:text-brand-700 transition-colors flex items-center justify-between group"
                >
                  {cat.name}
                  <ArrowRight className="h-4 w-4 text-surface-400 group-hover:text-brand-600 transition-colors" />
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.children.map(child => (
                      <Link
                        key={child.id}
                        href={`/shop/products?category=${child.slug}`}
                        className="text-xs text-surface-500 hover:text-brand-600 bg-surface-100 hover:bg-brand-50 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New arrivals */}
      {newArrivals && newArrivals.results.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl font-medium text-surface-900">New Arrivals</h2>
            <Link href="/shop/products?ordering=-created_at" className="btn-ghost text-brand-700 gap-1.5 text-sm">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {newArrivals.results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
