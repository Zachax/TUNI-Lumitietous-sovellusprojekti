import * as React from "react";
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Logout(props) {

  // Event handlers

  const Logout = (event) => {
    props.updateToken(null);
  }
  //console.log(props);

  return (
    <div className="login">
      <IconButton 
        edge="start" 
        //className={styledClasses.editButton} 
        color="inherit" 
        onClick={Logout}
      >
        <ExitToAppIcon />
      </IconButton>
    </div>
  );

};
 
export default Logout;
