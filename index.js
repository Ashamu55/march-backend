const express = require('express');
require("dotenv").config();
let port = process.env.PORT
const app = express();
const cors = require('cors')
const userRouter = require("./Routes/User.Route")
const mongoose = require('mongoose');
let uri = process.env.URL
// const userModel = require("./Models/user.model")


app.use(cors())
app.use(express.json({limit: "50mb"}));
app.use("/student", userRouter)
app.use(express.urlencoded({ extended: true, limit:"50mb" }));
// app.use("/about", userRouter)

app.get('/', (req, res) => {
   res.send('Welcome');
   console.log("Welcome");
})



app.listen(port, ()=>{
      mongoose.connect(uri)
         .then(()=>{
            console.log(`server listening on port ${port} and database is connected successfully`) ;
         })
         .catch((error)=>{
               console.log(error);
         })
})