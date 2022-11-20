const mysql = require("mysql");

const db_config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "CRUD-Data",
};

var connection;

function handleConnect() {
  connection = mysql.createConnection(db_config);
  connection.connect((err) => {
    if (err) {
      console.log("error connecting", err);
    }
    console.log("database " + connection.state);
  });
}

handleConnect();

module.exports = connection;
