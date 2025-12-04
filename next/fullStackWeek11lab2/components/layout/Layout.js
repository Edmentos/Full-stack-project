import MainNavigation from './MainNavigation';
import Notification from '../ui/Notification';
import classes from './Layout.module.css';

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
      <Notification />
    </div>
  );
}

export default Layout;
