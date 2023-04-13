const express = require('express');
const path = require("path");
const { cars } = require('./models')
const bodyParser = require('body-parser');
const routes = require('./routes');
const { default: axios } = require('axios');
const { Op } = require('sequelize');

// http server
const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// set view engine
app.set("views", __dirname + "/views")
app.set("view engine", 'ejs')

//public + controller
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "controller")))

app.get('/', (req, res) => {
    res.render("index")
})

app.get('/create', (req, res) => {
    res.render("create")
})

app.get('/edit', (req, res) => {
    res.render("edit")
})

app.use(routes)

app.listen(PORT, () => {
    console.log(`App running on localhost: http://localhost:${PORT}`)
})