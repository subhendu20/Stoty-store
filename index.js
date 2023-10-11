const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const middleware = require('body-parser')
const userLog = require('./Router/Userlog')
const storyLog = require('./Router/StoryLog')
const path = require('path')

const serverless = require('serverless-http');
const app = express()
const router = express.Router();
// ---------------------------------------------database connection------------------------------------------//
mongoose.connect(process.env.DB,{
          useNewUrlParser:true,
          
          useUnifiedTopology:true
}).then(()=>{
          console.log('connected')
}).catch((e)=>{
          console.log(e)
})

// -------------------------------------------------middleware------------------------------------------------//
app.use(middleware.urlencoded({ extended: false }));
app.use(middleware.json());
app.use('/auth',userLog)
app.use('/story',storyLog)


app.use(express.static(path.join(__dirname, './client/dist')))

app.use('*', function(req,res){
          res.sendFile(path.join(__dirname, './client/dist/index.html'))
})


app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);