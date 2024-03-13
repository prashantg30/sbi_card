const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT ||  4001;
const routes= require('./routes');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended :true}))
app.use(routes)
app.listen(PORT , ()=>console.log(`Server is Running On the ${PORT}`));