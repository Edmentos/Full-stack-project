// /api/get-meetings
// Handles fetching all meetups from the database

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('http://localhost:8000/readMeeting', {
      method: 'POST',
      body: JSON.stringify({ cmd: 'all' }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Backend service failed')
    }

    const data = await response.json();
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching meetups:', error)
    res.status(500).json({ meetings: [], error: error.message })
  }
}

export default handler;
