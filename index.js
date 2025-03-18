const express = require('express')
//To create middleware to convert it to json
const app = express()
app.use(express.json());
const moongoose = require('mongoose');
const Product = require('./models/products');

const dotenv = require('dotenv');
dotenv.config();

app.listen(3000,() =>{
  console.log("Server running on port 3000");
});

app.get('/', function (req, res)  {
  res.send('This is a get method');
});

app.get('/api/products',async(req,res) =>{
  try{
    const products = await Product.find({});
    res.status(200).json(products);
  }
  catch(error){
    res.status(500).json({message : error.message});
  }
});

app.get('/api/products/:id',async(req,res) =>
{
  try{
  const {id} = req.params;
  const product = await Product.findById(id);
  res.status(200).json(product);
  }
  catch(error){
    res.status(500).json({message:error.message});
  }
});

app.post('/api/products',async(req,res) =>
{
  try{
    const product = await Product.create(req.body);
    res.status(200).json(product);
  }
  catch(error){
    res.status(500).json({message : error.message});
  }
});

app.put('/api/products/:id',async(req,res) =>
{
  try{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body);
    if(!product)
    {
      res.status(404).json({message:"Product not found in database"});
    }
    const updatedProduct = await Product.findById(id);
    res.status(200).json(updatedProduct);
  }
  catch(error){
    res.status(500).json({message : error.message});
  }
});

app.delete('/api/products/:id',async(req,res) =>
{
  try{
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({message:"Product not found"});
    }
    res.status(200).json({message : 'Product deleted successfully'});
  }
  catch(error){
    res.status(500).json({message : error.message});
  }
});

moongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log("Connection error",err);
})
