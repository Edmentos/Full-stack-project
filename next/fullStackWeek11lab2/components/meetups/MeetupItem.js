import Card from '../ui/Card';
import classes from './MeetupItem.module.css';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import MeetupContext from '../../context/MeetupContext';

function MeetupItem(props) {
  const router = useRouter();
  const meetupCtx = useContext(MeetupContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const isFavorite = meetupCtx.isFavorite(props.id);

  function showDetailsHandler() {
    router.push('/' + props.id);
  }

  async function deleteHandler() {
    if (confirm(`Are you sure you want to delete "${props.title}"?`)) {
      setIsDeleting(true);
      const result = await meetupCtx.deleteMeeting(props.id);
      if (!result.success) {
        alert('Failed to delete meetup. Please try again.');
        setIsDeleting(false);
      }
    }
  }

  function toggleFavoriteHandler() {
    meetupCtx.toggleFavorite(props.id);
  }

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
          <button 
            className={`${classes.favoriteButton} ${isFavorite ? classes.isFavorite : ''}`}
            onClick={toggleFavoriteHandler}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler} className={classes.detailsButton}>
            Show Details
          </button>
          <button 
            onClick={deleteHandler} 
            disabled={isDeleting}
            className={classes.deleteButton}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
