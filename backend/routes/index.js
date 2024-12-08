const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// users Routes

router.post('/login', authController.login);
router.get('/users', userController.listUsers);

// Vehicle Routes
router.get('/vehicles', vehicleController.listVehicles); 
router.post('/vehicles', vehicleController.addVehicle);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.removeVehicle);

// Booking Routes
router.get('/bookings', bookingController.listReservations); 
router.post('/bookings', bookingController.createReservation);
router.put('/bookings/:id', bookingController.updateReservation);
router.delete('/bookings/:id', bookingController.cancelReservation);

module.exports = router;
