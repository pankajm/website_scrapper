const express = require('express');
const router = express.Router();
const getCuisineInCityRoute = require('./src/routes/getCuisineInCity');

router.get('/:city/:cuisine', getCuisineInCityRoute);

module.exports = router;
