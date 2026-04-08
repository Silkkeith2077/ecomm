'use client'

import Link from 'next/link'
import { useCategories } from '@/hooks/useApi'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS = [
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-cyan-600',
  'from-indigo-500 to-violet-600',
  'from-red-500 to-rose-600',
    'from-brand-500 to-brand-700',
]

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-video skeleton rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories?.slice(0, 8).map((cat, i) => (
        <Link
          key={cat.id}
          href={`/shop/products?category=${cat.slug}`}
          className="group relative aspect-video rounded-2xl overflow-hidden"
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100',
              CATEGORY_COLORS[i % CATEGORY_COLORS.length]
            )}
          />
          <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
            <p className="font-display text-lg font-semibold text-center">{cat.name}</p>
            {cat.children && cat.children.length > 0 && (
              <p className="text-xs text-white/70 mt-1">{cat.children.length} subcategories</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
