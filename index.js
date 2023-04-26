const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const app = express();
const port = 5001;

const secret = "314781839wjd3190u4edn13ed381de31bfu13ii"


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://productmanagement:productmanagement@cluster0.tch1uh5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET route
app.get("/health", (req, res) => {
  res.json({ Health: "Okay" });
});


app.post("/login", async(req, res) => {
  const { username, password } = req.body
  // Select the database and collection
  const db = client.db('product-management');
  const users = db.collection('users');

  // Query for the user with the given username and password
  const user = await users.findOne({ username: username, password: password });

  // Return true if the user exists, false otherwise
  if (user) {
    const token = jwt.sign({ username }, secret);
    res.send({ authorized: true, accessToken: token });
  } else {
    res.send({ authorized: false });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
