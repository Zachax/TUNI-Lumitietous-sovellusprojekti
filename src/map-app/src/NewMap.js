/**
Kartan piirto käyttöliittymään
Viimeisin päivitys
Arttu Lakkala 15.11
Lisätty päivitys värin valintaan
**/
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import * as React from "react";

function Map(props) {
  const [ selectedSegment, setSelectedSegment ] = React.useState({});
  const [ mouseover, setMouseover ] = React.useState(null);
  
  const zoom = (props.isMobile ? 11 : 12);
  const colors = ["#FF0000", "#00FF00", "#0000FF"];

  const mapStyles = {        
    height: "600px",
    width: "100%"
  };
  
  const defaultCenter = {
    lat: 68.067334, lng: 24.062813
  }

  function updateChosen(segment) {
    setSelectedSegment(segment);
    props.onClick(segment);
  }

  function updateMouseover(id) {
    setMouseover(id);
  }
  
  return (
    <div className="map">
      <LoadScript
        googleMapsApiKey='AIzaSyBVBvBd1YQDLygYNpwRlbmzosX52Y3l0X0'>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={zoom}
            center={defaultCenter}
            mapTypeId="terrain"
          >
            {
              props.segments.map(item => {
                var vari=0
                if(item.update !== null){
                  vari = item.update.Lumilaatu;
                }
                return (
                  <Polygon 
                    key={item.ID}
                    path={item.Points}
                    options={
                      {
                        strokeColor: colors[vari % 3],
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: colors[vari % 3],
                        fillOpacity: mouseover === item.ID || selectedSegment.ID === item.ID ? 0.8 : 0.15,
                        polygonKey: item.ID
                      }
                    }
                    onClick={() => updateChosen(item)}
                    onMouseOver={() => updateMouseover(item.ID)}
                    onMouseOut={() => updateMouseover(null)}
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