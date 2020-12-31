/**
Applikaation yläpalkki

Luonut: Markku Nirkkonen

Viimeisin päivitys

29.12.2020 Markku Nirkkonen
Lisätty painike omien tietojen muokkaamiselle

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

**/

import * as React from "react";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Login from './Login';
import Logout from './Logout';
import EditOwn from './EditOwn';
import MobileMenu from './MobileMenu';
import { makeStyles } from '@material-ui/core/styles';

// Yläpalkin osien tyylejä
const useStyles = makeStyles((theme) => ({
  topbar: {
    height: "120px",
  },
  barheader: {
    flexGrow: 1,
  },
  baritem: {
    marginLeft: theme.spacing(2),
    display: "inline"
  },
}));
 
function TopBar(props) {

  // Hooks
  const [ editOwnOpen, setEditOwnOpen ] = React.useState(false);

  // Use styles
  const styledClasses = useStyles();

  function updateView() {
    props.updateView();
  }

  const openEditOwn = () => {
    setEditOwnOpen(true);
  }

  const closeEditOwn = () => {
    setEditOwnOpen(false);
  }

  
  // Näkymät riippuvat näyttöportin koosta ja siitä, onko käyttäjä kirjautunut vai ei
  if (!props.isMobile) {
    // Pienen näytön näkymät (toiminnot valikon takana)
    return (
      <div>
        <Box className={styledClasses.topbar}>
          <Toolbar>
            <Typography variant="h6" className={styledClasses.barheader}>
              Snowledge
            </Typography>
      
            <Box className={styledClasses.baritem}>
              {(props.token === null || props.token === undefined ? <div /> : <Button color="inherit" onClick={updateView}>{props.manageOrMap}</Button>)}
            </Box>

            <Box className={styledClasses.baritem}>
              {!props.viewManagement ? <div /> : <Button color="inherit" onClick={openEditOwn}>Omat tiedot</Button>}
            </Box>

            <Box className={styledClasses.baritem}>
              {(
                props.token === null || props.token === undefined 
                ? 
                <Login updateToken={props.updateToken} updateUser={props.updateUser}/> 
                : 
                <Logout updateToken={props.updateToken} updateUser={props.updateUser} viewManagement={props.viewManagement} updateView={updateView}/>      
              )}
            </Box>

          </Toolbar>
        </Box>
        <Dialog
          onClose={closeEditOwn}
          open={editOwnOpen}
        >
          <EditOwn user={props.user} token={props.token} closeEditOwn={closeEditOwn} updateUser={props.updateUser} />
        </Dialog>
      </div>
    );
  } else {
    // Suuren näytön näkymät (toiminnot näkyvillä yläpalkissa)
    return (
      <Box className={styledClasses.topbar}>
        <Toolbar>
          <Typography variant="h6" className={styledClasses.barheader}>
            Snowledge
          </Typography>

          <Box className={styledClasses.baritem}>
            {
              (
                props.token === null || props.token === undefined 
                ? 
                <Login updateToken={props.updateToken} updateUser={props.updateUser} /> 
                : 
                <MobileMenu 
                  token={props.token}
                  user={props.user} 
                  updateToken={props.updateToken}
                  updateUser={props.updateUser} 
                  updateView={updateView} 
                  viewManagement={props.viewManagement} 
                  manageOrMap={props.manageOrMap} 
                />
              )
            }
          </Box>
        </Toolbar>
      </Box>
    );
  }
};
 
export default TopBar;