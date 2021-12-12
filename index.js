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

    // Get multiple Products from the database
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });
    // Add Products  API To the database
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.json(result);
    });
    // DELETE PRODUCT on Products API
    app.delete("/product/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);

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
