// steps to install the packages
const createAdmin = require('./admin/adminAccount')
// loads .env file contents into process.env
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./database/dbConnection')

// create an express application
const foodAppServer = express()

foodAppServer.use(cors())
foodAppServer.use(express.json())
foodAppServer.use(router)
foodAppServer.use('/uploads',express.static('./uploads'))

createAdmin()

const PORT = 4000 || process.env.PORT

foodAppServer.listen(PORT,()=>{
    console.log(`foodAppServer started at port ${PORT} and waiting for client request!!! `);

})

// resolving get request to http://localhost:4000/, so it gives the log(above given console) to browser
foodAppServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:red;"> foodAppServer started at port and waiting for client request!!!</h1>`)
})