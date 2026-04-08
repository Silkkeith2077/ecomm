'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  sorting: string
  onSortingChange: (sorting: string) => void
  hasFilters: boolean
  onClearFilters: () => void
  isOpen?: boolean
  onClose?: () => void
}

const SORT_OPTIONS = [
  { label: 'Newest', value: '-created_at' },
  { label: 'Oldest', value: 'created_at' },
  { label: 'Price: Low to High', value: 'base_price' },
  { label: 'Price: High to Low', value: '-base_price' },
  { label: 'Name A-Z', value: 'name' },
]

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $250', min: 100, max: 250 },
  { label: '$250+', min: 250, max: 99999 },
]

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sorting,
  onSortingChange,
  hasFilters,
  onClearFilters,
  isOpen = false,
  onClose,
}: ProductFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    sort: true,
  })

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter] }))
  }

  const FilterSection = ({ title, expanded, onToggle, children }: any) => (
    <div className="border-b border-border py-4 first:pt-0 last:border-0">
      <button
        onClick={onToggle}
        className="filter-header"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
      </button>
      {expanded && <div className="filter-content">{children}</div>}
    </div>
  )

  const content = (
    <div className="space-y-2">
      <FilterSection
        title="Category"
        expanded={expandedFilters.category}
        onToggle={() => toggleFilter('category')}
      >
        <div className="space-y-2">
          <label className="filter-checkbox">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
              className="w-4 h-4"
            />
            <span>All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="filter-checkbox">
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
                className="w-4 h-4"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price Range"
        expanded={expandedFilters.price}
        onToggle={() => toggleFilter('price')}
      >
        <div className="space-y-2">
          {PRICE_RANGES.map(({ label, min, max }) => (
            <label key={label} className="filter-checkbox">
              <input
                type="radio"
                name="price"
                checked={priceRange[0] === min && priceRange[1] === max}
                onChange={() => onPriceRangeChange([min, max])}
                className="w-4 h-4"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Sort"
        expanded={expandedFilters.sort}
        onToggle={() => toggleFilter('sort')}
      >
        <div className="space-y-2">
          {SORT_OPTIONS.map(option => (
            <label key={option.value} className="filter-checkbox">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sorting === option.value}
                onChange={() => onSortingChange(option.value)}
                className="w-4 h-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="filter-clear-btn"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop filters panel */}
      <div className="filters-sidebar">
        {content}
      </div>

      {/* Mobile filters modal */}
      {isOpen && onClose && (
        <div className="filters-mobile">
          <div className="filters-mobile-header">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="filters-mobile-content">{content}</div>
        </div>
      )}
    </>
  )
}
