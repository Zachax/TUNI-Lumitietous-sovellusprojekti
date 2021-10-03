/**
Uloskirjautumispainike ja sen toiminnallisuudet

Luonut: Markku Nirkkonen

Viimeisin päivitys
Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

**/

import * as React from "react";
import Button from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";

function Logout(props) {

  // Event handlers
   
  //  Uloskirjautuminen nollaa tokenin ja kirjautuneen käyttäjän
  const Logout = () => {
    props.updateToken(null);
    props.updateUser(null);
    if (props.viewManagement) {
      props.updateView();
    }   
  };

  return (
    <div className="login">
      <Button 
        color="inherit" 
        onClick={Logout}
      >
        <Typography variant="button" >Kirjaudu ulos</Typography>
        <ExitToAppIcon />
      </Button>
    </div>
  );

}
 
export default Logout;
