import MeetupItem from './MeetupItem';
import classes from './MeetupList.module.css';

function MeetupList(props) {
  return (
    <ul className={classes.list}>
      {props.meetups.map((meetup) => (
        <MeetupItem
          key={meetup._id}
          id={meetup.meetingId}
          image={meetup.image}
          title={meetup.title}
          address={meetup.address}
          date={meetup.date}
          time={meetup.time}
        />
      ))}
    </ul>
  );
}

export default MeetupList;
