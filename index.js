const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app= express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.B_USER}:${process.env.B_PASS}@branddb.q1xc0gb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection= client.db('userDB').collection('users');
    const dataCollection= client.db('userDB').collection('data');

    app.post('/data', async(req, res)=>{
            const data= req.body;
            console.log("User", data);
            const result = await dataCollection.insertOne(data);
            console.log(result);
            res.send(result);
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('Hello welcome to the very desired assignment project')
})


app.listen(port, ()=>{
    console.log("The server is running is on the port of ", port);
})






