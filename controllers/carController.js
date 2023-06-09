const { car } = require('../models')


async function getCars(req, res) {
    try {
        const cars = await car.findAll()

        res.status(200).json({
            status: 'success',
            data: {
                cars
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

async function searchCar(req, res) {
    try {
        const car = await car.findAll({
            where: {
                name: {
                    [Op.endsWith]: req.query.name
                }
            }
        })

        res.status(200).json({
            status: 'success',
            data: {
                car
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

async function getCarById(req, res) {
    try {
        // Primary Key = PK
        const id = req.params.id;
        const data = await car.findByPk(id);

        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        })
    }
}

async function editCar(req, res) {
    try {
        const { name } = req.body;
        const id = req.params.id;

        await car.update({
            name
        }, {
            where: { id }
        })

        res.status(200).json({
            status: 'success',
            message: `data dari id ${id} nya berhasil berubah`
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

async function deleteCar(req, res) {
    try {
        const id = req.params.id
        await car.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            'status': 'success',
            'message': `data ${id} ini berhasil di hapus`
        })
    } catch (err) {
        res.status(400).message(err.message)
    }
}

async function createCar(req, res) {
    try {
        const { name, price, category, images } = req.body
        const newCar = await car.create({
            name,
            price,
            category,
            images
        })
        res.status(201).json({
            status: 'success',
            data: {
                product: newCar
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err.message
        })
    }
}

module.exports = {
    getCars,
    getCarById,
    searchCar,
    deleteCar,
    editCar,
    createCar,
}