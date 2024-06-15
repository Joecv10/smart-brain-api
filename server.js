const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const dotenv = require("dotenv");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const dB = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DB_URL, //localhost
    ssl: { rejectUnauthorized: false },
    host: process.env.DB_HOST,
    user: process.env.DB_USER, //add your user name for the database here
    port: process.env.DB_PORT, // add your port number here
    password: process.env.DB_PASSWORD, //add your correct password in here
    database: process.env.DB_NAME, //add your database name you created here
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

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
