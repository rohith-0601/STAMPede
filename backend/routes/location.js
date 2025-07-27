const express = require('express');
const { updateLocation, getAllLocations, sendAlert } = require('../controllers/LocationController');
const router = express.Router();


router.post('/', updateLocation);
router.get('/all', getAllLocations);
router.post('/alert', sendAlert);

module.exports = router;
