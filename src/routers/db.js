/**
API kutsut tietokannalle

Päivityshistoria
Arttu Lakkala 15.11 Lisätty segmentit delete
*/
const express = require('express');
const router = express.Router();
const database = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
            res.status(200);
          });
          }
          else{
            console.log("incorrect password");
            res.json("incorrect password");
            res.status(401);
          }
        });
      }
      else
      {
        console.log("user not found");
        res.json("No User Found");
        res.status(401);
      }
  });
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
    res.json({ errors: errors.array() });
    res.status(400);
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
        res.json("Insert was succesfull");
        res.status(204);
      });
    });
  }
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
        res.status(200);        
      });
  });
});


router.get('/segments/update/:id', function(req, res) {
  database.query(
  `SELECT Tekija, Segmentti, Lumilaatu, Teksti, Aika 
  FROM Paivitykset
  WHERE (Segmentti, Aika)
  IN
  (SELECT Segmentti, MAX(Aika)
    FROM Paivitykset
    WHERE Segmentti = ?
    GROUP BY(Segmentti)
   )
   ORDER BY(Segmentti)`,
  [
  req.params.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      console.log(result)
      res.json(result);
      res.status(200);
  });
});



router.get('/segments/update', function(req, res) {
  database.query(
  `SELECT Tekija, Segmentti, Lumilaatu, Teksti, Aika 
  FROM Paivitykset
  WHERE (Segmentti, Aika)
  IN
  (SELECT Segmentti, MAX(Aika)
    FROM Paivitykset
    GROUP BY(Segmentti)
   )
   ORDER BY(Segmentti)`,
  function (err, result, fields) {
      if (err) throw err;
      console.log(result)
      res.json(result);
      res.status(200);
  });
});




router.get('/lumilaadut', function(req, res) {
    database.query('Select * FROM Lumilaadut', 
    function(err, result, fields) {
      if (err) throw err;
      console.log(result)
      res.json(result);
      res.status(200);
    });
});

//Salasanan tarkistus

router.use(function(req, res, next) {

  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      var token = req.headers.authorization.slice(7, req.headers.authorization.length);
      jwt.verify(token, secret, function(err, decoded) {
        if(err) res.sendStatus(401);
        else {
          //jos kirjautuminen onnistuu kirjataan jääneet tiedot muistiin
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }

});


router.get('/users', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

router.get('/user', function(req, res) {
  database.query('SELECT * FROM Kayttajat WHERE ID = ?',
  [
    req.decoded.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

router.put('/user/:id', function(req, res) {
  bcrypt.hash(req.body.Salasana, saltRounds, function(err, hash) {
    database.query(
    `UPDATE Kayttajat
     SET 
     Etunimi=?,
     Sukunimi=?,
     Sähköposti=?,
     Salasana=?
     WHERE ID = ?
    `,
    [
      req.body.Etunimi,
      req.body.Sukunimi,
      req.body.Sähköposti,
      hash,
      req.params.id
    ],
    function (err, result, fields) {
        if (err) throw err;
        res.json(result);
        res.status(200);
    });
  });
});



router.delete('/user/:id', function(req, res) {
  database.query(
  `DELETE FROM Kayttajat
   WHERE ID = ?
  `,
  [
    req.params.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});

router.post('/segments/update/:id', function(req, res) {

  if(req.body.Segmentti != req.params.id)
  {
    res.json("Segmentti numerot eivät täsmää");
    res.status(400);
  }
  database.query('INSERT INTO Paivitykset(Tekija, Segmentti, Lumilaatu, Teksti, Aika) VALUES(?, ?, ?, ?, NOW())',
  [
    req.decoded.id,
    req.body.Segmentti,
    req.body.Lumilaatu,
    req.body.Teksti
  ],
  function (err, points, fields) {
    if (err) throw err;
    res.json("Insert was succesfull");
    res.status(204);
  });
});

router.delete('/segments/:id', function(req, res) {
  database.query(
  `DELETE FROM Segmentit
   WHERE ID = ?
  `,
  [
    req.params.id
  ],
  function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});


module.exports = router;