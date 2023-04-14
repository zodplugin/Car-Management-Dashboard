const express = require('express');
const path = require("path");
const { car } = require('./models')
const bodyParser = require('body-parser');
const routes = require('./routes');
const axios = require('axios');
const { Op } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment')

// upload file
const imagekit = require('./lib/imageKit')
const upload1 = require('./middleware/uploader')

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


app.get('/', async(req, res) => {
    const protocol = req.protocol
    const host = req.hostname
    const url = req.originalUrl
    const port = process.env.PORT || PORT
    const fullUrl = `${protocol}://${host}:${port}${url}`
    try {
        if (req.query.category === 'large') {
            const cars = await car.findAll({
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    category: {
                        [Op.eq]: 'large'
                    }
                }
            })
            res.render("index", {
                fullUrl: fullUrl,
                data: cars,
                moment
            })
        } else if (req.query.category === 'medium') {
            const cars = await car.findAll({
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    category: {
                        [Op.eq]: 'medium'
                    }
                }
            })
            res.render("index", {
                fullUrl: fullUrl,
                data: cars,
                moment
            })
        } else if (req.query.category === 'small') {
            const cars = await car.findAll({
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    category: {
                        [Op.eq]: 'small'
                    }
                }
            })
            res.render("index", {
                fullUrl: fullUrl,
                data: cars,
                moment
            })
        } else {
            const cars = await car.findAll()
            res.render("index", {
                fullUrl: fullUrl,
                data: cars,
                moment
            })
        }
    } catch {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
})

app.get('/create', (req, res) => {
    res.render("create")
})

app.post('/add', upload, async(req, res) => {
    const { name, price, category } = req.body
        // const file = req.file


    // const split = file.originalname.split('.')
    // const ext = split[split.length - 1]

    // const img = await imagekit.upload({
    //     file: file.buffer,
    //     fileName: `IMG-${Date.now()}.${ext}`
    // })

    await car.create({
        name,
        price,
        category,
        image: req.file.filename
    })
    res.redirect('/')

})

app.get('/edit/:id', async(req, res) => {
    const carDetail = await axios.get(`http://localhost:3000/api/cars/${req.params.id}`)
    res.render("edit", {
        car: carDetail
    })

})
app.get('/delete/:id', async(req, res) => {
    await car.destroy({
        where: {
            id: req.params.id
        }
    })

    res.redirect('/')
})

app.post('/update/:id', upload, async(req, res) => {
    const { name, price, category, image } = req.body
    console.log(name, price, category, image)
    const findCar = car.findAll({
        where: {
            id: req.params.id
        }
    })

    if (image !== findCar.image) {

        fs.unlink("./images/" + findCar.image, (err) => {
            if (err) {
                throw err
            }
        })
        await car.update({
            name: name,
            price: price,
            category: category,
            image: req.file.filename
        }, {
            where: {
                id: req.params.id
            }
        })

        res.redirect('/')

    } else {

        console.log("Wahh sama")
        await car.update({
            name: name,
            price: price,
            category: category,
        }, {
            where: {
                id: req.params.id
            }
        })
        res.redirect('/')

    }

})

app.use(routes)

app.listen(PORT, () => {
    console.log(`App running on localhost: http://localhost:${PORT}`)
})