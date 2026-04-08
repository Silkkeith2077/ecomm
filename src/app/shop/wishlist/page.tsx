'use client'

import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { useProducts } from '@/hooks/useApi'
import { ProductCard } from '@/components/shop/ProductCard'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  const wishlistItems = useWishlistStore(state => state.items)
  const clearWishlist = useWishlistStore(state => state.clearWishlist)
  
  // Fetch products for wishlist items
  const productIds = wishlistItems.map(item => item.productId)

  // Note: In a real app, you'd query the API with these IDs
  // For now, we'll show the structure

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-surface-400" />
          </div>
          <h1 className="section-heading">Your Wishlist is Empty</h1>
          <p className="text-surface-500 mt-2 max-w-sm">
            Start adding products to your wishlist to save them for later
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop/products" className="flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading">My Wishlist</h1>
          <p className="text-surface-500 mt-1">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear Wishlist
        </Button>
      </div>

      {/* Wishlist items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* This would normally iterate through fetched products */}
        {/* For now, showing placeholder structure */}
        <div className="text-center py-12 col-span-full text-surface-500">
          <p>Wishlist items will be displayed here</p>
          <p className="text-sm mt-2">Integrate with your backend to load product details</p>
        </div>
      </div>
    </div>
  )
}
