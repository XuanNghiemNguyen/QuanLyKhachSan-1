const createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
require('express-async-errors')

const mongoose = require('mongoose')
const app = express();

const cors = require('cors')
app.use(cors())
dotenv.config()

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

/* GET home page. */
app.get("/", async (req, res) => {
  res.redirect('dashboard')
});
app.use("/dashboard", require("./routes/dashboard"));
app.use("/room-categories", require("./routes/room-categories"));
app.use("/rooms", require("./routes/rooms"));


//connect database
const uri = `mongodb+srv://XuanNghiemNguyen:${process.env.DB_PASSWORD}@cluster0-6az1w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const connectDatabase = () => {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(
    uri,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    },
    (err) => {
      if (err) {
        console.log(
          'Failed to connect to mongo on startup - retrying in 2 sec',
          err
        )
        setTimeout(connectDatabase, 2000)
      } else {
        console.log('Connected to the database')
      }
    }
  )
}
connectDatabase()
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
