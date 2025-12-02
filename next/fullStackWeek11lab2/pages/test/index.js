import { useState } from 'react'
import { useContext } from 'react'
import MeetupContext from '../../context/MeetupContext'
import classes from '../../styles/Home.module.css'

/**
 * Debug/Admin page to test all functionality
 * Shows connection status and allows testing all CRUD operations
 */
export default function TestPage() {
    const meetupCtx = useContext(MeetupContext)
    const [backendStatus, setBackendStatus] = useState(null)
    const [apiTest, setApiTest] = useState(null)

    async function testBackendDirect() {
        setBackendStatus('Testing...')
        try {
            const response = await fetch('http://localhost:8000/readMeeting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cmd: 'all' })
            })
            const data = await response.json()
            setBackendStatus(`✅ Backend Connected! Found ${data.meetings?.length || 0} meetups`)
        } catch (error) {
            setBackendStatus(`❌ Backend Error: ${error.message}`)
        }
    }

    async function testAPIRoute() {
        setApiTest('Testing...')
        try {
            const response = await fetch('/api/get-meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meetups: 'all' })
            })
            const data = await response.json()
            setApiTest(`✅ API Route Working! Found ${data.meetings?.length || 0} meetups`)
        } catch (error) {
            setApiTest(`❌ API Error: ${error.message}`)
        }
    }

    async function addTestMeetup() {
        const testMeetup = {
            meetingId: `Test-${Date.now()}`,
            title: `Test Meetup ${Date.now()}`,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
            address: 'Test Address, Dublin',
            description: 'This is a test meetup created from the test page'
        }
        
        const result = await meetupCtx.addMeeting(testMeetup)
        if (result.success) {
            alert('✅ Test meetup created successfully!')
        } else {
            alert('❌ Failed to create test meetup')
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>🔧 System Test & Debug Page</h1>
            <p>Use this page to test all connections and functionality</p>

            <div style={{ 
                background: '#f7fafc', 
                padding: '2rem', 
                borderRadius: '8px', 
                marginTop: '2rem',
                border: '2px solid #e2e8f0'
            }}>
                <h2>📊 Current System Status</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '6px' }}>
                        <strong>Data Loaded:</strong> {meetupCtx.dataLoaded ? '✅ Yes' : '❌ No'}
                    </div>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '6px' }}>
                        <strong>Loading:</strong> {meetupCtx.isLoading ? '⏳ Yes' : '✅ No'}
                    </div>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '6px' }}>
                        <strong>Total Meetups:</strong> {meetupCtx.meetings.length}
                    </div>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '6px' }}>
                        <strong>Favorites:</strong> {meetupCtx.favorites.length}
                    </div>
                </div>
                {meetupCtx.error && (
                    <div style={{ 
                        background: '#fff5f5', 
                        border: '2px solid #e53e3e', 
                        padding: '1rem', 
                        borderRadius: '6px',
                        marginTop: '1rem',
                        color: '#e53e3e'
                    }}>
                        <strong>Error:</strong> {meetupCtx.error}
                    </div>
                )}
            </div>

            <div style={{ 
                background: '#f7fafc', 
                padding: '2rem', 
                borderRadius: '8px', 
                marginTop: '2rem',
                border: '2px solid #e2e8f0'
            }}>
                <h2>🔍 Connection Tests</h2>
                
                <div style={{ marginTop: '1rem' }}>
                    <button 
                        onClick={testBackendDirect}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginRight: '1rem'
                        }}
                    >
                        Test Backend Direct (Port 8000)
                    </button>
                    {backendStatus && (
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '1rem', 
                            background: backendStatus.includes('✅') ? '#f0fff4' : '#fff5f5',
                            border: backendStatus.includes('✅') ? '2px solid #48bb78' : '2px solid #e53e3e',
                            borderRadius: '6px'
                        }}>
                            {backendStatus}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button 
                        onClick={testAPIRoute}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#48bb78',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginRight: '1rem'
                        }}
                    >
                        Test Next.js API Route
                    </button>
                    {apiTest && (
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '1rem', 
                            background: apiTest.includes('✅') ? '#f0fff4' : '#fff5f5',
                            border: apiTest.includes('✅') ? '2px solid #48bb78' : '2px solid #e53e3e',
                            borderRadius: '6px'
                        }}>
                            {apiTest}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ 
                background: '#f7fafc', 
                padding: '2rem', 
                borderRadius: '8px', 
                marginTop: '2rem',
                border: '2px solid #e2e8f0'
            }}>
                <h2>🧪 CRUD Operation Tests</h2>
                
                <button 
                    onClick={addTestMeetup}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#ed8936',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginTop: '1rem'
                    }}
                >
                    Create Test Meetup
                </button>
                
                <p style={{ marginTop: '1rem', color: '#666' }}>
                    This will create a new meetup with a timestamp. Check the home page to see it appear!
                </p>
            </div>

            <div style={{ 
                background: '#f7fafc', 
                padding: '2rem', 
                borderRadius: '8px', 
                marginTop: '2rem',
                border: '2px solid #e2e8f0'
            }}>
                <h2>📋 All Meetups</h2>
                {meetupCtx.meetings.length === 0 ? (
                    <p>No meetups found. Try creating a test meetup above!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {meetupCtx.meetings.map((meeting, index) => (
                            <li key={index} style={{ 
                                background: 'white', 
                                padding: '1rem', 
                                marginTop: '0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <strong>{meeting.title}</strong> - {meeting.address}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#ebf8ff', borderRadius: '6px' }}>
                <h3>💡 Troubleshooting Tips</h3>
                <ul>
                    <li>If backend test fails: Make sure <code>npm start</code> is running in node/microservices folder</li>
                    <li>If API test fails: Make sure <code>npm run dev</code> is running in next/fullStackWeek11lab2 folder</li>
                    <li>Both servers must be running for the app to work!</li>
                    <li>Check the connection status indicator at the bottom-left of every page</li>
                </ul>
            </div>
        </div>
    )
}
