'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlistStore } from '@/store/wishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WishlistButton({ productId, className, size = 'md' }: WishlistButtonProps) {
  const isInWishlist = useWishlistStore(state => state.isInWishlist(productId))
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist)

  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  }[size]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleWishlist(productId)}
      className={cn('wishlist-btn', isInWishlist && 'wishlist-btn-active', className, sizeClass)}
      aria-label="Add to wishlist"
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all',
          isInWishlist && 'fill-red-500 text-red-500'
        )}
      />
    </Button>
  )
}
