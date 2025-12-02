import classes from './MeetupDetail.module.css'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import MeetupContext from '../../context/MeetupContext'
import RatingDisplay from './RatingDisplay'
import ReviewsSection from './ReviewsSection'
import RSVPSection from './RSVPSection'
import ShareButtons from './ShareButtons'
import CalendarExport from './CalendarExport'

function MeetupDetail(props) {
    const router = useRouter()
    const meetupCtx = useContext(MeetupContext)
    const [isDeleting, setIsDeleting] = useState(false)
    const isFavorite = meetupCtx.isFavorite(props.meetingId)

    // Get the full meetup data from context to access new fields
    const fullMeetup = meetupCtx.meetings.find(m => m.meetingId === props.meetingId) || {
        meetingId: props.meetingId,
        title: props.title,
        image: props.image,
        address: props.address,
        description: props.description,
        ratings: [],
        reviews: [],
        rsvps: []
    }

    async function deleteHandler() {
        if (confirm(`Are you sure you want to delete "${props.title}"?`)) {
            setIsDeleting(true)
            const result = await meetupCtx.deleteMeeting(props.meetingId)
            if (result.success) {
                router.push('/')
            } else {
                alert('Failed to delete meetup. Please try again.')
                setIsDeleting(false)
            }
        }
    }

    function toggleFavoriteHandler() {
        meetupCtx.toggleFavorite(props.meetingId)
    }

    return (
        <section className={classes.detail}>
            <img src={props.image} alt={props.title} />
            <div className={classes.content}>
                <h1>{props.title}</h1>
                <address>{props.address}</address>
                <p>{props.description}</p>
            </div>
            <div className={classes.actions}>
                <button onClick={() => router.push('/')} className={classes.backButton}>
                    ← Back to All Meetups
                </button>
                <button 
                    onClick={toggleFavoriteHandler} 
                    className={classes.favoriteButton}
                >
                    {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
                <button 
                    onClick={deleteHandler}
                    disabled={isDeleting}
                    className={classes.deleteButton}
                >
                    {isDeleting ? 'Deleting...' : '🗑️ Delete Meetup'}
                </button>
            </div>

            {/* Enhanced Features */}
            <div className={classes.enhancedFeatures}>
                <RatingDisplay 
                    meetingId={props.meetingId}
                    ratings={fullMeetup.ratings || []}
                    onAddRating={meetupCtx.addRating}
                />

                <RSVPSection
                    meetingId={props.meetingId}
                    rsvps={fullMeetup.rsvps || []}
                    onAddRSVP={meetupCtx.addRSVP}
                    onRemoveRSVP={meetupCtx.removeRSVP}
                />

                <ShareButtons meetup={fullMeetup} />

                <CalendarExport meetup={fullMeetup} />

                <ReviewsSection
                    meetingId={props.meetingId}
                    reviews={fullMeetup.reviews || []}
                    onAddReview={meetupCtx.addReview}
                />
            </div>
        </section>
    )
}

export default MeetupDetail