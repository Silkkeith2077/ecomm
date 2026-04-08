'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useApi'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'

type SortOption = {
    label: string
    value: string
}

const SORT_OPTIONS: SortOption[] = [
    { label: 'Newest',       value: '-created_at' },
    { label: 'Oldest',       value: 'created_at' },
    { label: 'Price: Low',   value: 'base_price' },
    { label: 'Price: High',  value: '-base_price' },
    { label: 'Name A-Z',     value: 'name' },
]

export default function ProductsPage() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const [filtersOpen, setFiltersOpen] = useState(false)

    const category = searchParams.get('category_slug') ?? ''
    const ordering = searchParams.get('ordering') ?? '-created_at'
    const page     = Number(searchParams.get('page') ?? '1')
    const search   = searchParams.get('search') ?? ''

    const { data, isLoading } = useProducts({
        ...(category && { category_slug: category }),
        ...(ordering && { ordering }),
        ...(search && { search }),
        page,
    })

    const { data: categories } = useCategories()

    const setParam = useCallback((key: string, value: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (value) p.set(key, value)
        else p.delete(key)
        p.delete('page')
        router.push(`/shop/products?${p.toString()}`)
    }, [searchParams, router])

    const clearFilters = () => router.push('/shop/products')
    const hasFilters   = category || search

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="section-heading">Products</h1>
                {data && (
                    <p className="text-surface-500 mt-1 text-sm">
                        {data.count} {data.count === 1 ? 'product' : 'products'}
                        {category && ` in "${category}"`}
                    </p>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search…"
                        defaultValue={search}
                        onKeyDown={e => {
                            if (e.key === 'Enter') setParam('search', (e.target as HTMLInputElement).value)
                        }}
                        className="input text-sm py-2 w-48"
                    />

                    {/* Category filter */}
                    <div className="relative">
                        <select
                            value={category}
                            onChange={e => setParam('category_slug', e.target.value)}
                            className="input text-sm py-2 pr-8 appearance-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-surface-400" />
                    </div>

                    {hasFilters && (
                        <button onClick={clearFilters} className="btn-ghost btn-sm gap-1.5 text-red-600 hover:bg-red-50">
                            <X className="h-3.5 w-3.5" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Sort */}
                <div className="relative flex items-center gap-2">
                    <span className="text-sm text-surface-500 hidden sm:block">Sort:</span>
                    <div className="relative">
                        <select
                            value={ordering}
                            onChange={e => setParam('ordering', e.target.value)}
                            className="input text-sm py-2 pr-8 appearance-none cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-surface-400" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-3 animate-pulse">
                            <div className="aspect-square skeleton rounded-2xl" />
                            <div className="h-4 skeleton rounded w-3/4" />
                            <div className="h-4 skeleton rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : data?.results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-2xl mb-2">🔍</p>
                    <h3 className="font-display text-xl font-medium text-surface-900">No products found</h3>
                    <p className="text-surface-500 mt-1 text-sm">Try adjusting your filters</p>
                    <button onClick={clearFilters} className="btn-primary btn-sm mt-4">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {data?.results.map((product, i) => (
                        <ProductCard key={product.id} product={product} priority={i === 0} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {data && data.count > 20 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                    {data.previous && (
                        <button
                            onClick={() => setParam('page', String(page - 1))}
                            className="btn-outline btn-sm"
                        >
                            Previous
                        </button>
                    )}
                    <span className="text-sm text-surface-500">
            Page {page} of {Math.ceil(data.count / 20)}
          </span>
                    {data.next && (
                        <button
                            onClick={() => setParam('page', String(page + 1))}
                            className="btn-primary btn-sm"
                        >
                            Next
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}