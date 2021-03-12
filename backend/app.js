require("dotenv").config();

const mongoose = require("mongoose");
const express=require("express");
const app=express();
const cors=require("cors");

const authroute=require("./routes/auth");
const userroute=require("./routes/user");
const itemroute=require("./routes/item");


//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  }).catch(()=>{
      console.log("failed to connect db");
  });

  app.use(cors());
  app.use(express.json());                      //mw  express->[routes]->error
  app.use('/api', authroute);
  app.use('/api', userroute);
  app.use('/api', itemroute);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});