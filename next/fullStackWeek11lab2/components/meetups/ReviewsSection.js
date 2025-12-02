import { useState } from 'react'
import classes from './ReviewsSection.module.css'

function ReviewsSection({ meetingId, reviews = [], onAddReview }) {
    const [showForm, setShowForm] = useState(false)
    const [userName, setUserName] = useState('')
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (!userName.trim() || !comment.trim()) return

        setIsSubmitting(true)
        const review = {
            userId: `user_${Date.now()}`, // Simple user ID generation
            userName: userName.trim(),
            comment: comment.trim(),
            timestamp: new Date().toISOString()
        }

        const success = await onAddReview(meetingId, review)
        
        if (success) {
            setUserName('')
            setComment('')
            setShowForm(false)
        }
        
        setIsSubmitting(false)
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <section className={classes.reviewsSection}>
            <div className={classes.header}>
                <h2>💬 Reviews ({reviews.length})</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className={classes.addButton}
                >
                    {showForm ? 'Cancel' : '+ Add Review'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={classes.reviewForm}>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        maxLength={50}
                        disabled={isSubmitting}
                    />
                    <textarea
                        placeholder="Share your thoughts about this meetup..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        maxLength={500}
                        disabled={isSubmitting}
                    />
                    <div className={classes.formActions}>
                        <span className={classes.charCount}>
                            {comment.length}/500 characters
                        </span>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !userName.trim() || !comment.trim()}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </div>
                </form>
            )}

            <div className={classes.reviewsList}>
                {reviews.length === 0 ? (
                    <p className={classes.noReviews}>
                        No reviews yet. Be the first to share your thoughts!
                    </p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className={classes.reviewCard}>
                            <div className={classes.reviewHeader}>
                                <div className={classes.avatar}>
                                    {review.userName?.charAt(0).toUpperCase()}
                                </div>
                                <div className={classes.reviewMeta}>
                                    <strong>{review.userName}</strong>
                                    <span className={classes.timestamp}>
                                        {formatDate(review.timestamp)}
                                    </span>
                                </div>
                            </div>
                            <p className={classes.reviewComment}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default ReviewsSection
