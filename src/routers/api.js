/**
API kutsut tietokannalle


Päivityshistoria
Arttu Lakkala 15.11 Lisätty segmentit delete
Arttu Lakkala 22.11 Lisätty segmentit muutos
Arttu Lakkala 25.11 Lisätty segmentit lisäys
Arttu Lakkala 1.12  Rollback lisätty segmentin muutokseen
Arttu Lakkala 5.12 Rollback lisätty segmentin lisäykseen
Arttu Lakkala 5.12 uudelleennimettiin api.js
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

//käyttäjä sisäänkirjautuminen
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



//segmenttien haku
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

//segmentin tuoreimman päivityksen haku
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


//päivitysten haku
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
//lumilaatujen haku
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

///////////////////////////////////////////////


//käyttäjien haku
router.get('/user/all', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      res.json(result);
      res.status(200);
  });
});
//käyttäjän haku
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

//käyttäjän tekeminen
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
    database.beginTransaction(function(err){
      if (err) throw err;
      bcrypt.hash(req.body.Salasana, saltRounds, function(err, hash) {
        database.query('INSERT INTO Kayttajat(Etunimi, Sukunimi, Sähköposti, Salasana) VALUES(?, ?, ?, ?)',
        [
          req.body.Etunimi,
          req.body.Sukunimi,
          req.body.Sähköposti,
          hash
        ],
        function (err, points, fields) {
          if (err){database.rollback(function(){throw err;})}
          database.commit(function(err){
            if(err){database.rollback(function(){throw err;});}
            res.json("Insert was succesfull");
            res.status(204);
           });
        });
      });
    });
  }
});




//käyttäjän tietojjen muutos
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


//käyttäjän poisto
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
//päivityksen luonti
router.post('/update/:id', function(req, res) {

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

//segmentin poisto
router.delete('/segment/:id', function(req, res) {
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

// segmentin tietojen muutos
router.put('/segment/:id', function(req, res) {
  if(req.params.id != req.body.ID)
  {
    res.json("Väärä ID body");        
    res.status(400);
  }
  else{
  database.beginTransaction(function(err){  
    database.query(
    `UPDATE Segmentit
       SET 
       Nimi=?,
       Maasto=?,
       Lumivyöryvaara=?
       WHERE ID = ?
      `,
    [
      req.body.Nimi,
      req.body.Maasto,
      req.body.Lumivyöryvaara,
      req.params.id
    ],
    function (err, result, fields) {
        if(err){database.rollback(function(){throw err;});}
        //poistetaan vanhat pisteet
        if(req.body.Points != null){
          database.query(
            `DELETE FROM Koordinaatit
             WHERE Segmentti = ?
            `,
            [req.params.id],
            function (err, result, fields) {
               if(err){database.rollback(function(){throw err;});}
               
               var i=0;
               var pointTable = req.body.Points;
               //tämä tehdään lopuksi
               
               function palautus(result, errorTable) {
                 //tallennetaan muutokset, jos ei virheitä
                 console.log(errorTable)
                 if (errorTable.length == 0)
                 {
                   database.commit(function(err){
                     if(err){database.rollback(function(){throw err;});}
                     res.json(result); 
                     res.status(200); 
                   });
                 }
                 //muuten perutaan
                 else
                 {
                   database.rollback(function(){
                     res.json(errorTable);
                     res.status(200);
                    });
                 }
               }
               
               var errorTable = [];
               pointTable.forEach((obj,i) => {
                 database.query('INSERT INTO Koordinaatit(Segmentti, Jarjestys, Sijainti) VALUES(?, ?, ST_GeomFromText(\'POINT(? ?)\'))',
                 [
                   req.params.id,
                   i,
                   obj.lat,
                   obj.lng,
                 ],
                 function (err, result, fields) {
                   if(err){
                     errorTable.push(err);
                   }
                   i++;
                   console.log(i);
                   //tapahtuu kun viimeinen kierros on käyty
                   if(i==pointTable.length) palautus(result, errorTable);
                 });
             });
        });
        }
        //mikäli pisteitä ei tarvitse muuttaa
        else{
        database.commit(function(err){
          if(err){database.rollback(function(){throw err;});}
          res.json(result);        
          res.status(200);
        });
        }
    });
  });
  }
});


// segmentin lisääminen
router.post('/segment/', function(req, res) {
  database.beginTransaction(function(err){ 
    database.query('INSERT INTO Segmentit(Nimi, Maasto, Lumivyöryvaara) VALUES(?,?,?)',
    [
      req.body.Nimi,
      req.body.Maasto,
      req.body.Lumivyöryvaara,
    ],
    function (err, result, fields) {
           if(err){database.rollback(function(){throw err;});}
           
           var i=0;
           var pointTable = req.body.Points;
           var uusiID = result.insertId;
           //tämä tehdään lopuksi
           function palautus(result, errorTable) {
             //tallennetaan muutokset, jos ei virheitä
             console.log(errorTable)
             if (errorTable.length == 0)
             {
               database.commit(function(err){
                 if(err){database.rollback(function(){throw err;});}
                 res.json(result); 
                 res.status(200); 
               });
             }
             //muuten perutaan
             else
             {
               database.rollback(function(){
                 res.json(errorTable);
                 res.status(200);
                });
             }
           }
           var errorTable = [];
           pointTable.forEach((obj,i) => {
               database.query('INSERT INTO Koordinaatit(Segmentti, Jarjestys, Sijainti) VALUES(?, ?, ST_GeomFromText(\'POINT(? ?)\'))',
               [
                 req.params.id,
                 i,
                 obj.lat,
                 obj.lng,
               ],
               function (err, result, fields) {
                 if(err){
                   errorTable.push(err);
                 }
                 i++;
                 console.log(i);
                 //tapahtuu kun viimeinen kierros on käyty
                 if(i==pointTable.length) palautus(result, errorTable);
               });
           });
        });
    });
});


module.exports = router;


/*
router.get('/points', function(req, res) {
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});
*/