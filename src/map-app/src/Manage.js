/**
Segmenttien hallintanäkymä
Tarkoituksena listata segmentit, mahdollisuus suodattaa niitä hakemalla,
muokata, poistaa, lisätä.

Luonut: Markku Nirkkonen 26.11.2020

Viimeisin päivitys 26.11.2020
Pohja, segmenttien listaus, ei vielä muuta toiminnallisuutta

**/

import * as React from "react";
// import EditIcon from '@material-ui/icons/Edit';
// import IconButton from '@material-ui/core/IconButton';
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
                    />
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




