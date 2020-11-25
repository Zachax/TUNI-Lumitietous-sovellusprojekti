/**
Kartan piirto käyttöliittymään
Viimeisin päivitys

Markku Nirkkonen 25.11.
Värit muutettu asiakkaan pyytämiksi
Ensimmäinen versio värien selitteistä lisätty kartan päälle
Tummennus segmentiltä poistuu, jos sen tiedot näyttävä kortti suljetaan

Markku Nirkkonen 17.11.
Segmenttien väri määräytyy nyt lumilaadun mukaan

Markku Nirkkonen 16.11
Lisätty "Vain laskualueet" checkbox suodattamaan segmenttejä

Arttu Lakkala 15.11
Lisätty päivitys värin valintaan

**/

import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import * as React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

// Styles for additional boxes above map
const useStyles = makeStyles((theme) => ({
  checkbox: {
    backgroundColor: "white",
    padding: theme.spacing(1)
  },
  checkboxContainer: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    top: "550px",
    left: theme.spacing(1),
    zIndex: 1
  },
  infoboxContainer: {
    padding: theme.spacing(1),
    //height: "250px",
    width: "120px",
    backgroundColor: "white",
    position: "absolute",
    top: "120px",
    right: theme.spacing(1),
    zIndex: 1,
    display: "block"
  },
  infobox: {
    display: "block",
    padding: theme.spacing(1),
  },
  colorbox: {
    height: "20px",
    //width: "40px",
    zIndex: 1,
  },
}));

function Map(props) {
  
  // Use state hooks
  const [ selectedSegment, setSelectedSegment ] = React.useState({});
  const [ mouseover, setMouseover ] = React.useState({ID: null, name: null});
  const [ center, setCenter ] = React.useState({ lat: 68.067334, lng: 24.092813 });
  const [ subsOnly, setSubsOnly ] = React.useState(false);

  // zoom depends on screen size
  const zoom = (props.isMobile ? 11 : 12);
  
  // TODO: Segmenttien nimet ja värit voisivat olla kannassa ja tulla sieltä, tämä on purkkaratkaisu
  const colors = [
    {
      name: "Ei tietoa",
      color: "#000000",
    },
    {
      name: "Pehmeä lumi",
      color: "#76c4d6"
    },
    {
      name: "Tuulen pieksämä aaltoileva lumi",
      color: "#3f7089"
    },
    {
      name: "Korppu",
      color: "#3838a0"
    },
    {
      name: "Sohjo",
      color: "#7a357c"
    },
    {
      name: "Jää",
      color: "#b533b2"
    },
  ]

  // map styles as %-size of it's ancestor
  const mapStyles = {        
    height: "100%",
    width: "100%"
  };

  /*
   * Event handlers
   */
  function updateChosen(segment) {
    setSelectedSegment(segment);
    props.onClick(segment);
  }

  function updateMouseover(id, name) {
    setMouseover({ID: id, name: name});
  }

  function handleMouseout() {
    setMouseover({ID: null, name: null});
  }

  function updateSubsOnly() {
    setSubsOnly(!subsOnly);
  }
  
  // Use styles
  const styledClasses = useStyles();

  return (
    /*
     * Karttaan piirretään checkbox yläsegmenttien piilottamiselle,
     * Infolaatikko selittämään kartan värejä
     * Segmentit monikulmioina
     *
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
        <Typography>Selitteet</Typography>
        {colors.map(item => {
          
          return (
            // Seliteboksi, sisältää käytettävät värit ja selitteet
            <Box className={styledClasses.infobox}>
              <Paper className={styledClasses.colorbox} style={{backgroundColor: item.color}} />
              <Typography variant='caption' align='justify'>{item.name}</Typography>
              <Divider />
            </Box>
          );
        })}

      </Box>     
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
              var vari=0
              if(item.update !== null){
                vari = item.update.Lumilaatu;
              }
              // Drawing of segment polygons
              return (
                <Polygon 
                  key={item.ID}
                  path={item.Points}
                  options={
                    {
                      strokeColor: colors[vari % colors.length].color,
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: colors[vari % colors.length].color,
                      fillOpacity: (mouseover.ID === item.ID || selectedSegment.ID === item.ID) && props.shownSegment !== null ? 0.8 : 0.15,
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