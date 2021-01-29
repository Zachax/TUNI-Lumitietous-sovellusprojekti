const mysql = require('mysql2');

//modify if database changes
const con = mysql.createConnection({
  host: "localhost",
  user: "pallas",
  password: "testpass",
  database: "pallas"
});

module.exports = con;