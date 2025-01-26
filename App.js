const express = require('express')
const app = express()
const cors = require("cors");
const mongoose = require('mongoose');
const authRouter = require('./Routes/auth.router');
const categoryRoutes = require('./Routes/category.router')
const subCategoryRoutes = require('./Routes/subcategory.router')
const productRoutes = require('./Routes/product.router')
const path = require("path");



app.use(express.json());
require('dotenv').config()
app.use(cors());


app.get('/',(req,resp)=>{
    resp.send('HELLO WORLD!!')
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", authRouter)
app.use('/', categoryRoutes);
app.use('/', subCategoryRoutes);
app.use('/', productRoutes);

 
app.listen(process.env.PORT ,async ()=>{
    try{
     await  mongoose.connect(process.env.MONGODB_URL);
     console.log('Connected to DB Sucessful')
    }
    catch{
        console.log('Connection failed With DB')
    }
    console.log(`Server Running On Port ${process.env.PORT}`)
})