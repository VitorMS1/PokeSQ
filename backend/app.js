const app = require('express')();
const consign = require('consign');
const cors = require('cors');
const bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.json())

const mongoose = require('mongoose')
const {mongoConn, knex} = require('./db/conn')
mongoConn()
app.db = knex
app.mongoose = mongoose

consign()
    .include('./middlewares')
    .then('./controllers/validator.js')
    .then('./models/crud.js')
    .then('./models')
    .then('./controllers')
    .then('./routes')
    .into(app)

app.listen(3000, () => {console.log('On')})