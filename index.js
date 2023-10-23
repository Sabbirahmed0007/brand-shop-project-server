const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app= express();
const port = process.env.PORT || 5000;

////middlewares
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
    // await client.connect();
    client.connect();

    const userCollection= client.db('userDB').collection('users');
    const dataCollection= client.db('userDB').collection('data');
    const cartCollection= client.db('userDB').collection('cart');


    // create user from register from
    app.post('/users', async(req, res)=>{
        const user = req.body;
        console.log('user',user);
        const result = await userCollection.insertOne(user);
        console.log(result);
        res.send(result)
    })

    // add/ create data from add product
    app.post('/data', async(req, res)=>{
            const data= req.body;
            const result = await dataCollection.insertOne(data);
            console.log(result);
            res.send(result);
    })

    // display all data;
    app.get('/data', async(req, res)=>{
      const result= await dataCollection.find().toArray();
      console.log(result);
      res.send(result)

    })

    // get data according to brand

    app.get('/data/:brandName', async(req, res) =>{
      const brandData= req.params.brandName;
      console.log(brandData)
      const query= { brandName : new ObjectId(brandData)};
      const result= await dataCollection.find(query).toArray();
      console.log(result);
      res.send(result);
  })
    app.get('/singledata/:id', async(req, res)=>{
      const id= req.params.id;
      console.log(id)
      const query={ _id : new ObjectId(id)};
      const result=await dataCollection.findOne(query);
      console.log(result);
      res.send(result);
  })

  app.put('/data/:id', async(req, res)=>{
    const id= req.params.id;
    console.log(id);
    const filter= {_id: new ObjectId(id)};
    const options= {upsert: true};
    const updatedData= req.body;
    const currentdata={
      $set: {
        name: updatedData.name,
        brandName: updatedData.brandName,
        photo: updatedData.photo,
        category: updatedData.category,
        description: updatedData.description,
        price: updatedData.price,
        rating: updatedData.rating,
      }
    };
    const result= await dataCollection.updateOne(filter, currentdata, options);
    console.log(result)
    res.send(result);
  })

  ///show add to cart 
  app.get('/cart', async(req, res)=>{
      const result= await cartCollection.find().toArray();
      console.log(result);
      res.send(result)
  })

  //add to cart collection
  app.post('/cart', async(req, res)=>{
    const data= req.body;
    const result = await cartCollection.insertOne(data);
    console.log(result);
    res.send(result);

  })


  app.patch('/users', async(req, res)=>{

    const user = req.body;
    const filter= {email: user.email};
    const updatedDoc= {
        $set: {
            lastloggedAt: user.lastloggedAt,
        }
    };
    const result= await userCollection.updateOne(filter, updatedDoc)
    res.send(result);
})









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // client.db("admin").command({ ping: 1 });
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






