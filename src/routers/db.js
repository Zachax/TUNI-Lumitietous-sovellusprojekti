const express = require('express');
const router = express.Router();
const database = require('./database');


router.get('/users', function(req, res) {
  database.query('SELECT * FROM Kayttajat', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

router.get('/points', function(req, res) {
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.json(result);
  });
});

router.get('/segments', function(req, res) {
  //get points from database
  database.query('SELECT * FROM Koordinaatit ORDER BY Segmentti', function (err, points, fields) {
      if (err) throw err;
      //transfere needed data to array
      const coordsForSegments = points.map((item) => {
        item.Sijainti.lat = item.Sijainti.x;
        item.Sijainti.lon = item.Sijainti.y;
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
        //add array as object property to result
        result.forEach(obj =>{
          obj.Points = pointsDict[obj.ID];
        });
        
        res.json(result);   
      });
  });
});

module.exports = router;