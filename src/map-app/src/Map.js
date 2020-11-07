import * as React from "react";
import { useGoogleMaps } from "react-hook-google-maps";
 
function Map(props) {
  const [origin, setOrigin] = React.useState({ lat: 68.045721, lng: 24.062813 });
  const [drawn, setDrawn] = React.useState(false);
  // console.log(props);
  const zoom = (props.isMobile ? 11 : 13)

  const { ref, map, google } = useGoogleMaps(
    // Use your own API key, you can get one from Google (https://console.cloud.google.com/google/maps-apis/overview)
    "AIzaSyBVBvBd1YQDLygYNpwRlbmzosX52Y3l0X0",
    // NOTE: even if you change options later
    {
      center: origin,
      zoom: zoom,
      mapTypeId: "terrain"
    },
  );

  if (props.loaded && !drawn && google !== undefined && map !== undefined) {
    props.segments.forEach(obj =>{
    
      let segment;
      segment = new google.maps.Polygon({
        paths: obj.Points,
        strokeColor: "#0000FF",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#0000FF",
        fillOpacity: 0.15,
      });

      //console.log(drawn);
      //console.log(segment);
      segment.setMap(map);
  
      segment.addListener("mouseover", () => {
        segment.setOptions({fillOpacity: 0.8});
      });
  
      segment.addListener("mouseout", () => {
        segment.setOptions({fillOpacity: 0.15});
      });

      segment.addListener("click", () => {
        props.onClick(obj.ID);
      });
  
    });
    setDrawn(true);
  }
  
  //console.log(map); // instance of created Map object (https://developers.google.com/maps/documentation/javascript/reference/map)
  //console.log(google); // google API object (easily get google.maps.LatLng or google.maps.Marker or any other Google Maps class)

  return <div ref={ref} className="map" />;
};
 
export default Map;
