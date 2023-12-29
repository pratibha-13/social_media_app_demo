require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require("cors")
passport = require('passport')
app.use(passport.initialize());


const mongoose = require("mongoose")
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser);

const role = require('./role/route')
const auth = require('./auth/route')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.xml());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const { MONGOUSER, MONGOPASSWORD, MONGOURL, MONGODB } = process.env
const connectionURL = "mongodb://127.0.0.1:27017/social_media_demo_db"

mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true })

const option = {
  swaggerOption: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'api-key',
          in: 'header',
          name: 'x-access-token'
        },
        value: ''
      }
    }
  }
}
app.use(cors())
app.use((req, res, next)=>{
  try {
      console.log(`${req.method} ${req.path}`);
      next();
  } catch (error) {
      console.log(error)
  }
})
app.use('/auth', auth)
app.use('/role', role);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, option))

app.listen(PORT, () => console.log(`server running at port ${PORT}`))