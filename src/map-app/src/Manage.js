/**
Segmenttien hallintanäkymä
Tarkoituksena listata segmentit, mahdollisuus suodattaa niitä hakemalla,
muokata, poistaa, lisätä.

Luonut: Markku Nirkkonen 26.11.2020

Markku Nirkkonen 6.12.2020
Alettu lisätä segmentin lisäystoimintoa

Markku Nirkkonen 4.12.2020
Segmentin poisto toimivaksi, lisätty varmistusdialogi poistamiseen

Viimeisin päivitys 26.11.2020
Pohja, segmenttien listaus, segmentin poisto
Segmentin muokkaus ja niiden lisääminen puuttuu vielä

**/

import * as React from "react";
// import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import InputLabel from '@material-ui/core/InputLabel';
// import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
// import Avatar from "@material-ui/core/Avatar";
// import { red } from "@material-ui/core/colors";
// import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddSegment from './AddSegment';


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
    marginTop: 10
  }
}));

function Manage(props) {

  const classes = useStyles();

  const [anchorElMenu, setAnchorElMenu] = React.useState(null); 
  const [selected, setSelected] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
	
	const menuOpen = Boolean(anchorElMenu); 

  /*
   * Event handlers
   */

   
  const handleMenu = event => {
    setSelected(event.currentTarget.id);
		setAnchorElMenu(event.currentTarget);
	};
    
	const handleMenuClose = () => {
    setAnchorElMenu(null);
    setSelected(null);
  };
  
  const handleEdit = () => {
    console.log(selected);
    setAnchorElMenu(null);
    setSelected(null);
  };
  
  const handleDelete = () => {
    const fetchDelete = async () => {
      const response = await fetch('api/segments/' + selected,
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

    // updating segments immediately
    const fetchData = async () => {
      const updates = await fetch('api/segments/update');
      const updateData = await updates.json();
      const response = await fetch('api/segments');
      const data = await response.json();
      data.forEach(segment => {
        segment.update = null;
        updateData.forEach(update => {
          if (update.Segmentti === segment.ID) {
            segment.update = update;           
          }
        });
      });
      props.updateSegments(data);

    };
    fetchData();

    closeDelete();
  };
  
  const openDelete = () => {
    setDeleteOpen(true);
  }

  const closeDelete = () => {
    setAnchorElMenu(null);
    setDeleteOpen(false);
    setSelected(null);
  }

  
  return (  
    <div>
      <Box>
        <AddSegment />
      </Box>
      <Box className={classes.cardContainer}>
        <Grid container spacing={0}>
          
          {
            props.segments.map(item => {
              
              return (
                <Grid item xs={12} sm={4}>
                  <Card className={classes.segmentCard}>
                    <CardHeader 
                      title={item.Nimi}
                      subheader={"Pohjamaasto: " + item.Maasto}
                      action={
                        <IconButton id={item.ID} aria-label="close" onClick={handleMenu}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
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
                      <MenuItem onClick={() => handleEdit()}>
                        Muokkaa
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => openDelete()}>
                        Poista
                      </MenuItem>
                    </Menu>

                    <CardContent>

                      <Typography variant="body1" color="textSecondary" align="left" component="p">
                        {item.On_Alasegmentti !== null ? "Alasegmentti" : "Yläsegmentti"}
                      </Typography>

                    </CardContent>
                  </Card>
                  
                </Grid>
              );
            })
          }  
        </Grid>   
      </Box>
    
    <Dialog 
      onClose={closeDelete} 
      open={deleteOpen}
    >
      <DialogTitle id="simple-dialog-title">Poista segmentti?</DialogTitle>
        <Typography>Segmentin poistaminen poistaa segmentin, alasegmentin ja kaikki niihin liittyvät tiedot. Poista?</Typography>
      <DialogActions>
        <Divider />
        <Button id={"deleteClose"} onClick={closeDelete}>Sulje</Button>
        <Button variant="contained" color="primary" id={"delete"} onClick={handleDelete}>Poista</Button>
      </DialogActions>
    
    </Dialog>
  </div>
  );
}

export default Manage;




