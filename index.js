const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const customerRoute = require("./routes/customer");
const buffetRoute = require("./routes/buffet");
const airportRoute = require("./routes/airport");
const userRoute = require("./routes/users");
const jwt = require("./routes/jwt");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const errorHandler = require("./utils/errorHandler");
const myReqLogger = require('./utils/requestLogger');
const multer = require("multer");
const path = require("path");
var cors = require('cors');
var cookieParser = require('cookie-parser');


dotenv.config();
app.use(express.json());
app.use(myReqLogger);
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

// const errorHandler = (err, req, res, next) => {
//   var statusCode = err.statusCode || 500;
//  // logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//   //console.error(err);
  
//   res.status(statusCode).send(err.message);
// next();
// }
//app.use(cors());
app.use(cors({ origin: true, credentials: true }))
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/airport", airportRoute);

app.use("/api/buffet", buffetRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/jwt", jwt);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/customer", customerRoute);
app.use(errorHandler);
app.listen("5000", () => {
  console.log("Backend is running at Port 5000");
});

