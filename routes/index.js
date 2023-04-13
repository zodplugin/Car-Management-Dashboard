const carController = require('../controllers/carController')
const router = require('express').Router()

router.get('/api/cars', carController.getCars)
router.get('/api/cars/search', carController.searchCar)
router.get('/api/cars/:id', carController.getCarById)
router.put('/api/cars/:id', carController.editCar)
router.delete('/api/cars/:id', carController.deleteCar)
router.post('/api/cars', carController.createCar)




module.exports = router;