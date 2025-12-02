import { useContext, useEffect } from 'react'
import MeetupContext from '../../context/MeetupContext'
import classes from './Notification.module.css'

/**
 * Notification component for displaying success/error/info messages
 * Automatically dismisses after 3 seconds
 */
function Notification() {
    const meetupCtx = useContext(MeetupContext)

    useEffect(() => {
        if (meetupCtx.notification) {
            const timer = setTimeout(() => {
                meetupCtx.clearNotification()
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [meetupCtx.notification])

    if (!meetupCtx.notification) {
        return null
    }

    const { message, type } = meetupCtx.notification

    return (
        <div className={`${classes.notification} ${classes[type]}`}>
            <span>{message}</span>
            <button 
                onClick={meetupCtx.clearNotification}
                className={classes.closeButton}
            >
                ✕
            </button>
        </div>
    )
}

export default Notification
