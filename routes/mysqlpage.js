var express = require("express");
var UUID = require("uuid");
var router = express.Router();
const connection = require("../dbmysql/connection");
router.get("/", function (req, res, next) {
  res.send("响应成功!");
});

router.get("/query", function (req, res, next) {
  // debugger;
  var obj = {};
  if (req.query.name) {
    obj.name = req.query.name;
  }
  if (req.query.age) {
    obj.age = req.query.age;
  }
  // 富查询条件，对象格式，键值对，下面为查询 name 为 lisi 的记录
  connection.query("SELECT * FROM USER ", function (err, rows, fields) {
    if (err) throw err;
    res.send({ data: rows, status: "insert成功了" });
    // connection.end();
  });
});
router.post("/insert", function (req, res, next) {
  // debugger;

  var _id = UUID.v1();
  connection.query(
    `INSERT INTO USER VALUES ("${req.body.name}", "${req.body.age}", "${_id}")`,
    function (err, rows, fields) {
      if (err) throw err;
      res.send({ data: rows, status: "insert成功了" });
      // connection.end();
    }
  );
});
router.post("/remote", function (req, res, next) {
  connection.query(
    `DELETE FROM USER WHERE _id="${req.body._id}"`,
    function (err, rows, fields) {
      if (err) throw err;
      res.send({ data: rows, status: "insert成功了" });
      // connection.end();
    }
  );
});
router.post("/update", function (req, res, next) {
  connection.query(
    `UPDATE USER SET name = "${req.body.name}", age= "${req.body.age}" WHERE _id="${req.body._id}"`,
    function (err, rows, fields) {
      if (err) throw err;
      res.send({ data: rows, status: "insert成功了" });
      // connection.end();
    }
  );
});
module.exports = router;
