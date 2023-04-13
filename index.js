const express = require('express');
const path = require("path");
const { car } = require('./models')
const bodyParser = require('body-parser');
const routes = require('./routes');
const { default: axios } = require('axios');
const { Op } = require('sequelize');
const multer = require('multer')

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


// set storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// init upload

let upload = multer({
    storage: storage
}).single('image')


app.get('/', (req, res) => {
    const protocol = req.protocol
    const host = req.hostname
    const url = req.originalUrl
    const port = process.env.PORT || PORT
    const fullUrl = `${protocol}://${host}:${port}${url}`
    res.render("index", {
        fullUrl: fullUrl,
    })
})

app.get('/create', (req, res) => {
    res.render("create")
})

app.post('/add', upload, async(req, res) => {
    const { name, price, category } = req.body
    await car.create({
        name,
        price,
        category,
        image: req.file.filename
    })
    res.redirect('/')

})

app.get('/edit', (req, res) => {
    const protocol = req.protocol
    const host = req.hostname
    const url = req.originalUrl
    const port = process.env.PORT || PORT
    const fullUrl = `${protocol}://${host}:${port}${url}`
    res.render("edit", {
        fullUrl: fullUrl
    })
})

app.use(routes)

app.listen(PORT, () => {
    console.log(`App running on localhost: http://localhost:${PORT}`)
})