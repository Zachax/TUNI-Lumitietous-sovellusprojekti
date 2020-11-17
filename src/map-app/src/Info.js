/**
Segmenttien tiedot piirtävä komponentti

Luonut: Markku Nirkkonen

Päivityshistoria

17.11. Ensimmäinen versio segmenttien päivittämisestä

**/

import * as React from "react";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
 
function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");


  // TODO: finalize, not even close to ready yet

  /*
   * Event handlers
   */
  const openUpdate = (event) => {
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
    setLoginOpen(true);
  }

  const closeUpdate = (event) => {
    setLoginOpen(false);
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
  }

  const updateText = (event) => {
    setText(event.target.value);
  }

  const updateSnowtype = (event) => {
    setSnowtype(event.target.value);
  }

  // When form is sent, POST method api call to /user/login
  const sendForm = (event) => {
    const data = {
      Segmentti: props.segmentdata.ID,
      Lumilaatu: snowtype,
      Teksti: text
    }
    const fetchUpdate = async () => {
      setLoading(true);
      const response = await fetch('api/segments/update/' + props.segmentdata.ID,
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
      
      setLoading(false);
    };
    fetchUpdate();
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
    closeUpdate();
    
    // Not sure if this is right way to do, but it works: text updates immediately
    props.segmentdata.update.Teksti = text;
    
    props.onUpdate(props.segmentdata);
  }

  if (props.segmentdata !== undefined) {
    if (props.token !== null && props.token !== undefined) {
      return (
        <div className="info">
          <p>Segmentin nimi: {props.segmentdata.Nimi}</p>
          <p>Segmentin maasto: {props.segmentdata.Maasto}</p>
          <p>Segmentin uusimmat tiedot: {props.segmentdata.update === null ? "Ei tietoja" : props.segmentdata.update.Teksti}</p>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={openUpdate}
          >
            <EditIcon />
          </IconButton>
          <Dialog 
            onClose={closeUpdate} 
            open={loginOpen}
          >
            <DialogTitle id="simple-dialog-title">Päivitä segmenttiä</DialogTitle>
              <Typography>{props.segmentdata.Nimi}</Typography>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={snowtype}
                onChange={updateSnowtype}
                displayEmpty
              >
                <MenuItem value={0}>Ei tietoa</MenuItem>
                <MenuItem value={1}>Pehmeä lumi</MenuItem>
                <MenuItem value={2}>Tuulen pieksämä aaltoileva lumi</MenuItem>
                <MenuItem value={3}>Korppu</MenuItem>
                <MenuItem value={4}>Sohjo</MenuItem>
                <MenuItem value={5}>Jää</MenuItem>
              </Select>

              <FormControl>
                <InputLabel htmlFor="text" >Kuvaus</InputLabel>
                <Input
                  id="text"
                  type='text'
                  multiline={true}
                  rows={5}
                  value={text}
                  onChange={updateText}
                />
              </FormControl>
            <DialogActions>
              <Divider />
              <Button id={"dialogClose"} onClick={closeUpdate}>Cancel</Button>
              <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm}>Update</Button>
            </DialogActions>
          
          </Dialog>
        </div>
      );
    }
    else {
      return (
        <div className="info">
          <p>Segmentin nimi: {props.segmentdata.Nimi}</p>
          <p>Segmentin maasto: {props.segmentdata.Maasto}</p>
          <p>Segmentin uusimmat tiedot: {props.segmentdata.update === null ? "Ei tietoja" : props.segmentdata.update.Teksti}</p>
        </div>
      );
    }
  } else {
    return <div className="info" />;
  }
};
 
export default Info;
