var createError = require("http-errors");
var express = require("express");
var path = require("path");
// var cookieParser = require("cookie-parser");
// var cookieSession = require("cookie-session");
var logger = require("morgan");
// debugger;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// var getArticleList = require("./routes/get_article_list");
var app = express();
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  req.method == "OPTIONS" ? res.send(200) : next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// add req.session cookie support
// app.use(cookieSession({ secret: "666" }));

// do something with the session

// custom middleware
// function count(req, res, next) {
//   // console.log(req);
//   req.session.count = (req.session.count || 0) + 1;
//   // res.send("viewed " + req.session.count + " times\n");
//   next();
// }
var mysqlpage = require("./routes/mysqlpage");
var mysqlDesigner = require("./routes/mysqlDesigner");
// var fileRouter = require("./routes/file");
// var mutipart = require("./routes/mutipart");
// var params = require("./routes/params");
// var routeSeparation = require("./routes/route-separation");
// var search = require("./routes/search/index");
app.use("/article", mysqlpage);
app.use("/smform", mysqlDesigner);
// app.use("/file", fileRouter);
// app.use("/mutipart", mutipart);
// app.use("/params", params);
// app.use("/render", routeSeparation);
// app.use("/search", search);
// var cookies = require("./routes/cookies");
// app.use(count);
// app.use("/cookies", cookies);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.get("/comment", function (req, res, next) {
  // next(createError(403, "catch 403 and forward to error handler..."));
  res.send("响应comment成功!");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "catch 404 and forward to error handler"));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
