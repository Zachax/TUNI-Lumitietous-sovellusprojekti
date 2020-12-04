/**
Applikaation yläpalkki

Luonut: Markku Nirkkonen

Viimeisin päivitys
Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

**/

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

// Styles for App-Bar
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

  // Use styles
  const styledClasses = useStyles();

  function updateView() {
    props.updateView();
  }
  
  // Returs different views for logged in user than for regular user
  if (!props.isMobile) {
    return (
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={styledClasses.barheader}>
            Snowledge
          </Typography>
          <Box className={styledClasses.baritem}>
            {(props.token === null || props.token === undefined ? <div /> : <Button color="inherit" onClick={updateView}>{props.manageOrMap}</Button>)}
          </Box>
          <Box className={styledClasses.baritem}>
            {(
              props.token === null || props.token === undefined 
              ? 
              <Login updateToken={props.updateToken} /> 
              : 
              <Logout updateToken={props.updateToken} viewManagement={props.viewManagement} updateView={updateView}/>      
            )}
          </Box>

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

          <Box className={styledClasses.baritem}>
            {
              (
                props.token === null || props.token === undefined 
                ? 
                <Login updateToken={props.updateToken}/> 
                : 
                <MobileMenu 
                  token={props.token} 
                  updateToken={props.updateToken} 
                  updateView={updateView} 
                  viewManagement={props.viewManagement} 
                  manageOrMap={props.manageOrMap} 
                />
              )
            }
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
};
 
export default TopBar;