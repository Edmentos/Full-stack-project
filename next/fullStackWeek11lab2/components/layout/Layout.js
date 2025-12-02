import MainNavigation from './MainNavigation';
import Notification from '../ui/Notification';
import ConnectionStatus from '../ui/ConnectionStatus';
import classes from './Layout.module.css';

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
      <Notification />
      <ConnectionStatus />
    </div>
  );
}

export default Layout;
