// app/layout.tsx
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CategoryGrid } from '@/components/shop/CategoryGrid'

const PERKS = [
  { icon: Truck,       title: 'Free Shipping',    body: 'On all orders over $75.' },
  { icon: RotateCcw,   title: 'Easy Returns',     body: '30-day hassle-free policy.' },
  { icon: ShieldCheck, title: 'Secure Checkout',  body: 'SSL encrypted payments.' },
  { icon: Headphones,  title: '24/7 Support',     body: 'We\'re always here for you.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-surface-950 via-surface-900 to-brand-950 text-white">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300 mb-8">
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                New arrivals every week
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-tight tracking-tight">
                Shop with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
                  confidence
                </span>
              </h1>
              <p className="mt-6 text-lg text-surface-400 leading-relaxed max-w-xl">
                Discover premium products across electronics, fashion, home and more.
                Curated for quality, delivered with care.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop/products" className="btn-primary btn-lg">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/shop" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg border border-white/20">
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="border-b border-surface-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {PERKS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{title}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest mb-2">Explore</p>
              <h2 className="section-heading">Shop by Category</h2>
            </div>
            <Link href="/shop" className="btn-ghost text-brand-700 gap-1.5 hidden sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryGrid />
        </section>

        {/* Featured Products */}
        <section className="bg-surface-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest mb-2">Handpicked</p>
                <h2 className="section-heading">Featured Products</h2>
              </div>
              <Link href="/shop/products" className="btn-ghost text-brand-700 gap-1.5 hidden sm:flex">
                See all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <FeaturedProducts />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 p-10 md:p-16 text-white overflow-hidden relative">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/5" />
            <div className="relative max-w-lg">
              <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-3">Limited time</p>
              <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight">
                Use code <span className="font-bold italic">WELCOME10</span> for 10% off
              </h2>
              <p className="mt-4 text-brand-200">Your first order, automatically applied at checkout.</p>
              <Link href="/shop/products" className="mt-8 inline-flex btn bg-white text-brand-700 hover:bg-brand-50 btn-lg shadow-lg">
                Start Shopping <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
