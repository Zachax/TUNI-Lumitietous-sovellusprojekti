import * as React from "react";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Login from './Login';
import Logout from './Logout';
import MobileMenu from './MobileMenu';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  barheader: {
    flexGrow: 1,
  },
  baritem: {
    marginLeft: theme.spacing(2),
    display: "inline"
  }
}));
 
function TopBar(props) {

  const styledClasses = useStyles();
  
  //console.log(props);
  if (!props.isMobile) {
    return (
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={styledClasses.barheader}>
            Snowledge
          </Typography>
          <Box className={styledClasses.baritem}>{(props.token === null || props.token === undefined ? <div /> : <Button color="inherit" >Manage</Button>)}</Box>
          <Box className={styledClasses.baritem}>{(props.token === null || props.token === undefined ? <Login updateToken={props.updateToken} /> : <Logout updateToken={props.updateToken} />)}</Box>

        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={styledClasses.barheader}>
            Snowledge
          </Typography>

          <Box className={styledClasses.baritem}>{(props.token === null || props.token === undefined ? <Login updateToken={props.updateToken}/> : <MobileMenu token={props.token} updateToken={props.updateToken} />)}</Box>
        </Toolbar>
      </AppBar>
    );
  }
};
 
export default TopBar;