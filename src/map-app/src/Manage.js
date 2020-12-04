/**
Segmenttien hallintanäkymä
Tarkoituksena listata segmentit, mahdollisuus suodattaa niitä hakemalla,
muokata, poistaa, lisätä.

Luonut: Markku Nirkkonen 26.11.2020

Viimeisin päivitys 26.11.2020
Pohja, segmenttien listaus, segmentin poisto
Segmentin muokkaus ja niiden lisääminen puuttuu vielä

**/

import * as React from "react";
// import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// import Divider from '@material-ui/core/Divider';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogTitle from '@material-ui/core/DialogTitle';
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
	
	const menuOpen = Boolean(anchorElMenu); 

  function showMore(id) {
    console.log(id);
  }

  // Event handlers
	const handleMenu = event => {
		setAnchorElMenu(event.currentTarget);
	};
    
	const handleMenuClose = () => {
		setAnchorElMenu(null);
  };
  
  const handleEdit = () => {
    console.log("Toteutetaan muokkaus myöhemmin");
    setAnchorElMenu(null);
  };
  
  const handleDelete = (id) => {
    //console.log(id);
    const fetchDelete = async () => {
      const response = await fetch('api/segments/' + id,
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

    // getting new segmentdata to view update immediately
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
          // update shown segment
          // if (segment.ID === props.segmentdata.ID) {
          //   props.onUpdate(segment);
          // }
        });
      });
      props.updateSegments(data);

    };
    fetchData();

    setAnchorElMenu(null);
	};

  
  return (  
    <div>
      <Box className={classes.cardContainer}>
        <Grid container spacing={0}>
          {
            props.segments.map(item => {
              console.log(item);
              return (
                <Grid item xs={12} sm={4}>
                  <Card className={classes.segmentCard}>
                    <CardHeader 
                      title={item.Nimi}
                      subheader={"Pohjamaasto: " + item.Maasto}
                      action={
                        <IconButton aria-label="close" onClick={handleMenu}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
                    <Menu
                      id="menu-manage"
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
              
                      {(props.token === null || props.token === undefined ? <div /> : <MenuItem onClick={handleMenuClose}> <Button color="inherit" onClick={props.updateView}>{props.manageOrMap}</Button></MenuItem>)}
                      <Divider />
                      <MenuItem onClick={handleEdit}>
                        Muokkaa
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(item.ID)}>
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
    </div>
  );
}

export default Manage;




