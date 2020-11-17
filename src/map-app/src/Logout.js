/**
Uloskirjautumistoimintojen piirto yläpalkkiin

Luonut: Markku Nirkkonen

Viimeisin päivitys

**/

import * as React from "react";
import Button from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';

function Logout(props) {

  // Event handlers
  const Logout = (event) => {
    props.updateToken(null);
  }

  return (
    <div className="login">
      <Button 
        //edge="start" 
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
