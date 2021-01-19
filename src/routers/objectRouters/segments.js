/**
API kutsut Segmenteille

Päivityshistoria
Arttu Lakkala 15.11 Lisätty segmentit delete
Arttu Lakkala 22.11 Lisätty segmentit muutos
Arttu Lakkala 25.11 Lisätty segmentit lisäys
Arttu Lakkala 1.12  Rollback lisätty segmentin muutokseen
Arttu Lakkala 5.12 Rollback lisätty segmentin lisäykseen
Arttu Lakkala 5.12 uudelleennimettiin api.js
-----------------------------------------
Arttu Lakkala 6.12 Refactoroitiin API:sta

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

router.delete('/:id', function(req, res) {
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

//Segmentin tietojen muutos
router.put('/:id', function(req, res) {
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

//segmentin teko
router.post('/', function(req, res) {
  database.beginTransaction(function(err){ 
    database.query('INSERT INTO Segmentit(Nimi, Maasto, Lumivyöryvaara, On_Alasegmentti) VALUES(?,?,?,?)',
    [
      req.body.Nimi,
      req.body.Maasto,
      req.body.Lumivyöryvaara,
      req.body.On_Alasegmentti
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
                 uusiID,
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