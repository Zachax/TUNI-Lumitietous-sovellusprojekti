/**
Segmenttien tiedot piirtävä komponentti
Sisältää myös segmenttien tietojen päivitystoiminnot kirjautuneille käyttäjille

Luonut: Markku Nirkkonen

Päivityshistoria
30.12.2020 Markku Nirkkonen
Avatar värjäytyy segmentin värin mukaiseksi

11.12. Lisättiin lumilaadun ja alasegmentin tiedot hakujen parsimiseen

5.12. Arttu Lakkala
Muutettii update postin kohde (api/segments/update/:id -> api/update/:id)
Tehty API:ssa tapahtuneen muutoksen mukaisesti

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
import Box from '@material-ui/core/Box';
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
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({

  avatar: {
    backgroundColor: props => props.avatarColor,
    display: "flex",
    margin: "auto"
  },
  close: {
    color: "white"
  },
  textBox: {
    margin: "auto",
    display: "block",
  },
  snowLogo: {
    padding: theme.spacing(4),
    textAlign: "center"
  },
  snowInfoTexts: {
    maxWidth: 300,
    color: "white",
    padding: theme.spacing(4),
  },
  editButton: {
    color: "white",
    display: "flex",
  }
}));
 
function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");
  
  const classes = useStyles({avatarColor: props.segmentdata.update === null ? "#000000" : props.segmentdata.update.Lumi.Vari});

  // TODO: Pitää tehdä tyyliltään mustalla sivupalkkipohjalla näkyväksi
  // TODO: Lomaketta pitää laajentaa. Tietojen lähetykseen mukaan päivittäjän ID ym.

  /*
   * Event handlers
   */
  
  // Segmentin päivitysdialogin avaus
  const openUpdate = (event) => {
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tuoretta tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
    setLoginOpen(true);
  }

  // Segmentin päivitysdialogin sulkeminen
  const closeUpdate = (event) => {
    setLoginOpen(false);
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei tuoretta tietoa");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
  }

  // Lumitilanteen kuvaustekstin päivittäminen
  const updateText = (event) => {
    setText(event.target.value);
  }

  // Lumitilanteen lumityypin päivittäminen
  const updateSnowtype = (event) => {
    setSnowtype(event.target.value);
  }

  // Nollataan valittu segmentti sulkiessa
  function closeShownSegment() {
    props.onClose(null);
  }

  // Kun lomake lähetetään, tehdään POST methodin api-kutsu polkuun /api/update/:id
  const sendForm = (event) => {
    
    // Tallennushetken lumilaatu, kuvausteksti. Lisäksi päivitettävän (valitun) segmentin ID
    // TODO: Päivittäjän ID mukaan? Mitä muita tietoja tarvitaan?
    const data = {
      Segmentti: props.segmentdata.ID,
      Lumilaatu: snowtype,
      Teksti: text
    }
    const fetchUpdate = async () => {
      setLoading(true);
      const response = await fetch('api/update/' + props.segmentdata.ID,
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
    
    // Haetaan ajantasaiset segmenttien tiedot heti päivittämisen jälkeen
    const fetchData = async () => {
      const snow = await fetch('api/lumilaadut');
      const snowdata = await snow.json();
      const updates = await fetch('api/segments/update');
      const updateData = await updates.json();
      const response = await fetch('api/segments');
      const data = await response.json();
      
      
      await updateData.forEach(update => {
        snowdata.forEach(snow => {
          if(snow.ID === update.Lumilaatu){
            update.Lumi = snow;
          }
        });
      });
      
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
        if(segment.On_Alasegmentti != null)
        {
          data.forEach(mahd_yla_segmentti => {
            if(mahd_yla_segmentti.ID === segment.On_Alasegmentti){
              segment.On_Alasegmentti = mahd_yla_segmentti.Nimi;
            }
          });
        } 
      });
      //console.log(data);
      props.updateSegments(data);
      setLoading(false);
    };
    fetchData();
    closeUpdate();  
  }

  // Segmenttidataa tulee olla, jotta renderöidään mitään näkyvää
  if (props.segmentdata !== undefined) {
    
    if (props.token !== null && props.token !== undefined) {
      
      // Nämä renderöidään, kun käyttäjä on kirjautunut (muokkaustoiminto lisänä)
      return (
        <div className="info">
          <IconButton aria-label="close" className={classes.close} onClick={() => closeShownSegment()}>
            <CloseIcon />
          </IconButton>

          {/* <Avatar aria-label="segment_info" className={classes.avatar} >
            {props.segmentdata.Nimi.charAt(0).toUpperCase()}
          </Avatar> */}

          

          <Box className={classes.textBox} >

          <Typography variant="h5" className={classes.snowInfoTexts} align="center" component="p">
            {props.segmentdata === null ? "Ei nimitietoa" : props.segmentdata.Nimi}
          </Typography>
          {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
            {props.segmentdata === null ? "Ei tietoa pohjamaastosta" : props.segmentdata.Maasto}
          </Typography> */}
          <Box className={classes.snowLogo}>
            {props.segmentdata.update !== null ? <img src={process.env.PUBLIC_URL + "/lumilogot/" + props.segmentdata.update.Lumi.ID + ".png"}/> : <div />}
          </Box>
          <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
            {props.segmentdata.update === null ? "Ei tietoa" : props.segmentdata.update.Lumi.Nimi}
          </Typography>
          <Typography variant="body2" className={classes.snowInfoTexts} align="center" component="p">
            {props.segmentdata.update === null ? "Ei kuvausta" : props.segmentdata.update.Teksti}
          </Typography>
          </Box>

          <IconButton 
            className={classes.editButton}
            onClick={openUpdate}
          >
            <EditIcon />
            <Typography variant="button">Päivitä</Typography>
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
      // Kirjautumattoman käyttäjän näkymät (muokkaustoimintoa ei ole)
      return (
        <div className="info">
          <IconButton aria-label="close" className={classes.close} onClick={() => closeShownSegment()}>
            <CloseIcon />
          </IconButton>

          {/* <Avatar aria-label="segment_info" className={classes.avatar}>
            {props.segmentdata.Nimi.charAt(0).toUpperCase()}
          </Avatar> */}

          <Box className={classes.textBox} >

            <Typography variant="h5" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei nimitietoa" : props.segmentdata.Nimi}
            </Typography>
            {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei tietoa pohjamaastosta" : props.segmentdata.Maasto}
            </Typography> */}
            <Box className={classes.snowLogo}>
              {props.segmentdata.update !== null ? <img src={process.env.PUBLIC_URL + "/lumilogot/" + props.segmentdata.update.Lumi.ID + ".png"}/> : <div />}
            </Box>
            <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null ? "Ei tietoa" : props.segmentdata.update.Lumi.Nimi}
            </Typography>
            <Typography variant="body2" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null ? "Ei kuvausta" : props.segmentdata.update.Teksti}
            </Typography>
          </Box>
          
        </div>
      );
    }
  // mikäli segmenttidataa ei ole saatavilla, ei yritetä renderöidä mitään näkyvää
  } else {
    return <div className="info" />;
  }
};
 
export default Info;