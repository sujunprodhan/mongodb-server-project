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
    // await client.connect();
    const db = client.db('smartband');
    const propertyCollection = db.collection('realagent');
    const userCollection = db.collection('users');
    const reviewCollection = db.collection('reviews');

    // user collection
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // Review funtion
    // Add review
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne({
        ...review,
        createdAt: new Date(),
      });
      res.send(result);
    });

    app.get('/reviews/:propertyId', async (req, res) => {
      const propertyId = req.params.propertyId;
      const query = { propertyId: propertyId };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });
    app.get('/reviews', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    // Add Property
    app.post('/realagent', async (req, res) => {
      const data = req.body;
      const result = await propertyCollection.insertOne(data);
      res.send(result);
    });

    // udate propety
    app.put('/realagent/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const update = { $set: data };
      const query = { _id: new ObjectId(id) };
      const result = await propertyCollection.updateOne(query, update);
      res.send(result);
    });
    // Dlete Property
    app.delete('/realagent/:id', async(req, res)=>{
      const id = req.params.id;
      const objectId = new ObjectId(id)
      const filter = {_id: objectId}
      const result= await propertyCollection.deleteOne(filter)
      res.send(result)
    });

    // latest product
    app.get('/latestproperty', async (req, res) => {
      const result = await propertyCollection.find().sort({ createdAt: 'desc' }).limit(6).toArray()
     res.send(result)
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

    // await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res)=>{
  res.send('Running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
