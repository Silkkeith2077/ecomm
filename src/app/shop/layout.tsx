// app/(shop)/layout.tsx
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Footer } from '@/components/layout/Footer'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
