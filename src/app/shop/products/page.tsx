'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { useProducts, useCategories } from '@/hooks/useApi'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const [filtersOpen, setFiltersOpen] = useState(false)

    const category    = searchParams.get('category_slug') ?? ''
    const ordering    = searchParams.get('ordering') ?? '-created_at'
    const page        = Number(searchParams.get('page') ?? '1')
    const minPrice    = Number(searchParams.get('min_price') ?? '0')
    const maxPrice    = Number(searchParams.get('max_price') ?? '99999')

    const { data, isLoading } = useProducts({
        ...(category && { category_slug: category }),
        ...(ordering && { ordering }),
        page,
        min_price: minPrice !== 0 ? minPrice : undefined,
        max_price: maxPrice !== 99999 ? maxPrice : undefined,
    })

    const { data: categories } = useCategories()

    const setParam = useCallback((key: string, value: string) => {
        const p = new URLSearchParams(searchParams.toString())
        if (value) p.set(key, value)
        else p.delete(key)
        p.delete('page')
        router.push(`/shop/products?${p.toString()}`)
    }, [searchParams, router])

    const handlePriceRangeChange = (range: [number, number]) => {
        const p = new URLSearchParams(searchParams.toString())
        p.set('min_price', range[0].toString())
        p.set('max_price', range[1].toString())
        p.delete('page')
        router.push(`/shop/products?${p.toString()}`)
    }

    const clearFilters = () => router.push('/shop/products')
    const hasFilters   = category || minPrice !== 0 || maxPrice !== 99999

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="section-heading">Shop Products</h1>
                {data && (
                    <p className="text-surface-500 mt-1 text-sm">
                        {data.count} {data.count === 1 ? 'product' : 'products'}
                        {category && ` in "${category}"`}
                    </p>
                )}
            </div>

            {/* Mobile filters toggle */}
            <div className="flex items-center justify-between gap-2 mb-6 lg:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="gap-2"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
                        Clear All
                    </Button>
                )}
            </div>

            {/* Layout */}
            <div className="flex gap-8">
                {/* Desktop Filters */}
                {categories && (
                    <ProductFilters
                        categories={categories}
                        selectedCategory={category}
                        onCategoryChange={cat => setParam('category_slug', cat)}
                        priceRange={[minPrice, maxPrice]}
                        onPriceRangeChange={handlePriceRangeChange}
                        sorting={ordering}
                        onSortingChange={sort => setParam('ordering', sort)}
                        hasFilters={hasFilters}
                        onClearFilters={clearFilters}
                        isOpen={filtersOpen}
                        onClose={() => setFiltersOpen(false)}
                    />
                )}

                {/* Products Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                            <Button onClick={clearFilters} className="mt-4">
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {data?.results.map((product, i) => (
                                <ProductCard key={product.id} product={product} priority={i === 0} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data && data.count > 20 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            {data.previous && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setParam('page', String(page - 1))}
                                >
                                    Previous
                                </Button>
                            )}
                            <span className="text-sm text-surface-500">
                                Page {page} of {Math.ceil(data.count / 20)}
                            </span>
                            {data.next && (
                                <Button
                                    size="sm"
                                    onClick={() => setParam('page', String(page + 1))}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
