/**
Segmenttien tiedot piirtävä komponentti
Sisältää myös segmenttien tietojen päivitystoiminnot kirjautuneille käyttäjille

Luonut: Markku Nirkkonen

Päivityshistoria

26.11. Markku Nirkkonen
Tekstejä suomennettu

25.11. Markku Nirkkonen
Muotoiltu segmentin tiedot korttimaisemmaksi
Segmentin tiedot näyttävän kortin voi sulkea

17.11. Markku Nirkkonen 
Ensimmäinen versio segmenttien päivittämisestä

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
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    margin: "auto"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  avatar: {
    backgroundColor: red[500]
  }
}));
 
function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");
  const classes = useStyles();

  // TODO: still things to finalize. Styles etc.

  /*
   * Event handlers
   */
  const openUpdate = (event) => {
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tuoretta tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
    setLoginOpen(true);
  }

  const closeUpdate = (event) => {
    setLoginOpen(false);
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tuoretta tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
  }

  const updateText = (event) => {
    setText(event.target.value);
  }

  const updateSnowtype = (event) => {
    setSnowtype(event.target.value);
  }

  function closeShownSegment() {
    props.onClose(null);
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
      await response.json();
    };
    fetchUpdate();
    
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
          if (segment.ID === props.segmentdata.ID) {
            props.onUpdate(segment);
          }
        });
      });
      props.updateSegments(data);
      setLoading(false);
    };
    fetchData();
    
    closeUpdate();
    
  }

  if (props.segmentdata !== undefined) {
    if (props.token !== null && props.token !== undefined) {
      
      // These render when there is user logged in
      return (
        <div className="info">
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {props.segmentdata.Nimi.charAt(0).toUpperCase()}
                </Avatar>
              }
              action={
                <IconButton aria-label="close" onClick={() => closeShownSegment()}>
                  <CloseIcon />
                </IconButton>
              }
              title={props.segmentdata.Nimi}
              subheader={props.segmentdata.Maasto}
              titleTypographyProps={
                {
                  align: 'left'
                }
              }
              subheaderTypographyProps={
                {
                  align: 'left'
                }
              }
            />

            <CardContent>
              <Typography variant="body1" color="textSecondary" align="left" component="p">
                Lumilaatu
              </Typography>
              <Typography variant="body2" color="textSecondary" align="left" component="p">
                {props.segmentdata.update === null ? "Ei kuvausta" : props.segmentdata.update.Teksti}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton 
                edge="start" 
                color="inherit" 
                onClick={openUpdate}
              >
                <EditIcon />
                <Typography variant="button">Päivitä</Typography>
              </IconButton>
            </CardActions>
          </Card>
          
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
                  placeholder={text}
                  onChange={updateText}
                />
              </FormControl>
            <DialogActions>
              <Divider />
              <Button id={"dialogClose"} onClick={closeUpdate}>Peruuta</Button>
              <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm}>Päivitä</Button>
            </DialogActions>
          
          </Dialog>
        </div>
      );
    }
    else {
      // These render when there is no logged in user
      return (
        <div className="info">
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {props.segmentdata.Nimi.charAt(0).toUpperCase()}
                </Avatar>
              }
              action={
                <IconButton aria-label="close" onClick={() => closeShownSegment()}>
                  <CloseIcon />
                </IconButton>
              }
              title={props.segmentdata.Nimi}
              subheader={props.segmentdata.Maasto}
              titleTypographyProps={
                {
                  align: 'left'
                }
              }
              subheaderTypographyProps={
                {
                  align: 'left'
                }
              }
            />

            <CardContent>
              <Typography variant="body1" color="textSecondary" align="left" component="p">
                Lumilaatu
              </Typography>
              <Typography variant="body2" color="textSecondary" align="left" component="p">
                {props.segmentdata.update === null ? "Ei kuvausta" : props.segmentdata.update.Teksti}
              </Typography>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else {
    return <div className="info" />;
  }
};
 
export default Info;