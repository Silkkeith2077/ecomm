'use client'

import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Review {
  id: number
  author: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  date: string
}

interface ProductReviewsProps {
  productId: number
  reviews?: Review[]
  avgRating?: number
  totalReviews?: number
}

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClass = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size]

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-surface-300'
          )}
        />
      ))}
    </div>
  )
}

const RatingBar = ({ rating, count, total }: { rating: number; count: number; total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium w-6">{rating}★</span>
      <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-surface-500 w-8 text-right">{count}</span>
    </div>
  )
}

export function ProductReviews({
  productId,
  reviews = [],
  avgRating = 4.5,
  totalReviews = 128,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  })

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
    return reviews.filter(r => r.rating === rating).length
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Review submitted:', formData)
    setFormData({ rating: 5, title: '', content: '' })
    setShowForm(false)
  }

  return (
    <div className="reviews-container">
      {/* Summary Section */}
      <div className="reviews-summary">
        <div className="flex items-start gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-surface-900">{avgRating.toFixed(1)}</div>
            <StarRating rating={Math.round(avgRating)} size="lg" />
            <p className="text-sm text-surface-500 mt-1">{totalReviews} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating, idx) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={ratingCounts[idx]}
                total={totalReviews}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="reviews-submit-btn mt-6"
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="reviews-form">
          <h3 className="font-semibold mb-4">Share Your Experience</h3>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="rating-star"
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-surface-300 hover:text-yellow-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              className="input w-full"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Tell us what you think about this product..."
              className="min-h-32"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit">Submit Review</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-center text-surface-500 py-8">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-surface-900">{review.author}</p>
                      {review.verified && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">{review.date}</p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                <h4 className="font-medium text-surface-900 mb-1">{review.title}</h4>
                <p className="text-sm text-surface-600 mb-3">{review.content}</p>

                <button className="text-sm text-surface-500 hover:text-brand-600 flex items-center gap-1.5 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { StarRating }
