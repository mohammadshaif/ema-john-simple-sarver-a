const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });



app.get('/products',  (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
      const product = req.body;
      client.connect(err => {
      const collection = client.db("onlineStore").collection("products");
      collection.find().toArray ((err, documents)=>{
        if (err) {
          console.log(err); 
          res.status(500).send({massage:err});
        }else{
          res.send(documents);
        }
        
      }); 
      client.close();
    });
  })
  

  app.get('/product/:key', (req,res)=>{
      const key = req.params.key;
      
      client = new MongoClient(uri, { useNewUrlParser: true });
      const product = req.body;
      client.connect(err => {
      const collection = client.db("onlineStore").collection("products");
      collection.find({key}).toArray ((err, documents)=>{
        if (err) {
          console.log(err); 
          res.status(500).send({massage:err});
        }
        else{
          res.send(documents[0]);
        }
        
      }); 
      client.close();
    });
  })

 app.post('/getProductsBykey', (req,res)=>{
    const key = req.params.key;
    const productKeys = req.body;
    
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.find({key:{ $in:productKeys }}).toArray ((err, documents)=>{
      if (err) {
        console.log(err); 
        res.status(500).send({massage:err});
      }
      else{
        res.send(documents);
      }
      
      }); 
      client.close();
    });
})


app.post('/placeOrder', (req , res) =>{
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  console.log(orderDetails);
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    collection.insertOne(orderDetails,(err, result)=>{
      if (err) {
        console.log(err); 
        res.status(500).send({massage:err});
      }else{
        res.send(result.ops[0]);
      }
       
    }); 
    client.close();
  });
 
})


app.post('/addProduct', (req , res) =>{
  const product = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
    console.log(product);
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    collection.insert(product,(err, result)=>{
      if (err) {
        console.log(err); 
        res.status(500).send({massage:err});
      }else{
        res.send(result.ops[0]);
      }
       
    }); 
    client.close();
  });
 
})

  app.listen(3000 , ()=>console.log("Listenting  to port 3000"));