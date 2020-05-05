const express = require('express');
const router = express.Router();
const getLatLng = require('../constants/latLang');
const {getSwiggyUrl, getZomatoUrl} = require('../constants/siteurl');
const swiggyApi = require('../apis/swiggyapi');
const zomatoApi = require('../apis/zomatoapi');

/** Get API for scrapping zomato and swiggy websites */
router.get('/:city/:cuisine', (req, res, next) => {

  let restaurants = {
    city:null,
    cuisineName:null,
    zomatoRestaurants:[],
    swiggyRestaurants:[]
  };

  let city = req.params.city;
  let cuisine = req.params.cuisine;
  restaurants.city = city;
  restaurants.cuisineName = cuisine;

  let cords = getLatLng(city);
  const swiggyUrl = getSwiggyUrl(cords.lat, cords.lng, cuisine);
  const zomatoUrl = getZomatoUrl(city, cuisine);

  if(!cords)
    return res.status(400).send('Invalid city');

  /** Get Restaurants data from Swiggy */

  swiggyApi.getSwiggyRestaurants(swiggyUrl)
    .then((swiggyRestaurantsData) => {
      restaurants.swiggyRestaurants = swiggyRestaurantsData;

      /** Get Restaurants data from Zomato */ 

      zomatoApi.getZomatoRestaurants(zomatoUrl, cuisine)
        .then((zomatoRestaurantsData) => {
          restaurants.zomatoRestaurants = zomatoRestaurantsData;
          return res.status(200).send(restaurants);
        })
        .catch((error) => {
          console.log('error in Zomato api')
          return res.status(500).send(error);
        })
    })
    .catch((error) => {
      console.log('error in Swiggy api')
      return res.status(500).send(error);
    })
})

module.exports = router;