/**
Käyttäjien hallintanäkymä
Tarkoituksena listata käyttäjät, muokata, poistaa ja lisätä niitä.

Luonut: Markku Nirkkonen 18.12.2020

Viimeisimmät muutokset:

Markku Nirkkonen 19.12.2020
Muokkaaminen ja poistaminen toimivat.

**/
import * as React from "react";
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { useEffect } from 'react';


const useStyles = makeStyles((theme) => ({
  segmentCard: {
    padding: theme.spacing(1),
    maxWidth: 400,
    //maxHeight: 300,
    margin: "auto",
    marginTop: 10
  },
  cardContainer: {
    flexGrow: 1,
    marginTop: 10,
  },

  coordinateInputs: {
    display: 'flex'
  },
}));

function UserManage(props) {

  const classes = useStyles();

  // Hooks
  const [anchorElMenu, setAnchorElMenu] = React.useState(null); 
  const [selected, setSelected] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [initials, setInitials] = React.useState(null);

  const [users, setUsers] = React.useState(null);
  
  const menuOpen = Boolean(anchorElMenu);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetch('api/user/all',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        }
      });

      const usersdata = await users.json();

      console.log(usersdata);
      setUsers(usersdata);
    };
    fetchUsers();
  }, []);
  
  /*
   * Event handlers
   */

   
  // Käyttäjän valikon avaaminen, tarkentaa samalla valitun käyttäjän 
  const handleMenu = (event, item) => {
    setSelected(item);
    console.log(item);
    // Alkuperäisten arvojen alustaminen muutosten perumista varten
    if (!editOpen) {
      var initialName = item.Etunimi;
      var initialLastname = item.Sukunimi;
      var initialEmail = item.Sähköposti;

      setInitials(
        {
          Etunimi: initialName,
          Sukunimi: initialLastname,
          Sähköposti: initialEmail
        }
      );
    }
		setAnchorElMenu(event.currentTarget);
	};
    
  // Menun sulkeminen nollaa valitut segmentit
  const handleMenuClose = () => {
    setAnchorElMenu(null);
    setSelected(null);
    setInitials(null);
  };
  
  // Segmentin poiston api-kutsu
  const handleDelete = () => {
    const fetchDelete = async () => {
      const response = await fetch('api/user/' + selected.ID,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        }
      });
    };
    fetchDelete();

    // käyttäjät päivitetään heti
    const fetchUsers = async () => {
      const users = await fetch('api/user/all',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        }
      });
      const usersdata = await users.json();

      console.log(usersdata);
      setUsers(usersdata);
    };
    fetchUsers();

    closeDelete();
  };
  
  // avataan segmentin poistodialogi
  const openDelete = () => {
    setDeleteOpen(true);
  }

 // Suljetaan poistodialogi ja nollataan segmentin valinta
  const closeDelete = () => {
    setAnchorElMenu(null);
    setDeleteOpen(false);
    setSelected(null);
    setInitials(null);
  }

  // Käsitellään käyttäjän muokkaus
  // TODO: syötteiden tarkistukset jollakin tavalla? 
  const handleEdit = () => {
    
    // Tiedot  tulevat hookeista
    const data = {
      Etunimi: firstName === null ? initials.Etunimi : firstName,
      Sukunimi: lastName === null ? initials.Sukunimi : lastName,
      Sähköposti: email === null ? initials.Sähköposti : email,
      ID: selected.ID
    }
    console.log(data);

    // Käyttäjän muokkaamisen api-kutsu
    const fetchEditUser = async () => {
      const response = await fetch('api/user/'+selected.ID,
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
      const users = await fetch('api/user/all',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Bearer " + props.token
        }
      });
      const usersdata = await users.json();

      console.log(usersdata);
      setUsers(usersdata);
    };
    fetchUsers();
    setAnchorElMenu(null);
    closeEdit();
  };

  // Avataan muokkausdialogi
  const openEdit = (item) => {
    console.log(initials);
    setEditOpen(true);
  }

  // Kun muokkausdialogi suljetaan, nollataan valinnat ja suljetaan dialogi
  const closeEdit = () => {
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setInitials(null);
    setAnchorElMenu(null);
    setEditOpen(false);
    setSelected(null);
  }

  const updateFirstName = (event) => {
    if (event.target.value === "") {
      setFirstName(initials.Etunimi);
    } else {
      setFirstName(event.target.value);
    }
  }

  const updateLastName = (event) => {
    if (event.target.value === "") {
      setLastName(initials.Sukunimi);
    } else {
      setLastName(event.target.value);
    }
  }

  const updateEmail = (event) => {
    if (event.target.value === "") {
      setEmail(initials.Email);
    } else {
      setEmail(event.target.value);
    }
  }

  const updatePassword = (event) => {
    setPassword(event.target.value);
  }

  // Renderöinti
  return (  
    <div>

      {/* Painike, mistä voi lisätä segmentin */}
      <Box>
        {/* <AddSegment token={props.token} segments={props.segments} updateSegments={props.updateSegments}/> */}
      </Box>
      
      {/* Segmenttikortit */}
      <Box className={classes.cardContainer}>
        <Grid container spacing={0}> 
          
          {/* Luodaan jokaiselle käyttäjälle oma kortti */}
          {
            users === null 
            ? 
            <div />
            :
            users.map(item => {
              return (
                <Grid item xs={12} sm={4}>
                  <Card className={classes.segmentCard}>
                    <CardHeader 
                      title={item.Etunimi + " " +item.Sukunimi}
                      subheader={item.Sähköposti}
                      action={
                        <IconButton id={item.ID} aria-label="close" onClick={(event) => handleMenu(event, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
                    
                    {/* Valikko kortin lisätoiminnoille */}
                    <Menu           
                      anchorEl={anchorElMenu}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={menuOpen}
                      onClose={handleMenuClose}
                    > 
                      <MenuItem onClick={() => openEdit(item)}>
                        Muokkaa
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => openDelete()}>
                        Poista
                      </MenuItem>
                    </Menu>

                    <CardContent>

                      <Typography variant="body1" color="textSecondary" align="left" component="p">
                        {item.Rooli !== null ? "Rooli: " + item.On_Alasegmentti: "Ei määriteltyä roolia"}
                      </Typography>

                    </CardContent>
                  </Card>
                  
                </Grid>
              );
            })
          }  
        </Grid>   
      </Box>
    
    {/* Segmentin poistodialogi */}
    <Dialog 
      onClose={closeDelete} 
      open={deleteOpen}
    >
      <DialogTitle id="delete_segment">Poista käyttäjä?</DialogTitle>
        <Typography>Poistetaan käyttäjä ja kaikki käyttäjään liittyvät tiedot. Poista?</Typography>
      <DialogActions>
        <Divider />
        <Button id={"deleteClose"} onClick={closeDelete}>Sulje</Button>
        <Button variant="contained" color="primary" id={"delete"} onClick={handleDelete}>Poista</Button>
      </DialogActions>
    
    </Dialog>
    
    {/* Muokkausdialogi (lomake) */}
    <Dialog 
        onClose={closeEdit} 
        open={editOpen}
      >
        <DialogTitle id="edit_segment">Muokkaa käyttäjää</DialogTitle>
        <FormControl>  
          <InputLabel htmlFor="firstname" >Muuta etunimeä</InputLabel>
          <Input
            id="firstname"
            type='text'
            onChange={updateFirstName}
            placeholder={selected !== null ? selected.Etunimi : ""}
          />
        </FormControl>
        <FormControl>  
          <InputLabel htmlFor="lastname" >Muuta sukunimeä</InputLabel>
          <Input
            id="lastname"
            type='text'
            onChange={updateLastName}
            placeholder={selected !== null ? selected.Sukunimi : ""}
          />
        </FormControl>
        <FormControl>  
          <InputLabel htmlFor="email" >Muuta sähköpostia</InputLabel>
          <Input
            id="email"
            type='text'
            onChange={updateEmail}
            placeholder={selected !== null ? selected.Email : ""}
          />
        </FormControl>

        <DialogActions>
          <Divider />
          <Button id={"editClose"} onClick={closeEdit}>Sulje</Button>
          <Button variant="contained" color="primary" id={"save_edit"} onClick={handleEdit} >Tallenna muutokset</Button>
        </DialogActions>
      
      </Dialog>
  </div>
  );
}

export default UserManage;