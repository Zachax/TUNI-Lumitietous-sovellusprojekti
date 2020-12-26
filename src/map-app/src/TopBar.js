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

  // Use styles
  const styledClasses = useStyles();


  const fecthWeather = async () => {
      //riittä jos haet kaikki tulokset relevantti tieto niissä
     var Sää = new Object();
     const data = fetch('http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&fmisid=101982&')
     .then((response) => response.text())
     .then((response) => {
       const parser = new DOMParser();
       const xmlDoc = parser.parseFromString(response,"text/xml");
       const tulokset = xmlDoc.getElementsByTagName("om:result");
       
       for(let tulos of tulokset) {
        switch (tulos.firstElementChild.getAttribute('gml:id')) {
          case 'obs-obs-1-1-t2m':
            Sää.Lampotila = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
            break;
          
          case 'obs-obs-1-1-ws_10min':
            Sää.Tuuli_nopeus = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
            break;
          
          case 'obs-obs-1-1-wd_10min':
            Sää.Tuuli_suunta = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
            break;
            
          case 'obs-obs-1-1-wg_10min':
            Sää.Tuuli_puuska = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
            break;
        }
       }
      });
      
      props.Sää = Sää;
   };
  
  fecthWeather();
  console.log(props.Sää);
  
  function updateView() {
    props.updateView();
  }
  
  // Returs different views for logged in user than for regular user
  if (!props.isMobile) {
    return (
      <Box className={styledClasses.topbar}>
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
      </Box>
    );
  } else {
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
      </Box>
    );
  }
};
 
export default TopBar;