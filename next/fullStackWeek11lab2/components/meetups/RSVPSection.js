import { useState } from 'react'
import classes from './RSVPSection.module.css'

function RSVPSection({ meetingId, rsvps = [], onAddRSVP, onRemoveRSVP }) {
    const [showForm, setShowForm] = useState(false)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userHasRSVPd, setUserHasRSVPd] = useState(false)
    const [currentUserId, setCurrentUserId] = useState(null)

    async function handleRSVP(e) {
        e.preventDefault()
        if (!userName.trim() || !email.trim()) return

        setIsSubmitting(true)
        const userId = `user_${Date.now()}`
        const rsvpData = {
            userId: userId,
            userName: userName.trim(),
            email: email.trim(),
            timestamp: new Date().toISOString()
        }

        const success = await onAddRSVP(meetingId, rsvpData)
        
        if (success) {
            setUserName('')
            setEmail('')
            setShowForm(false)
            setUserHasRSVPd(true)
            setCurrentUserId(userId)
        }
        
        setIsSubmitting(false)
    }

    async function handleCancelRSVP() {
        if (!currentUserId) return
        
        setIsSubmitting(true)
        const success = await onRemoveRSVP(meetingId, currentUserId)
        
        if (success) {
            setUserHasRSVPd(false)
            setCurrentUserId(null)
        }
        
        setIsSubmitting(false)
    }

    return (
        <section className={classes.rsvpSection}>
            <div className={classes.header}>
                <h2>👥 RSVPs ({rsvps.length})</h2>
                {!userHasRSVPd ? (
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={classes.rsvpButton}
                    >
                        {showForm ? 'Cancel' : '✓ RSVP to this Meetup'}
                    </button>
                ) : (
                    <button 
                        onClick={handleCancelRSVP}
                        className={classes.cancelButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Canceling...' : '✗ Cancel RSVP'}
                    </button>
                )}
            </div>

            {showForm && !userHasRSVPd && (
                <form onSubmit={handleRSVP} className={classes.rsvpForm}>
                    <p className={classes.formDescription}>
                        Sign up to attend this meetup. You'll receive updates and reminders.
                    </p>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        maxLength={50}
                        disabled={isSubmitting}
                    />
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !userName.trim() || !email.trim()}
                    >
                        {isSubmitting ? 'Confirming...' : 'Confirm RSVP'}
                    </button>
                </form>
            )}

            {userHasRSVPd && (
                <div className={classes.rsvpConfirmation}>
                    <p>✓ You're attending this meetup!</p>
                </div>
            )}

            <div className={classes.attendeesList}>
                <h3>Attendees:</h3>
                {rsvps.length === 0 ? (
                    <p className={classes.noAttendees}>
                        No RSVPs yet. Be the first to sign up!
                    </p>
                ) : (
                    <div className={classes.attendeesGrid}>
                        {rsvps.map((rsvp, index) => (
                            <div key={index} className={classes.attendeeCard}>
                                <div className={classes.attendeeAvatar}>
                                    {rsvp.userName?.charAt(0).toUpperCase()}
                                </div>
                                <div className={classes.attendeeInfo}>
                                    <strong>{rsvp.userName}</strong>
                                    <span className={classes.attendeeEmail}>{rsvp.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default RSVPSection
