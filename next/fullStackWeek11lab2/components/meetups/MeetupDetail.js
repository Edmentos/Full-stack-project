import classes from './MeetupDetail.module.css'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import MeetupContext from '../../context/MeetupContext'
import RatingDisplay from './RatingDisplay'
import ReviewsSection from './ReviewsSection'
import RSVPSection from './RSVPSection'
import ShareButtons from './ShareButtons'
import CalendarExport from './CalendarExport'
import Card from '../ui/Card'

function MeetupDetail(props) {
    const router = useRouter()
    const meetupCtx = useContext(MeetupContext)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const isFavorite = meetupCtx.isFavorite(props.meetingId)

    // Get the full meetup data from context to access new fields
    const fullMeetup = meetupCtx.meetings.find(m => m.meetingId === props.meetingId) || {
        meetingId: props.meetingId,
        title: props.title,
        image: props.image,
        address: props.address,
        description: props.description,
        date: props.date,
        time: props.time,
        ratings: [],
        reviews: [],
        rsvps: []
    }

    // Edit form state
    const [editForm, setEditForm] = useState({
        title: fullMeetup.title,
        image: fullMeetup.image,
        address: fullMeetup.address,
        description: fullMeetup.description,
        date: fullMeetup.date || '',
        time: fullMeetup.time || ''
    })

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

    function handleEditClick() {
        setIsEditing(true)
    }

    function handleCancelEdit() {
        // Reset form to original values
        setEditForm({
            title: fullMeetup.title,
            image: fullMeetup.image,
            address: fullMeetup.address,
            description: fullMeetup.description,
            date: fullMeetup.date || '',
            time: fullMeetup.time || ''
        })
        setIsEditing(false)
    }

    async function handleSaveEdit(e) {
        e.preventDefault()
        setIsUpdating(true)

        const result = await meetupCtx.updateMeeting(props.meetingId, editForm)
        
        if (result.success) {
            setIsEditing(false)
            // Refresh the page data
            await meetupCtx.getAllMeetings()
        } else {
            alert('Failed to update meetup. Please try again.')
        }
        
        setIsUpdating(false)
    }

    function handleInputChange(e) {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Format date and time for display
    function formatDateTime() {
        if (!fullMeetup.date) return null;
        
        const dateObj = new Date(fullMeetup.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        
        return (
            <div className={classes.datetime}>
                <strong>📅 {formattedDate}</strong>
                {fullMeetup.time && <strong> • 🕒 {fullMeetup.time}</strong>}
            </div>
        );
    }

    return (
        <section className={classes.detail}>
            {!isEditing ? (
                // View Mode
                <>
                    <img src={props.image} alt={props.title} />
                    <div className={classes.content}>
                        <h1>{props.title}</h1>
                        {formatDateTime()}
                        <address>{props.address}</address>
                        <p>{props.description}</p>
                    </div>
                    <div className={classes.actions}>
                        <button onClick={() => router.push('/')} className={classes.backButton}>
                            ← Back to All Meetups
                        </button>
                        <button 
                            onClick={handleEditClick} 
                            className={classes.editButton}
                        >
                            ✏️ Edit Meetup
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
                </>
            ) : (
                // Edit Mode
                <Card>
                    <form onSubmit={handleSaveEdit} className={classes.editForm}>
                        <h2>Edit Meetup</h2>
                        
                        <div className={classes.formControl}>
                            <label htmlFor='title'>Meetup Title</label>
                            <input 
                                type='text' 
                                required 
                                id='title'
                                name='title'
                                value={editForm.title}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className={classes.formControl}>
                            <label htmlFor='image'>Meetup Image URL</label>
                            <input 
                                type='url' 
                                required 
                                id='image'
                                name='image'
                                value={editForm.image}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                                placeholder='https://example.com/image.jpg'
                            />
                        </div>

                        <div className={classes.formControl}>
                            <label htmlFor='address'>Address</label>
                            <input 
                                type='text' 
                                required 
                                id='address'
                                name='address'
                                value={editForm.address}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className={classes.formControl}>
                            <label htmlFor='date'>Date</label>
                            <input 
                                type='date' 
                                id='date'
                                name='date'
                                value={editForm.date}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className={classes.formControl}>
                            <label htmlFor='time'>Time</label>
                            <input 
                                type='time' 
                                id='time'
                                name='time'
                                value={editForm.time}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                            />
                        </div>

                        <div className={classes.formControl}>
                            <label htmlFor='description'>Description</label>
                            <textarea
                                id='description'
                                name='description'
                                required
                                rows='5'
                                value={editForm.description}
                                onChange={handleInputChange}
                                disabled={isUpdating}
                            ></textarea>
                        </div>

                        <div className={classes.formActions}>
                            <button 
                                type="submit" 
                                disabled={isUpdating}
                                className={classes.saveButton}
                            >
                                {isUpdating ? 'Saving...' : '💾 Save Changes'}
                            </button>
                            <button 
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className={classes.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Enhanced Features - Only show when not editing */}
            {!isEditing && (
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
            )}
        </section>
    )
}

export default MeetupDetail