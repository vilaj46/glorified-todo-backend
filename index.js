import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

// cd C:\"Program Files"\MongoDB\Server\4.4\bin

// Authentication Routes
import signup from "./routes/authentication/signup.js";
import login from "./routes/authentication/login.js";
import updateProfile from "./routes/authentication/updateProfile.js";

// Todos Route
import todos from "./routes/todos.js";

// App setup.
const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB setup.
const options = { useUnifiedTopology: true, useNewUrlParser: true };
mongoose
  .connect(
    `mongodb+srv://${process.env.MLAB_USER}:${process.env.MLAB_PW}@cluster0.lrx0x.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    // `mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PW}@ds259577.mlab.com:59577/glorified-todo`,
    options
  )
  .then(() => {
    console.log("Connected to Mlab MongoDB.");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.set("useFindAndModify", false);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!1");
});

// Authentication Routes
app.use("/signup", signup);
app.use("/login", login);
app.use("/users/:id/profile", updateProfile);

// Todos Route
app.use("/users/:userID/todos", todos);

const port = 8080;
app.listen(process.env.PORT || port, () => {
  console.log(`Server listening on local port: ${port}.`);
});
