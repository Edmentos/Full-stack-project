import MeetupDetail from '../../components/meetups/MeetupDetail'
import { useRouter } from 'next/router'
import MeetupContext from "../../context/MeetupContext"
import { useContext } from 'react'

export default function MeetupDetailPage() {
    const meetupCtx = useContext(MeetupContext)
    const router = useRouter();

    // Find the meetup by ID
    const meetup = meetupCtx.meetings.find(m => 
        m.meetingId?.trim() === router.query.meetupId?.trim()
    )

    if (!meetupCtx.dataLoaded) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    }

    if (!meetup) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Meetup not found</h2>
                <button onClick={() => router.push('/')}>Back to Home</button>
            </div>
        )
    }

    return (
        <MeetupDetail 
            meetingId={meetup.meetingId}
            image={meetup.image} 
            title={meetup.title} 
            address={meetup.address}
            description={meetup.description} 
        />
    )
}
