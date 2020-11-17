/**
Kartan piirto käyttöliittymään
Viimeisin päivitys

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
import { makeStyles } from '@material-ui/core/styles';

// Styles for checkbox
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
    left: theme.spacing(2),
    zIndex: 1
  },
}));

function Map(props) {
  
  // Use state hooks
  const [ selectedSegment, setSelectedSegment ] = React.useState({});
  const [ mouseover, setMouseover ] = React.useState({ID: null, name: null});
  const [ center, setCenter ] = React.useState({ lat: 68.067334, lng: 24.062813 });
  const [ subsOnly, setSubsOnly ] = React.useState(false);

  // zoom depends on screen size
  const zoom = (props.isMobile ? 11 : 12);
  
  // TODO: real colors should be implemented at some point
  const colors = ["#2D3534", "#00FF00", "#FFC300", "#FF5733", "#C70039", "#900C3F"];

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
      <LoadScript
        googleMapsApiKey='AIzaSyBVBvBd1YQDLygYNpwRlbmzosX52Y3l0X0'>
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
                        strokeColor: colors[vari % colors.length],
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: colors[vari % colors.length],
                        fillOpacity: mouseover.ID === item.ID || selectedSegment.ID === item.ID ? 0.8 : 0.15,
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