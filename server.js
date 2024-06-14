const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const dB = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    user: "postgres", //add your user name for the database here
    port: 5432, // add your port number here
    password: "", //add your correct password in here
    database: "smart_brain", //add your database name you created here
  },
});

/*dB.select("*")
  .table("users")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log("Error: ", err));*/

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, dB, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, dB, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, dB);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, dB);
});

app.post("/imageURL", (req, res) => {
  image.handleAPICall(req, res);
});

app.listen(3001, () => {
  console.log("App is running on port 3001");
});
