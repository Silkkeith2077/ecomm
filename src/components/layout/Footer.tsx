import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/shop/products' },
    { label: 'New Arrivals', href: '/shop/products?ordering=-created_at' },
    { label: 'Sale', href: '/shop/products?sale=true' },
  ],
  Account: [
    { label: 'Profile', href: '/account/profile' },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Addresses', href: '/account/addresses' },
  ],
  Help: [
    { label: 'FAQ', href: '/help/faq' },
    { label: 'Shipping Info', href: '/help/shipping' },
    { label: 'Returns', href: '/help/returns' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-surface-950 text-surface-400 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl font-semibold text-white">ShopForge</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-surface-500">
              Premium products with a seamless shopping experience. Quality you can trust, delivered fast.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-surface-500 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} ShopForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-surface-600">
            <Link href="/privacy" className="hover:text-surface-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-surface-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
