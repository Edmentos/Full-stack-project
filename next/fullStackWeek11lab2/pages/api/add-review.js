// /api/add-review
// Handles adding a review to a meetup

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('http://localhost:8000/addReview', {
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
    console.error('Error adding review:', error)
    res.status(500).json({ response: 'fail', error: error.message })
  }
}

export default handler;
