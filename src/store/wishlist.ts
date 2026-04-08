import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  productId: number
  addedAt: number
}

interface WishlistState {
  items: WishlistItem[]
  toggleWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  addToWishlist: (productId: number) => void
  removeFromWishlist: (productId: number) => void
  clearWishlist: () => void
  itemCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (productId: number) => {
        const { items } = get()
        const exists = items.some(item => item.productId === productId)
        
        if (exists) {
          set({ items: items.filter(item => item.productId !== productId) })
        } else {
          set({
            items: [...items, { productId, addedAt: Date.now() }],
          })
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.some(item => item.productId === productId)
      },

      addToWishlist: (productId: number) => {
        const { items } = get()
        if (!items.some(item => item.productId === productId)) {
          set({
            items: [...items, { productId, addedAt: Date.now() }],
          })
        }
      },

      removeFromWishlist: (productId: number) => {
        set({
          items: get().items.filter(item => item.productId !== productId),
        })
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      itemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'wishlist-store',
    }
  )
)
