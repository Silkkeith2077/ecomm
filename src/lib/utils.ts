// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Converts an absolute backend media URL to a proxied path so next/image
 * can serve it through localhost:3000/media/... instead of localhost:8000/media/...
 * In production, returns the URL unchanged.
 */
export function mediaUrl(url: string | null | undefined): string | null {
    if (!url) return null
    if (process.env.NODE_ENV === 'development') {
        try {
            const parsed = new URL(url)
            if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
                return parsed.pathname + parsed.search
            }
        } catch {}
    }
    return url
}

export function formatPrice(value: string | number, currency = 'USD'): string {
    const n = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(iso))
}

export function formatRelativeDate(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins  = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days  = Math.floor(diff / 86_400_000)
    if (mins < 1)   return 'just now'
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7)   return `${days}d ago`
    return formatDate(iso)
}

export function slugify(s: string): string {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
    pending:    'Pending',
    confirmed:  'Confirmed',
    processing: 'Processing',
    shipped:    'Shipped',
    delivered:  'Delivered',
    cancelled:  'Cancelled',
    refunded:   'Refunded',
}

export const ORDER_STATUS_COLOR: Record<string, string> = {
    pending:    'bg-amber-50 text-amber-700 ring-amber-200',
    confirmed:  'bg-blue-50 text-blue-700 ring-blue-200',
    processing: 'bg-violet-50 text-violet-700 ring-violet-200',
    shipped:    'bg-sky-50 text-sky-700 ring-sky-200',
    delivered:  'bg-brand-50 text-brand-700 ring-brand-200',
    cancelled:  'bg-red-50 text-red-700 ring-red-200',
    refunded:   'bg-surface-100 text-surface-600 ring-surface-200',
}

export const PAYMENT_STATUS_COLOR: Record<string, string> = {
    pending:            'bg-amber-50 text-amber-700',
    paid:               'bg-brand-50 text-brand-700',
    failed:             'bg-red-50 text-red-700',
    refunded:           'bg-surface-100 text-surface-600',
    partially_refunded: 'bg-orange-50 text-orange-700',
}

export function getVariantLabel(attributes: { name: string; value: string }[]): string {
    return attributes.map(a => a.value).join(' / ')
}

export function truncate(str: string, n: number): string {
    return str.length > n ? str.slice(0, n - 1) + '…' : str
}