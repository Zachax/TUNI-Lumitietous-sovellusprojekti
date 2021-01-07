/**
Applikaation yläpalkki

Luonut: Markku Nirkkonen

Viimeisin päivitys

4.1.2020 Markku Nirkkonen & Arttu Lakkala
Säädatan hakeminen ilmatieteenlaitokselta ja sen tietojen näyttäminen yläpalkkiin lisätty

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
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Login from './Login';
import Logout from './Logout';
import EditOwn from './EditOwn';
import MobileMenu from './MobileMenu';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';

// Yläpalkin osien tyylejä
const useStyles = makeStyles((theme) => ({
  topbar: {
    height: "120px",
  },
  barheader: {
    margin: "auto",
    flexGrow: 1,
  },
  baritems: {
    marginLeft: theme.spacing(2),
    display: "inline"
  },
  direction: {
    marginLeft: theme.spacing(1),
    transform: props => 'rotate(' + props.degrees + 'deg)',
  }
}));
 
function TopBar(props) {

  // Hooks
  const [ editOwnOpen, setEditOwnOpen ] = React.useState(false);
  const [ weather, setWeather ] = React.useState(null);

  /* Tyyliattribuutti degrees on tuulen tulosuunta asteina.
   * Ikonia käännetään säädatasta saatu asteluku - 180, sillä nuoli on oletuksena kohti pohjoista,
   * mutta 360 tarkoittaa tuulen tulosuunnissa pohjoista.
   */
  const styledClasses = useStyles({degrees: weather !== null ? weather.Tuuli_suunta - 180 : 0});
  
  // Tuulen suunnan ikonin (nuoli) näkyvyys riippuu siitä, onko tuulen suunta eri kuin 0.0 (= tyyni)
  var windicon;
  if (weather === null) {
    windicon = <Typography>-</Typography>;
  } else if (weather.Tuuli_suunta === "0.0") {
    windicon = <Typography>-</Typography>;
  } else {
    windicon = <NavigationIcon className={styledClasses.direction} />;
  }

  const fetchWeather = async () => {
      //riittä jos haet kaikki tulokset relevantti tieto niissä
     var Sää = {};
     fetch('http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&fmisid=101982&')
      .then((response) => response.text())
      .then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response,"text/xml");
        const tulokset = xmlDoc.getElementsByTagName("om:result");
        
        for(let tulos of tulokset) {
          switch (tulos.firstElementChild.getAttribute('gml:id')) {
            
            // Lämpötila-attribuutin data
            case 'obs-obs-1-1-t2m':
              Sää.Lampotila = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
              break;
            
            // Tuulen nopeuden attribuutin data
            case 'obs-obs-1-1-ws_10min':
              Sää.Tuuli_nopeus = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
              break;
            
            // Tuulen suunna attribuutin data (asteina, tuulen tulosuunta, 360 = pohjoinen)
            case 'obs-obs-1-1-wd_10min':
              Sää.Tuuli_suunta = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
              break;
            
            // Tuulen puuskien nopeuden attribuutin data
            case 'obs-obs-1-1-wg_10min':
              Sää.Tuuli_puuska = tulos.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML;
              break;
            default: 
              // Jos ei osumia, ei tehdä mitään
              break;
          }
        }
      });
      
      // Jos säätietoa ei vielä ole, se tallennetaan hook stateen
      if (weather === null) {
        setWeather(Sää);
      }
   };
  
  fetchWeather();
  
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
    // Suuren näytön näkymät (toiminnot näkyvillä, säätiedot laajemmin)
    return (
      <div>
        <Box className={styledClasses.topbar}>
          <Toolbar>

            {/* Otsikko, (voidaan korvata kuvalla myöhemmin?) */}
            <Typography variant="h6" className={styledClasses.barheader}>
              <img src="pollo.ico" alt="Pallaksen pöllöt logo" />
            </Typography>

            {/* Säätiedot */}
            <Box className={styledClasses.baritems}>
              {/* Havaintoaseman nimi */}
              <Typography variant="subtitle1">Laukukero Huippu</Typography>
              
              <Typography variant="h6">{weather !== null ? weather.Lampotila + " °C | " + weather.Tuuli_nopeus + " m/s" : "Lämpötilatietoa ei saatu"}</Typography>
              <Typography variant="body2">{weather !== null ? "(puuskissa " + weather.Tuuli_puuska + " m/s)" : "Puuskannopeustietoa ei saatu"}</Typography>
              <Typography variant="body2">Tuulen suunta {windicon}</Typography>
            </Box>      
      
            {/* Valinta kartta- ja hallintanäkymän välillä */}
            <Box className={styledClasses.baritems}>
              {(props.token === null || props.token === undefined ? <div /> : <Button color="inherit" onClick={updateView}>{props.manageOrMap}</Button>)}
            </Box>

            {/* Omien tietojen muokkaus kirjautuneille */}
            <Box className={styledClasses.baritems}>
              {!props.viewManagement ? <div /> : <Button color="inherit" onClick={openEditOwn}>Omat tiedot</Button>}
            </Box>

            {/* Kirjautuminen */}
            <Box className={styledClasses.baritems}>
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
        
        {/* Käyttäjän omien tietojen muokkaus. Elementti EditOwn omassa tiedostossaan */}
        <Dialog
          onClose={closeEditOwn}
          open={editOwnOpen}
        >
          <EditOwn user={props.user} token={props.token} closeEditOwn={closeEditOwn} updateUser={props.updateUser} />
        </Dialog>
      </div>
    );
  } else {
    // Pienen näytön näkymät (toiminnot valikossa, säätiedot tiivistetymmin)
    return (
      <Box className={styledClasses.topbar}>
        <Toolbar>
          
          {/* Otsikko, (voidaan korvata kuvalla myöhemmin?) */}
          <Typography variant="h6" className={styledClasses.barheader}>
            <img src="pollo.ico" alt="Pallaksen pöllöt logo" />
          </Typography>

          {/* Säätiedot */}
          <Box className={styledClasses.baritems}>
            {/* Havaintoaseman nimi */}
            <Typography variant="subtitle1">Laukukero Huippu</Typography>
            
            {/* TODO: järjestä paremmin näkyväksi pienellä näytöllä, esimerkiksi eri riveille */}
            <Typography variant="h6">{weather !== null ? weather.Lampotila + " °C | " + weather.Tuuli_nopeus + " m/s" : "Säätietoa ei saatu"}</Typography>
            <Box display="inline">{windicon}</Box>
          </Box>

          {/* Kirjautuminen, tai valikko, jos käyttäjä kirjautunut */}
          <Box className={styledClasses.baritems}>
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