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
  if (req.query.key) {
    obj.key = req.query.key;
  }
  // 富查询条件，对象格式，键值对，下面为查询 name 为 lisi 的记录
  connection.query("SELECT * FROM livecode ", function (err, rows, fields) {
    if (err) throw err;
    res.send({ data: rows, status: "SELECT成功了" });
    // connection.end();
  });
});
router.post("/insert", function (req, res, next) {
  // debugger;

  // var _id = UUID.v1();
  var viewId = UUID.v1();
  var post = {
    // _id: _id,
    viewId: viewId,
    name: req.body.name,
    key: req.body.key,
  };
  connection.query(
    // `INSERT INTO livecode ("name","key","_id","viewId") VALUES ("${req.body.name}", "${req.body.key}", "${_id}", "${viewId}")`,
    "INSERT INTO livecode SET ?",
    post,
    function (err, rows, fields) {
      if (err) throw err;
      res.send({ data: rows, status: "insert成功了" });
      // connection.end();
    }
  );
});
router.post("/remote", function (req, res, next) {
  connection.query(
    `DELETE FROM livecode WHERE _id="${req.body._id}"`,
    function (err, rows, fields) {
      if (err) throw err;
      res.send({ data: rows, status: "insert成功了" });
      // connection.end();
    }
  );
});
router.post("/update", function (req, res, next) {
  var sql =
    "update livecode set javascript=? , css=?, templateView=?, descp=? where viewId=?";
  var update_value = [
    req.body.javascript,
    req.body.css,
    req.body.templateView,
    req.body.descp,
    req.body.viewId,
  ];
  connection.query(sql, update_value, function (error, rows, fields) {
    if (error) throw error;
    res.send({ data: rows, status: "update成功了" });
    connection.end();
  });
});
module.exports = router;
