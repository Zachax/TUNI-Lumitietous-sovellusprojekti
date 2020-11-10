import * as React from "react";
import Button from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';

function Logout(props) {

  // Event handlers

  const Logout = (event) => {
    props.updateToken(null);
  }
  //console.log(props);

  return (
    <div className="login">
      <Button 
        //edge="start" 
        //className={styledClasses.editButton} 
        color="inherit" 
        onClick={Logout}
      >
        <Typography>Logout</Typography>
        <ExitToAppIcon />
      </Button>
    </div>
  );

};
 
export default Logout;
