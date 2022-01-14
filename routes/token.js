var express = require("express");
var router = express.Router();
//设置cookie
router.get("/set", function (req, res) {
  res.cookie("userName", "111", { maxAge: 20 * 1000, httpOnly: true });
  res.send("设置cookie成功");
});

//获取cookie
router.get("/get", function (req, res) {
  console.log(req.cookies.userName);
  res.send("获取cookie成功，cookie为：" + req.cookies.userName);
});
module.exports = router;
