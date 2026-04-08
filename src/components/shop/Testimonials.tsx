'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: number
  author: string
  role: string
  content: string
  rating: number
  avatar?: string
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
  title?: string
  description?: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author: 'Sarah Mitchell',
    role: 'Verified Customer',
    content: 'Exceptional quality and fast shipping! The products exceeded my expectations and the customer service was incredibly helpful.',
    rating: 5,
  },
  {
    id: 2,
    author: 'James Chen',
    role: 'Regular Customer',
    content: 'Best online shopping experience I\'ve had. Great selection, competitive prices, and the checkout process is super smooth.',
    rating: 5,
  },
  {
    id: 3,
    author: 'Emma Rodriguez',
    role: 'Verified Customer',
    content: 'Love the attention to detail on everything. Every purchase has been perfect, and the returns policy is hassle-free.',
    rating: 5,
  },
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        className={cn(
          'h-4 w-4',
          star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-surface-300'
        )}
      />
    ))}
  </div>
)

export function Testimonials({
  testimonials = DEFAULT_TESTIMONIALS,
  title = 'Trusted by Customers',
  description = 'See what our happy customers are saying about us',
}: TestimonialsProps) {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <h2 className="section-heading">{title}</h2>
          <p className="text-surface-500 mt-2 text-lg max-w-2xl">{description}</p>
        </div>

        {/* Stats */}
        <div className="testimonials-stats">
          <div className="testimonials-stat">
            <div className="text-3xl font-bold text-brand-600">50K+</div>
            <p className="text-sm text-surface-600">Happy Customers</p>
          </div>
          <div className="testimonials-stat">
            <div className="text-3xl font-bold text-brand-600">4.9★</div>
            <p className="text-sm text-surface-600">Average Rating</p>
          </div>
          <div className="testimonials-stat">
            <div className="text-3xl font-bold text-brand-600">98%</div>
            <p className="text-sm text-surface-600">Recommend Us</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>
              
              <p className="testimonial-text">{testimonial.content}</p>

              <div className="testimonial-author">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="testimonial-avatar"
                  />
                ) : (
                  <div className="testimonial-avatar-fallback">
                    {testimonial.author[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-surface-900">{testimonial.author}</p>
                  <p className="text-xs text-surface-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="testimonials-badges">
          <div className="trust-badge">
            <span className="text-2xl">✓</span>
            <div>
              <p className="text-sm font-medium">100% Secure</p>
              <p className="text-xs text-surface-500">SSL Encrypted</p>
            </div>
          </div>
          <div className="trust-badge">
            <span className="text-2xl">★</span>
            <div>
              <p className="text-sm font-medium">Money Back</p>
              <p className="text-xs text-surface-500">30-Day Guarantee</p>
            </div>
          </div>
          <div className="trust-badge">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-surface-500">On orders over $75</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
