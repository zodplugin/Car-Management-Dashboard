const carController = require('../controllers/carController')
const router = require('express').Router()

router.get('/cars', carController.getCars)
router.get('/cars/search', carController.searchCar)
router.get('/cars/:id', carController.getCarById)
router.put('/cars/:id', carController.editCar)
router.delete('/cars/:id', carController.deleteCar)
router.post('/cars', carController.createCar)




module.exports = router;