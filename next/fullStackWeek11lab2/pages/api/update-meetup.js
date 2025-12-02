// /api/update-meetup
// Handles updating an existing meetup in the database

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('http://localhost:8000/updateMeeting', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Backend service failed')
    }

    const data = await response.json();
    res.status(200).json(data)
  } catch (error) {
    console.error('Error updating meetup:', error)
    res.status(500).json({ response: 'fail', error: error.message })
  }
}

export default handler;
