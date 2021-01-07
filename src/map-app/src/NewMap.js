/**
Kartan piirto käyttöliittymään ('@react-google-maps/api' -kirjaston komponenteilla)
Viimeisin päivitys

Markku Nirkkonen 30.12.2020
Värit tulevat nyt päivityksistä

Markku Nirkkonen 26.11.2020
Segmenttien värien selitteen kutistamis/laajentamis -mahdollisuus lisätty
Pieni korjaus segmenttien hoverin toimintaan.

Markku Nirkkonen 25.11.2020
Värit muutettu asiakkaan pyytämiksi
Ensimmäinen versio värien selitteistä lisätty kartan päälle
Tummennus segmentiltä poistuu, jos sen tiedot näyttävä kortti suljetaan

Markku Nirkkonen 17.11.2020
Segmenttien väri määräytyy nyt lumilaadun mukaan

Markku Nirkkonen 16.11.2020
Lisätty "Vain laskualueet" checkbox suodattamaan segmenttejä

Arttu Lakkala 15.11.2020
Lisätty päivitys värin valintaan

**/

import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import * as React from "react";
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

// Tyylimäärittelyt kartan päälle piirrettäville laatikoille
const useStyles = makeStyles((theme) => ({
  checkbox: {
    backgroundColor: "white",
    padding: theme.spacing(1)
  },
  checkboxContainer: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    bottom: "20px",
    left: theme.spacing(1),
    zIndex: 1
  },
  infoboxContainer: {
    padding: theme.spacing(1),
    //height: "250px",
    width: "120px",
    backgroundColor: "white",
    position: "absolute",
    top: "210px",
    left: theme.spacing(1),
    zIndex: 1,
    display: "block"
  },
  infobox: {
    display: "block",
    padding: theme.spacing(1),
  },
  infoboxHeader: {
    display: "flex",
    //padding: theme.spacing(1),
  },
  colorbox: {
    height: "15px",
    //width: "40px",
    zIndex: 1,
  },
  snowLogo: {
    textAlign: "center"
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

function Map(props) {
  
  // Use state hooks
  const [ selectedSegment, setSelectedSegment ] = React.useState({});
  const [ mouseover, setMouseover ] = React.useState({ID: null, name: null});
  const [ center, setCenter ] = React.useState({ lat: 68.067334, lng: 24.062813 });
  const [ subsOnly, setSubsOnly ] = React.useState(false);
  const [ expanded, setExpanded ] = React.useState(props.isMobile ? false : true);

  // zoom rippuu näytön koosta
  const zoom = (props.isMobile ? 11 : 12);

  // kartan tyylit 
  const mapStyles = {        
    height: "100%",
    width: "100%"
  };

  /*
   * Event handlers
   */
  
  // Päivittää tiedon kartalta valitusta segmentistä
  function updateChosen(segment) {
    setSelectedSegment(segment);
    props.onClick(segment);
  }

  // Päivitetään tieto siitä, minkä segmentin päälläkursori on
  function updateMouseover(id, name) {
    setMouseover({ID: id, name: name});
  }

  // Nollataan tiedot, kun kursori poistuu segmentin päältä
  function handleMouseout() {
    setMouseover({ID: null, name: null});
  }

  // Päivitetään tieto siitä, näytetäänkö vain alasegmentit vai ei
  function updateSubsOnly() {
    setSubsOnly(!subsOnly);
  }

  // Laajentaa/kutistaa segmenttien väritietoboksin
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  // Use styles
  const styledClasses = useStyles();

  return (
    /*
     * Karttaan piirretään checkbox yläsegmenttien piilottamiselle,
     * Infolaatikko selittämään kartan värejä
     * Segmentit monikulmioina
     * Kartta piirretään '@react-google-maps/api' -kirjaston komponenteilla
     */
    <div className="map">
      <Box className={styledClasses.checkboxContainer}>
        <FormControlLabel
          className={styledClasses.checkbox}
          control={
            <Checkbox            
              checked={subsOnly}
              onChange={updateSubsOnly}
              name="Subsegments_only"
              color="primary"
            />
          }
          label="Vain laskualueet"
        />
      </Box>
      <Box className={styledClasses.infoboxContainer}>
        <Box className={styledClasses.infoboxHeader}>
        <Typography>Selitteet</Typography>
        <IconButton
          className={clsx(styledClasses.expand, {
            [styledClasses.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {/* Selitteet renderöidään, jos tiedot segmenttien nimistä ovat saatavilla (props.segmentColors.name) */}
          {
            props.segmentColors !== null 
            ?
            props.segmentColors.map((item, index) => {
              
              return (
                // Seliteboksi, sisältää lumilogot ja selitteet
                <Box className={styledClasses.infobox}>
                  {/* TODO: kun ei-tietoa-logo saatavilla, ehdon voi poistaa */}
                  {
                    index === 0 
                    ? 
                    <Typography className={styledClasses.snowLogo}>?</Typography> 
                    : 
                    <Box className={styledClasses.snowLogo}><img src={process.env.PUBLIC_URL + "/pienetlogot/" + index + ".png"} alt="lumityypin logo" align="center"/></Box>      
                  }
                  {/* <Paper className={styledClasses.colorbox} style={{backgroundColor: item.color}} /> */}
                  <Box className={styledClasses.snowLogo}>
                    <Typography variant='caption' align='justify'>{item.name}</Typography>
                  </Box>       
                  <Divider />
                </Box>
              );
            })
            :
            <div />
          }
        </Collapse>
      </Box>     
      
      {/* Tässä tarvitaan toimiva APIkey Googlelta */}
      <LoadScript
        googleMapsApiKey='AIzaSyBVBvBd1YQDLygYNpwRlbmzosX52Y3l0X0'
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={zoom}
          center={center}
          mapTypeId="terrain"
        >
          {
            props.segments.map(item => {
              //var vari=0
              var drawColor="#000000"
              if(item.update !== null){
                //vari = item.update.Lumilaatu;
                drawColor = item.update.Lumi.Vari;
              }
              /* Piirretään segmentit monikulmioina
               * 
               * zIndex määrittää päällekäisyysjärjestyksen sen perusteella, onko kyseessä alasegmentti vai ei
               */
              return (
                <Polygon 
                  key={item.ID}
                  path={item.Points}
                  options={
                    {
                      strokeColor: drawColor,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: drawColor,
                      fillOpacity: (mouseover.ID === item.ID || (selectedSegment.ID === item.ID && props.shownSegment !== null)) ? 0.8 : 0.15,
                      polygonKey: item.ID,
                      zIndex: item.On_Alasegmentti !== null ? 2 : 1,
                      visible: subsOnly && item.On_Alasegmentti === null ? false : true
                    }
                  }
                  onClick={() => updateChosen(item)}
                  onMouseOver={() => updateMouseover(item.ID, item.Nimi)}
                  onMouseOut={() => handleMouseout()}
                />
              )
            })
          }
        </GoogleMap>
      </LoadScript>   
    </div>
  )
}

export default Map;