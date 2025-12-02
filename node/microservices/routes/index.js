let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

let oldMong = new Mongoose();
oldMong.connect('mongodb://127.0.0.1:27017/db');

let meetingSchema = new Schema({
  meetingId: String,
  title: String,
  image: String,
  address: String,
  description: String,
  ratings: [{
    userId: String,
    rating: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  reviews: [{
    userId: String,
    userName: String,
    comment: String,
    timestamp: { type: Date, default: Date.now }
  }],
  rsvps: [{
    userId: String,
    userName: String,
    email: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  eventDate: Date
}, { collection: 'meetings' });

let meetings = oldMong.model('meetings', meetingSchema);

// Admin server page
router.get('/', async function (req, res, next) {
  res.render('index');
});




// Crud
router.post('/createMeeting', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    const result = await meetings.create(req.body)
    if (result) {
      retVal = { response: "success" }
    }
  } catch (err) {
    console.error('Error creating meeting:', err)
  }
  res.json(retVal);
});

// cRud   Should use GET . . . we'll fix this is Cloud next term
router.post('/readMeeting', async function (req, res, next) {
  let data;
  if (req.body.cmd == 'all') {
    data = await meetings.find().lean()
  }
  else {
    data = await meetings.find({ _id: req.body._id }).lean()
  }
  res.json({ meetings: data });
})

// crUd   Should use PUT . . . we'll fix this is Cloud next term
router.post('/updateMeeting', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    // Find by meetingId instead of _id for consistency
    const query = req.body.meetingId ? { meetingId: req.body.meetingId } : { _id: req.body._id }
    const result = await meetings.findOneAndUpdate(query, req.body, { new: true })
    if (result) {
      retVal = { response: "success" }
    }
  } catch (err) {
    console.error('Error updating meeting:', err)
  }
  res.json(retVal);
});

// cruD   Should use DELETE . . . we'll fix this is Cloud next term
router.post('/deleteMeeting', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    // Find by meetingId instead of _id for consistency
    const query = req.body.meetingId ? { meetingId: req.body.meetingId } : { _id: req.body._id }
    const result = await meetings.deleteOne(query)
    if (result.deletedCount > 0) {
      retVal = { response: "success" }
    }
  } catch (err) {
    console.error('Error deleting meeting:', err)
  }
  res.json(retVal);
});





router.post('/getMeetings', async function (req, res, next) {
  const meetings = await getMeetings();
  res.json(meetings);
});

async function getMeetings() {
  data = await meetings.find().lean();
  return { meetings: data };
}

// Add a review to a meetup
router.post('/addReview', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    const { meetingId, review } = req.body
    const result = await meetings.findOneAndUpdate(
      { meetingId: meetingId },
      { $push: { reviews: review } },
      { new: true }
    )
    if (result) {
      retVal = { response: "success", meeting: result }
    }
  } catch (err) {
    console.error('Error adding review:', err)
  }
  res.json(retVal);
});

// Add a rating to a meetup
router.post('/addRating', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    const { meetingId, rating } = req.body
    // Check if user already rated
    const meeting = await meetings.findOne({ meetingId: meetingId })
    if (meeting) {
      const existingRating = meeting.ratings?.find(r => r.userId === rating.userId)
      if (existingRating) {
        // Update existing rating
        await meetings.findOneAndUpdate(
          { meetingId: meetingId, 'ratings.userId': rating.userId },
          { $set: { 'ratings.$.rating': rating.rating, 'ratings.$.timestamp': new Date() } }
        )
      } else {
        // Add new rating
        await meetings.findOneAndUpdate(
          { meetingId: meetingId },
          { $push: { ratings: rating } }
        )
      }
      const result = await meetings.findOne({ meetingId: meetingId })
      retVal = { response: "success", meeting: result }
    }
  } catch (err) {
    console.error('Error adding rating:', err)
  }
  res.json(retVal);
});

// Add an RSVP to a meetup
router.post('/addRSVP', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    const { meetingId, rsvp } = req.body
    // Check if user already RSVP'd
    const meeting = await meetings.findOne({ meetingId: meetingId })
    if (meeting) {
      const existingRSVP = meeting.rsvps?.find(r => r.userId === rsvp.userId)
      if (!existingRSVP) {
        const result = await meetings.findOneAndUpdate(
          { meetingId: meetingId },
          { $push: { rsvps: rsvp } },
          { new: true }
        )
        retVal = { response: "success", meeting: result }
      } else {
        retVal = { response: "already_rsvpd", message: "Already RSVP'd to this meetup" }
      }
    }
  } catch (err) {
    console.error('Error adding RSVP:', err)
  }
  res.json(retVal);
});

// Remove an RSVP from a meetup
router.post('/removeRSVP', async function (req, res, next) {
  let retVal = { response: "fail" }
  try {
    const { meetingId, userId } = req.body
    const result = await meetings.findOneAndUpdate(
      { meetingId: meetingId },
      { $pull: { rsvps: { userId: userId } } },
      { new: true }
    )
    if (result) {
      retVal = { response: "success", meeting: result }
    }
  } catch (err) {
    console.error('Error removing RSVP:', err)
  }
  res.json(retVal);
});

router.post('/saveMeeting', async function (req, res, next) {
  const meetings = await saveMeeting(req.body);
  res.json(meetings);
});

async function saveMeeting(theMeeting) {
  console.log('theMeeting: ' + theMeeting);
  await meetings.create(theMeeting,
    function (err, res) {
      if (err) {
        console.log('Could not insert new meeting')
        return { saveMeetingResponse: "fail" };
      }
    }
  )
  return { saveMeetingResponse: "success" };
}

module.exports = router;