import classes from './CalendarExport.module.css'

function CalendarExport({ meetup }) {
    // Format date for calendar (default to 7 days from now if no date)
    function getEventDate() {
        if (meetup.eventDate) {
            return new Date(meetup.eventDate)
        }
        // Default to 7 days from now
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 7)
        futureDate.setHours(18, 0, 0, 0) // 6 PM
        return futureDate
    }

    function formatICSDate(date) {
        // Format: YYYYMMDDTHHmmssZ
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    function generateGoogleCalendarUrl() {
        const eventDate = getEventDate()
        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: meetup.title,
            dates: `${formatICSDate(eventDate)}/${formatICSDate(endDate)}`,
            details: meetup.description,
            location: meetup.address
        })

        return `https://calendar.google.com/calendar/render?${params.toString()}`
    }

    function generateICSFile() {
        const eventDate = getEventDate()
        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
        
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Meetup Hub//EN
BEGIN:VEVENT
UID:${meetup.meetingId}@meetuphub.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(eventDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${meetup.title}
DESCRIPTION:${meetup.description.replace(/\n/g, '\\n')}
LOCATION:${meetup.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${meetup.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function handleGoogleCalendar() {
        window.open(generateGoogleCalendarUrl(), '_blank')
    }

    function handleOutlookCalendar() {
        const eventDate = getEventDate()
        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)

        const params = new URLSearchParams({
            path: '/calendar/action/compose',
            rru: 'addevent',
            subject: meetup.title,
            startdt: eventDate.toISOString(),
            enddt: endDate.toISOString(),
            body: meetup.description,
            location: meetup.address
        })

        window.open(`https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`, '_blank')
    }

    return (
        <section className={classes.calendarSection}>
            <h2>📅 Add to Calendar</h2>
            <div className={classes.calendarButtons}>
                <button 
                    onClick={handleGoogleCalendar}
                    className={`${classes.calendarButton} ${classes.google}`}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Google Calendar
                </button>

                <button 
                    onClick={handleOutlookCalendar}
                    className={`${classes.calendarButton} ${classes.outlook}`}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M7 2v20l6 2V0zm8.5 7c1.93 0 3.5 1.57 3.5 3.5S17.43 16 15.5 16 12 14.43 12 12.5 13.57 9 15.5 9zM13 12.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5S16.88 10 15.5 10 13 11.12 13 12.5z"/>
                    </svg>
                    Outlook
                </button>

                <button 
                    onClick={generateICSFile}
                    className={`${classes.calendarButton} ${classes.ical}`}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    iCal / Other
                </button>
            </div>
            <p className={classes.eventInfo}>
                📍 {meetup.address}<br/>
                🕐 {getEventDate().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>
        </section>
    )
}

export default CalendarExport
