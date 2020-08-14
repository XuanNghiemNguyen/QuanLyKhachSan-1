const createError = require("http-errors")
const express = require("express")
const path = require("path")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const expressLayouts = require("express-ejs-layouts")
const logger = require("morgan")
const { isLogged, isAdmin } = require("./middlewares/authen")
require("express-async-errors")

const mongoose = require("mongoose")
const app = express()

const passport = require("passport")
const session = require("express-session")
const bodyParser = require("body-parser")
const flash = require("connect-flash")

const cors = require("cors")
app.use(cors())
app.use(logger("dev"))
dotenv.config()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(expressLayouts)

// PassportJs initialize
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: "hotelSecret",
    saveUninitialized: false,
    resave: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/* GET home page. */
app.use("/login", require("./routes/login"))
app.use("/forgot-password", require("./routes/forgot-password"))
app.use("/", isLogged, require("./routes/dashboard"))
app.use("/dashboard", isLogged, require("./routes/dashboard"))
app.use("/room-categories", isLogged, require("./routes/room-categories"))
app.use("/rooms", isLogged, require("./routes/rooms"))
app.use("/users", isLogged, require("./routes/users"))
app.use(
  "/customer-types",
  isLogged,
  isAdmin,
  require("./routes/customer-types")
)
app.use("/customers", isLogged, require("./routes/customers"))
app.use("/surcharges", isLogged, isAdmin, require("./routes/surcharges"))
app.use("/employees", isLogged, isAdmin, require("./routes/employees"))
app.use("/logout", isLogged, require("./routes/logout"))
app.use("/room-letters", isLogged, require("./routes/room-letters"))
app.use("/orders", isLogged, require("./routes/orders"))

//connect database
const uri = `mongodb+srv://XuanNghiemNguyen:${process.env.DB_PASSWORD}@cluster0-6az1w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const connectDatabase = () => {
  mongoose.set("useCreateIndex", true)
  mongoose.connect(
    uri,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err) => {
      if (err) {
        console.log(
          "Failed to connect to mongo on startup - retrying in 2 sec",
          err
        )
        setTimeout(connectDatabase, 2000)
      } else {
        console.log("Connected to the database")
      }
    }
  )
}
connectDatabase()
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  return res.render("error", { layout: false })
})

module.exports = app
