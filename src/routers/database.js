const mysql = require('mysql2');

//modify if database changes
const con = mysql.createConnection({
  host: "localhost",
  user: "testi",
  password: "testpass",
  database: "Pallas"
});

con.connect(function(err) {
  if (err) throw err;
});

module.exports = con;