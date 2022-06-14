// // connection.js file
// const mongoose = require("mongoose");
// const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/dbtest", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// conn.on("open", () => {
//   console.log("打开 mongodb 连接");
// });
// conn.on("err", (err) => {
//   console.log("err:" + err);
// });

// module.exports = conn; //commonJs 语法，导出conn模块。

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "vuedesigner",
});

connection.connect();
console.log("打开 mysql 连接");
module.exports = connection; //commonJs 语法，导出connection模块。
// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })

// connection.end()
