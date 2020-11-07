const express = require('express');
const router = express.Router();
const database = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  //KÄYTÄ TÄTÄ PERUS BCRYPT EI TOIMI
//alusta salaukset
const saltRounds = 15;
const secret = "Lumihiriv0"
//alusta tarkistus
const { body, validationResult } = require('express-validator');


router.post('/user/login', function(req, res) {
  database.query('SELECT * FROM Kayttajat WHERE Sähköposti = ?',[req.body.Sähköposti], function (err, result, fields) {
      if (err) throw err;
      if(result.length == 1){
        user = result[0];
        bcrypt.compare(req.body.Salasana, user.Salasana, function(err, login) {
          if (login) {
          jwt.sign({ id: user.ID, Sahkoposti: user.Sähköposti }, secret, { algorithm: 'HS256' }, function(err, token) {
            console.log(token);
            res.json({ token: token }); 
          });
          }
          else{
            res.json("incorrect password");
          }
        });
      }
      else
      {
        res.json("No User Found");
      }
  });
  
  //res.json(req.body);
});

router.post('/user',
  [
  // tarkista sähköposti
  body('Sähköposti').isEmail().withMessage("Ei toimiva shäköposti"),
  
  body('Etunimi').exists().withMessage("Puuttuva etunimi"),
  body('Sukunimi').exists().withMessage("Puuttuva sukunimi"),
 
  // tarkista salasanan pituus
  body('Salasana').isLength({ min: 7 }).withMessage("Salasanan oltava vähintään 7 merkkiä")
  ]
  ,function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }
  
  else{
    //salataan salasana
    bcrypt.hash(req.body.Salasana, saltRounds, function(err, hash) {
      database.query('INSERT INTO Kayttajat(Etunimi, Sukunimi, Sähköposti, Salasana) VALUES(?, ?, ?, ?)',
      [
        req.body.Etunimi,
        req.body.Sukunimi,
        req.body.Sähköposti,
        hash
      ],
      function (err, points, fields) {
        if (err) throw err;
        return res.json("Insert was succesfull");
      });
    });
  }
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
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
        res.json(result);   
      });
  });
});



module.exports = router;