const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = 3000;

require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cruduser.c6e8c0q.mongodb.net/?appName=Cruduser`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db('smartband');
    const propertyCollection = db.collection('realagent');
    const userCollection = db.collection('users');

    // user collection
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // Add Property
    app.post('/realagent', async (req, res) => {
      const data = req.body;
      const result = await propertyCollection.insertOne(data);
      res.send(result);
    });

    // latest product
    app.get('/latestproperty', async (req, res) => {
      const cursor = propertyCollection.find().sort({ price: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get api and all product find and findOne
    app.get('/realagent', async (req, res) => {
      const result = await propertyCollection?.find()?.toArray();
      res.send(result);
    });

    // post methord
    // insert, insertOne
    app.get('/realagent/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.findOne(query);
      res.send(result);
    });

    // update property
    app.get('/propertyCollection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.findOne(query);

      res.send(result);
    });

    // Update methord
    app.put('/propertyCollection/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);

      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.updateOne(query);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
