/**
Käyttäjän lisäykseen liittyvät toiminnot

Luonut: Markku Nirkkonen 9.1.2021

**/

import * as React from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
  add: {
    padding: theme.spacing(2),
    maxWidth: 400,
    marginTop: 10,
    margin: "auto",
    border: 1,
    borderRadius: 3,
    boxShadow: '0 2px 2px 2px rgba(0, 0, 0, .3)',
  },
  coordinateInputs: {
    display: 'flex'
  },
  addNewLine: {
    // Koordinaattirivin lisäysnapin tyylit
  }
}));

function AddUser(props) {

  // Hooks
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Tarkistuksia lisäyspainikkeen aktivoitumiselle lisäysdialogissa
  const formOK = Boolean(!(firstName !== "" && lastName !== "" && email !== "" && password.length >= 7));
  

  /*
   * Event handlers
   */
  
  // Avaa käyttäjänlisäysdialogin
  const openAdd = () => {
    setAddOpen(true);
  }

  // Sulkee dialogin
  const closeAdd = () => {
    setAddOpen(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAdmin(false);
  }

  // Käyttäjän lisääminen (vahvistusdialogin jälkeen)
  const handleAdd = () => {
    
    // Tiedot  tulevat hookeista
    const data = {
      Etunimi: firstName,
      Sukunimi: lastName,
      Sähköposti: email,
      Salasana: password,
      Rooli: admin ? "admin" : "operator",
    }

    // Käyttäjän lisäämisen api-kutsu
    const fetchAddUser = async () => {
      const response = await fetch('api/',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log(res);
      await props.fetchUsers();
    };
    fetchAddUser();
    closeAdd();
  }

  // Etunimen päivittäminen
  const updateFirstName = (event) => {
    setFirstName(event.target.value);
  }

  // Sukunimen päivittäminen
  const updateLastName = (event) => {
    setLastName(event.target.value);
  }

  // Sähköpostin päivittäminen
  const updateEmail = (event) => {
    setEmail(event.target.value);
  }

  // Sähköpostin päivittäminen
  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  // Roolin vaihtamienn
  const updateAdmin = (event) => {
    setAdmin(!admin);
  }

  // Vaihtaa salasanakentän näkyvyyden (päälle/pois)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();

  /*
   * Renderöinti
   */
  return (
    <div className="add_user">
      
      {/* Painike, joka avaa käyttäjän lisäysdialogin */}
      <Box className={classes.add}>
        <Button>
          <AddCircleOutlineIcon />
          <Typography variant="button" onClick={openAdd}>Lisää käyttäjä</Typography>
          
        </Button>
      </Box>

      {/* Segmentin lisäysdialogi */}
      <Dialog 
        onClose={closeAdd} 
        open={addOpen}
      >
        <DialogTitle id="simple-dialog-title">Lisää segmentti</DialogTitle>
        <Typography variant="caption">Kaikki tekstikentät ovat pakollisia</Typography>
        <Typography variant="caption">Salasanan tulee olla 7 merkkiä</Typography>
        <FormControl>
          <InputLabel htmlFor="firstname" >Etunimi</InputLabel>
          <Input
            id="firstname"
            type='text'
            onChange={updateFirstName}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="lastname" >Sukunimi</InputLabel>
          <Input
            id="lastname"
            type='text'
            onChange={updateLastName}
          />
        </FormControl>
        <FormControl>  
          <InputLabel htmlFor="email" >Sähköposti</InputLabel>
          <Input
            id="email"
            type='text'
            onChange={updateEmail}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="standard-adornment-password">Salasana</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={updatePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox            
              checked={admin}
              onChange={updateAdmin}
              name="admin"
              color="primary"
            />
          }
          label="Admin-käyttäjä"
        />
        
        {/* Painikkeet lomakkeen lopussa */}
        <DialogActions>   
          <Divider />
          <Button id={"deleteClose"} onClick={closeAdd}>Sulje</Button>
          <Button variant="contained" color="primary" id={"delete"} disabled={formOK} onClick={handleAdd}>Lisää</Button>
        </DialogActions>
      
      </Dialog>
    </div>
  );

};
 
export default AddUser;