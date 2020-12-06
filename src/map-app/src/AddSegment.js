/**
Segmentin lisäyspainike ja segmentin lisäykseen liittyvät toiminnot

Luonut: Markku Nirkkonen 6.12.2020


**/

import * as React from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

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

}));

function AddSegment(props) {

  const [points, setPoints] = React.useState([]);
  const [addOpen, setAddOpen] = React.useState(false);

  // Event handlers

  const openAdd = () => {
    setAddOpen(true);
  }

  const closeAdd = () => {
    setAddOpen(false);
  }

  const handleAdd = () => {
    alert("Ei vielä toiminnassa");
    closeAdd();
  }

  const classes = useStyles();

  return (
    <div className="add">
      <Box className={classes.add}>
        <Button>
          <AddCircleOutlineIcon />
          <Typography variant="button" onClick={openAdd}>Lisää segmentti</Typography>
        </Button>
      </Box>

      <Dialog 
        onClose={closeAdd} 
        open={addOpen}
      >
        <DialogTitle id="simple-dialog-title">Lisää segmentti</DialogTitle>
          <Typography variant="caption">Anna segmentille nimi, maastopohjakuvaus ja rajaavat koordinaatit.</Typography>
        <DialogActions>
          <Divider />
          <Button id={"deleteClose"} onClick={closeAdd}>Sulje</Button>
          <Button variant="contained" color="primary" id={"delete"} onClick={handleAdd}>Lisää</Button>
        </DialogActions>
      
      </Dialog>
    </div>
  );

};
 
export default AddSegment;