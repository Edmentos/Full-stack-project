// our-domain.com/favorites
import MeetupList from '../../components/meetups/MeetupList'
import { useContext } from "react";
import MeetupContext from "../../context/MeetupContext"
import classes from '../../styles/Home.module.css'

function FavoritesPage() {
    const meetupCtx = useContext(MeetupContext)

    // Get meetups that are in favorites
    const favoriteMeetups = meetupCtx.meetings.filter(meetup => 
        meetupCtx.favorites.includes(meetup.meetingId)
    )

    if (!meetupCtx.dataLoaded) {
        return (
            <div className={classes.loading}>
                <div className={classes.spinner}></div>
                <p>Loading favorites...</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ padding: '1rem 2rem' }}>
                <h1>Your Favorite Meetups</h1>
                <p>You have {favoriteMeetups.length} favorite meetup{favoriteMeetups.length !== 1 ? 's' : ''}</p>
            </div>

            {favoriteMeetups.length > 0 ? (
                <MeetupList meetups={favoriteMeetups} />
            ) : (
                <div className={classes.noResults}>
                    <h2>No favorites yet</h2>
                    <p>Start adding meetups to your favorites by clicking the heart icon!</p>
                </div>
            )}
        </div>
    )
}

export default FavoritesPage
