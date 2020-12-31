/**
Applikaation yläpalkki

Luonut: Markku Nirkkonen

Viimeisin päivitys

29.12.2020 Markku Nirkkonen
Lisätty painike omien tietojen muokkaamiselle

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia



**/

import * as React from "react";
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
//import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { DialogContent } from "@material-ui/core";
 
function EditOwn(props) {

  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);

  // Määrittää, onko muokkauslomakkeen tallennuspainike aktiivinen (tyhjillä/muuttamattomilla syötteillä ei ole)
  const saveDisabled = Boolean(
    (firstName === null || firstName === props.user.Etunimi) && 
    (lastName === null || lastName === props.user.Sukunimi) && 
    (email === null || email === props.user.Sähköposti)
  );

  // etunimen päivitys
  const updateFirstName = (event) => {
    if (event.target.value === "") {
      setFirstName(props.user.Etunimi);
    } else {
      setFirstName(event.target.value);
    }
  }

  // sukunimen päivitys
  const updateLastName = (event) => {
    if (event.target.value === "") {
      setLastName(props.user.Sukunimi);
    } else {
      setLastName(event.target.value);
    }
  }

  // sähköpostin päivittäminen
  const updateEmail = (event) => {
    if (event.target.value === "") {
      setEmail(props.user.Sähköposti);
    } else {
      setEmail(event.target.value);
    }
  }

  // lomakkeen sulkeminen nollaa muutokset seuraavaa muokkauskertaa varten
  const handleClose = () => {
    props.closeEditOwn();
    setEmail(null);
    setFirstName(null);
    setLastName(null);
  }

  // Käsitellään käyttäjän muokkaus
  // TODO: syötteiden tarkistukset jollakin tavalla? 
  const handleEdit = () => {
    
    // Tiedot  tulevat hookeista
    const data = {
      Etunimi: firstName === null ? props.user.Etunimi : firstName,
      Sukunimi: lastName === null ? props.user.Sukunimi : lastName,
      Sähköposti: email === null ? props.user.Sähköposti : email,
      ID: props.user.ID
    }
    console.log(data);

    // Käyttäjän muokkaamisen api-kutsu
    const fetchEditUser = async () => {
      const response = await fetch('api/user/'+props.user.ID,
      {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
    };
    fetchEditUser();

    // Käyttäjät päivitetään
    const fetchUsers = async () => {
      const user = await fetch('api/user/',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        }
      });
      const userdata = await user.json();

      console.log(userdata);
      props.updateUser(userdata[0]);
    };
    fetchUsers();
    props.closeEditOwn();
  };

  return (
    <div>
      {/* Dialogi näyttää nykyiset tiedot ja sisältää muokkauskentät, sekä toimintopainikkeet muokkaamista varten */}
      <DialogTitle id="edit_user">Muokkaa tietojasi</DialogTitle>
        <DialogContent>
        <Typography variant="subtitle2">Tiedot nyt:</Typography>
        <Typography>{props.user.Etunimi + " " + props.user.Sukunimi}</Typography>
        <Typography>{props.user.Sähköposti}</Typography>
          <FormControl>  
            <InputLabel htmlFor="firstname" >Muuta etunimeä</InputLabel>
            <Input
              id="firstname"
              type='text'
              onChange={updateFirstName}
              placeholder={props.user !== null ? props.user.Etunimi : ""}
            />
          </FormControl>
          <br/>
          <FormControl>  
            <InputLabel htmlFor="lastname" >Muuta sukunimeä</InputLabel>
            <Input
              id="lastname"
              type='text'
              onChange={updateLastName}
              placeholder={props.user !== null ? props.user.Sukunimi : ""}
            />
          </FormControl>
          <br/>
          <FormControl>  
            <InputLabel htmlFor="email" >Muuta sähköpostia</InputLabel>
            <Input
              id="email"
              type='text'
              onChange={updateEmail}
              placeholder={props.user !== null ? props.user.Sähköposti : ""}
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Divider />
          <Button id={"editClose"} onClick={handleClose}>Sulje</Button>
          <Button variant="contained" color="primary" id={"save_edit"} onClick={handleEdit} disabled={saveDisabled}>Tallenna muutokset</Button>
        </DialogActions>
        
    </div>
  );
};
 
export default EditOwn;