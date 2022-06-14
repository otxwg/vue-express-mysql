var express = require("express");
var router = express.Router();
const StudentModel = require("../db/StudentModel");
router.get("/", function (req, res, next) {
  res.send("响应成功!");
});

router.get("/query", function (req, res, next) {
  debugger;
  var obj = {};
  if (req.query.name) {
    obj.name = req.query.name;
  }
  if (req.query.age) {
    obj.age = req.query.age;
  }
  // 富查询条件，对象格式，键值对，下面为查询 name 为 lisi 的记录
  StudentModel.find(obj).then((doc) => {
    res.send({ data: doc, status: "query成功了" });
  });
});
router.post("/insert", function (req, res, next) {
  // 通过实例化model创建文档
  let studentDoc = new StudentModel(req.body);
  // 将文档插入到数据库，save方法返回一个Promise对象。
  studentDoc.save().then((doc) => {
    console.log(doc);
    res.send({ data: doc, status: "insert成功了" });
  });
});
router.post("/remote", function (req, res, next) {
  // 下面把name为lisi的记录删除
  StudentModel.remove(req.body).then((result) => {
    console.log(result);
    res.send({ data: result, status: "remote成功了" });
  });
});
router.post("/update", function (req, res, next) {
  // 下面把name为lisi的记录，将他的age修改为80
  let doc = { name: req.body.name, age: req.body.age || 0 };
  StudentModel.updateOne({ _id: req.body._id }, { $set: doc }).then(
    (result) => {
      console.log(result);
      res.send({ data: result, status: "update成功了" });
    },
    (err) => {
      console.log(result);
      res.status(500).send({ data: result, status: err });
    }
  );
});
module.exports = router;
