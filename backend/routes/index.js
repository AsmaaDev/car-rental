const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

// users Routes

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/users', userController.listUsers);
router.get('/user-profile/:userId', userController.fetchUserProfile);
router.put('/update-profile/:userId', userController.updateUserProfile);

router.post('/user-bookings', userController.listUserBookings);

// Vehicle Routes
router.get('/vehicles', vehicleController.listVehicles); 
router.post('/vehicles', vehicleController.addVehicle);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.removeVehicle);

// Booking Routes
router.get('/bookings', bookingController.listReservations); 
router.post('/bookings', bookingController.createReservation);
router.put('/bookings/:id', bookingController.updateReservation);
router.put('/cancel-booking/:id', bookingController.cancelReservation);

module.exports = router;
