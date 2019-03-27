var mysql = require('promise-mysql');

module.exports = {
  dbConnect () {
    return mysql.createConnection({
      host: '35.222.140.147',
      user: "root",
      password: "password",
      database: "icompute"
    });
  }
}
