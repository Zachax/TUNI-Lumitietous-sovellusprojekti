import * as React from "react";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
 
function Info(props) {
  
  //console.log(props);
  if (props.segmentdata !== undefined) {
    if (props.token !== null && props.token !== undefined) {
      return (
        <div className="info">
          <p>Segmentin nimi: {props.segmentdata.Nimi}</p>
          <p>Segmentin maasto: {props.segmentdata.Maasto}</p>
          <IconButton 
          edge="start" 
          //className={styledClasses.editButton} 
          color="inherit" 

        >
          <EditIcon />
        </IconButton>
        </div>
      );
    }
    else {
      return (
        <div className="info">
          <p>Segmentin nimi: {props.segmentdata.Nimi}</p>
          <p>Segmentin maasto: {props.segmentdata.Maasto}</p>
        </div>
      );
    }
  } else {
    return <div className="info" />;
  }

};
 
export default Info;
