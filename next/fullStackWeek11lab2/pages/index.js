import MeetupList from '../components/meetups/MeetupList'
import { useContext } from "react";
import MeetupContext from "../context/MeetupContext"
import classes from '../styles/Home.module.css'

function HomePage() {
    const meetupCtx = useContext(MeetupContext)

    // Get filtered meetups based on search/filter criteria
    const filteredMeetings = meetupCtx.getFilteredMeetings()
    const stats = meetupCtx.getStatistics()

    if (!meetupCtx.dataLoaded) {
        return (
            <div className={classes.loading}>
                <div className={classes.spinner}></div>
                <p>Loading meetups from database...</p>
            </div>
        )
    }

    if (meetupCtx.error) {
        return (
            <div className={classes.error}>
                <h2>⚠️ Error</h2>
                <p>{meetupCtx.error}</p>
                <button onClick={() => meetupCtx.getAllMeetings()}>Retry</button>
            </div>
        )
    }

    return (
        <div>
            {/* Statistics Dashboard */}
            <div className={classes.statsContainer}>
                <div className={classes.statCard}>
                    <h3>{stats.totalMeetups}</h3>
                    <p>Total Meetups</p>
                </div>
                <div className={classes.statCard}>
                    <h3>{stats.totalFavorites}</h3>
                    <p>Favorites</p>
                </div>
                <div className={classes.statCard}>
                    <h3>{stats.uniqueAddresses}</h3>
                    <p>Locations</p>
                </div>
                {stats.mostPopularAddress && (
                    <div className={classes.statCard}>
                        <h3>{stats.mostPopularAddress.count}</h3>
                        <p>Most Popular: {stats.mostPopularAddress.address}</p>
                    </div>
                )}
            </div>

            {/* Search/Filter Results Info */}
            {(meetupCtx.searchQuery || meetupCtx.filterAddress) && (
                <div className={classes.filterInfo}>
                    <p>
                        Showing {filteredMeetings.length} of {meetupCtx.meetings.length} meetups
                        {meetupCtx.searchQuery && ` matching "${meetupCtx.searchQuery}"`}
                        {meetupCtx.filterAddress && ` in "${meetupCtx.filterAddress}"`}
                    </p>
                </div>
            )}

            {/* Meetup List */}
            {filteredMeetings.length > 0 ? (
                <MeetupList meetups={filteredMeetings} />
            ) : (
                <div className={classes.noResults}>
                    <h2>No meetups found</h2>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    )
}

export default HomePage;