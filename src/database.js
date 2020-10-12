var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "testi",
  password: "testpass",
  database: "Pallas"
});

con.connect(function(err) {
  if (err) throw err;
});

module.exports = con;