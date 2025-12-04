import { useRef } from 'react';

import Card from '../ui/Card';
import classes from './NewMeetupForm.module.css';

function NewMeetupForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();
  const dateInputRef = useRef();
  const timeInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;
    const enteredDate = dateInputRef.current.value;
    const enteredTime = timeInputRef.current.value;

    const meetupData = {
      meetingId: enteredTitle,
      title: enteredTitle,
      image: enteredImage,
      address: enteredAddress,
      description: enteredDescription,
      date: enteredDate,
      time: enteredTime,
    };

    props.onAddMeetup(meetupData);
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='title'>Meetup Title (must be unique: it's the meeting ID)</label>
          <input 
            type='text' 
            required 
            id='title' 
            ref={titleInputRef}
            disabled={props.isSubmitting}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='image'>Meetup Image URL</label>
          <input 
            type='url' 
            required 
            id='image' 
            ref={imageInputRef}
            disabled={props.isSubmitting}
            placeholder='https://example.com/image.jpg'
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='address'>Address</label>
          <input 
            type='text' 
            required 
            id='address' 
            ref={addressInputRef}
            disabled={props.isSubmitting}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='date'>Date</label>
          <input 
            type='date' 
            required 
            id='date' 
            ref={dateInputRef}
            disabled={props.isSubmitting}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='time'>Time</label>
          <input 
            type='time' 
            required 
            id='time' 
            ref={timeInputRef}
            disabled={props.isSubmitting}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            required
            rows='5'
            ref={descriptionInputRef}
            disabled={props.isSubmitting}
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button disabled={props.isSubmitting}>
            {props.isSubmitting ? 'Adding Meetup...' : 'Add Meetup'}
          </button>
        </div>
      </form>
    </Card>
  );
}

export default NewMeetupForm;
