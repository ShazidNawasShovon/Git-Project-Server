const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijm0a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Dream-Cars");
    const productsCollection = database.collection("Products");
    const usersCollection = database.collection("Users");
    const orderCollection = database.collection("Orders");
    const reviewsCollection = database.collection("Reviews");

    // ADD REVIEWS TO THE DATABASE
    app.post("/review", async (req, res) => {
      const reviews = req.body;
      console.log("hitting review", reviews);
      const result = await reviewsCollection.insertOne(reviews);
      res.json(result);
    });
    // GET ALL REVIEWS FROM DATABASE
    app.get("/home/review", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    });
    // Set An User Admin and Sent to the database
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // Find Admin to show many things
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // Put User login info in database
    app.post("/users", async (req, res) => {
      const user = req.body;
      result = await usersCollection.insertOne(user);
      res.json(result);
    });
    // check user info if found then ignore if not found then add user info to our database. this is work while use google popup login & emailPass login or register

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      result = await usersCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dream Car server");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
