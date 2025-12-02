import { useEffect, useState } from 'react'
import classes from './ConnectionStatus.module.css'

/**
 * Visual indicator showing backend and database connection status
 * Useful for debugging and demonstrations
 */
function ConnectionStatus() {
    const [status, setStatus] = useState({
        backend: 'checking',
        database: 'checking',
        message: 'Checking connections...'
    })

    useEffect(() => {
        checkConnection()
    }, [])

    async function checkConnection() {
        try {
            // Test the API route which tests the backend
            const response = await fetch('/api/get-meetings', {
                method: 'POST',
                body: JSON.stringify({ meetups: 'all' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                if (data.meetings) {
                    setStatus({
                        backend: 'connected',
                        database: 'connected',
                        message: `✅ All systems operational! Found ${data.meetings.length} meetups in database.`
                    })
                } else {
                    setStatus({
                        backend: 'connected',
                        database: 'error',
                        message: '⚠️ Backend connected but no data from database'
                    })
                }
            } else {
                setStatus({
                    backend: 'error',
                    database: 'unknown',
                    message: '❌ Backend not responding. Make sure backend server is running on port 8000.'
                })
            }
        } catch (error) {
            setStatus({
                backend: 'error',
                database: 'unknown',
                message: '❌ Connection failed. Backend server may not be running.'
            })
        }
    }

    const statusClass = status.backend === 'connected' ? classes.success : 
                       status.backend === 'checking' ? classes.checking : classes.error

    return (
        <div className={`${classes.status} ${statusClass}`}>
            <div className={classes.indicator}>
                {status.backend === 'connected' && '🟢'}
                {status.backend === 'checking' && '🟡'}
                {status.backend === 'error' && '🔴'}
            </div>
            <span className={classes.message}>{status.message}</span>
            {status.backend !== 'connected' && (
                <button onClick={checkConnection} className={classes.retryBtn}>
                    Retry
                </button>
            )}
        </div>
    )
}

export default ConnectionStatus
