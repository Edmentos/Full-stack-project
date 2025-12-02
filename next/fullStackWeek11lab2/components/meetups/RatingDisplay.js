import { useState } from 'react'
import classes from './RatingDisplay.module.css'

function RatingDisplay({ meetingId, ratings = [], onAddRating }) {
    const [userRating, setUserRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calculate average rating
    const averageRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0

    async function handleRatingClick(rating) {
        setIsSubmitting(true)
        const ratingData = {
            userId: `user_${Date.now()}`, // Simple user ID generation
            rating: rating,
            timestamp: new Date().toISOString()
        }

        const success = await onAddRating(meetingId, ratingData)
        
        if (success) {
            setUserRating(rating)
        }
        
        setIsSubmitting(false)
    }

    function renderStars(rating, interactive = false) {
        return (
            <div className={classes.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`${classes.star} ${
                            star <= (interactive ? (hoveredRating || userRating) : rating)
                                ? classes.filled
                                : ''
                        } ${interactive ? classes.interactive : ''}`}
                        onClick={interactive ? () => handleRatingClick(star) : undefined}
                        onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
                    >
                        ★
                    </span>
                ))}
            </div>
        )
    }

    return (
        <section className={classes.ratingSection}>
            <h2>⭐ Ratings</h2>
            
            <div className={classes.ratingDisplay}>
                <div className={classes.averageRating}>
                    <div className={classes.ratingNumber}>{averageRating}</div>
                    {renderStars(parseFloat(averageRating))}
                    <div className={classes.ratingCount}>
                        Based on {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
                    </div>
                </div>

                <div className={classes.ratingBreakdown}>
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratings.filter((r) => r.rating === star).length
                        const percentage = ratings.length > 0 
                            ? (count / ratings.length) * 100 
                            : 0
                        return (
                            <div key={star} className={classes.ratingRow}>
                                <span className={classes.starLabel}>{star}★</span>
                                <div className={classes.progressBar}>
                                    <div 
                                        className={classes.progressFill}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className={classes.countLabel}>{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className={classes.rateThisMeetup}>
                <h3>Rate this meetup:</h3>
                {isSubmitting ? (
                    <p className={classes.submitting}>Submitting rating...</p>
                ) : userRating > 0 ? (
                    <div className={classes.thankYou}>
                        <p>✓ Thank you for rating this meetup!</p>
                        {renderStars(userRating)}
                    </div>
                ) : (
                    <div>
                        {renderStars(0, true)}
                        <p className={classes.hint}>Click to rate</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default RatingDisplay
