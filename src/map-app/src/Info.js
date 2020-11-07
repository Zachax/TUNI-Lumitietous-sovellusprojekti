import * as React from "react";
import { useEffect } from 'react';
 
function Info(props) {
  
  //console.log(props);
  if (props.segmentdata !== undefined) {
    return (
      <div className="info">
        <p>Segmentin nimi: {props.segmentdata.Nimi}</p>
        <p>Segmentin maasto: {props.segmentdata.Maasto}</p>
      </div>
    );
  } else {
    return <div className="info" />;
  }

};
 
export default Info;
