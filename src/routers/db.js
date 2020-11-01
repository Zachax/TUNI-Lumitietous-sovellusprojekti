const express = require('express');
const router = express.Router();
const database = require('./database');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');  KÄYTÄ TÄTÄ PERUS BCRYPT EI TOIMI

const saltRounds = 15;
const secret = "Lumihiriv0"

router.post('/user/login', function(req, res) {
  database.query('SELECT * FROM Kayttajat WHERE Etunimi = ?',[req.body.Etunimi], function (err, result, fields) {
      if (err) throw err;
      if(result.length == 1){
        user = result[0];
        if(user.Salasana == req.body.Salasana){
          jwt.sign({ id: user.ID, Sahkoposti: user.Sähköposti }, secret, { algorithm: 'HS256' }, function(err, token) {
            console.log(token);
            res.json({ token: token }); 
          });
        }
        else{
          res.json("incorrect password");
        }
      }
      else
      {
        res.json("No User Found");
      }
  });
  
  //res.json(req.body);
});

router.get('/users', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});
/*
router.get('/points', function(req, res) {
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});
*/

router.get('/segments', function(req, res) {
  //get points from database
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, points, fields) {
      if (err) throw err;
      //transfere needed data to array
      const coordsForSegments = points.map((item) => {
        item.Sijainti.lat = item.Sijainti.x;
        item.Sijainti.lng = item.Sijainti.y;
        delete item.Sijainti.x;
        delete item.Sijainti.y;
        return [item.Segmentti, item.Sijainti];
      });
      //get segments from database
      database.query('SELECT * FROM Segmentit', function (err, result, fields) {
        pointsDict = []
        //create dictionary of arrays
        result.forEach(obj =>{
          pointsDict[obj.ID] = []
        });
        //Fill points to it
        coordsForSegments.forEach(obj =>{
          pointsDict[obj[0]].push(obj[1]);
        });
        //add arrays from dict to result as object properties
        result.forEach(obj =>{
          obj.Points = pointsDict[obj.ID];
        });
        
        res.json(result);   
      });
  });
});



module.exports = router;