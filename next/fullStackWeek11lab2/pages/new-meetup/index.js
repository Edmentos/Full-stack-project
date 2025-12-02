// our-domain.com/new-meetup
import NewMeetupForm from '../../components/meetups/NewMeetupForm'
import { useRouter } from 'next/router';
import MeetupContext from "../../context/MeetupContext"
import { useContext, useState } from 'react'

function NewMeetupPage() {
    const router = useRouter()
    const meetupCtx = useContext(MeetupContext)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function addMeetupHandler(enteredMeetupData) {
        setIsSubmitting(true)
        const result = await meetupCtx.addMeeting(enteredMeetupData)
        setIsSubmitting(false)
        
        if (result.success) {
            router.push('/');
        } else {
            // Error is handled by context and shown in notification
            alert('Failed to create meetup. Please try again.')
        }
    }

    return <NewMeetupForm onAddMeetup={addMeetupHandler} isSubmitting={isSubmitting} />
}

export default NewMeetupPage