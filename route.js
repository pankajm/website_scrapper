const express = require('express');
const router = express.Router();
const axios = require('axios'); // For sending HTTP requests to Zomato and Swiggy servers
const async = require('async'); // For parallel processing of requests
const getLatLng = require('./latlang');
const cheerio = require('cheerio'); // For parsing HTML 
let restaurants; 


/** Get API for scrapping zomato and swiggy websites */
router.get('/:city/:cuisine', (req, res, next) => {

  restaurants = {
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

  let zomatoUrl = `https://www.zomato.com/${city}/restaurants?q=${cuisine}`;
  let swiggyUrl = "https://www.swiggy.com/dapi/restaurants/search/"+"v2_2?lat="+cords.lat+"&lng="+cords.lng+"&str="+cuisine+"&withMenuItems=true&sld=false&non_partner_search=false&submitAction=ENTER";


  /** Get Restaurants data from Swiggy */

  console.log("Getting Swiggy Restaurants");
  axios.get(swiggyUrl)
  .then((response) => {
    let swiggyRestaurants = response.data.data.restaurants[0].restaurants;

    swiggyRestaurants.forEach(element => {
      let obj = {};
      obj.restaurantName = element.name;
      obj.dishes = element.menuItems.map(obj => {
        return {
          cuisine : obj.name,
          price : obj.price / 100
        }
      });
      restaurants.swiggyRestaurants.push(obj);
    });
    
    /** Get Restaurants data from Zomato */ 

    console.log("Getting Zomato Restaurants");
    axios.get(zomatoUrl)
      .then((response) => {
        
        let $ = cheerio.load(response.data); // Loading response in cheerio to parse HTML
        let asyncArray = [];
        $('.search-snippet-card').each((index, element) => {
          asyncArray.push(crawlZomato.bind(null, $(element).find('.result-title').attr('href')+'/order', $(element).find('.result-title').text(), cuisine));
        });

        /** Sending parallel Request to each restarants to get cuisines  */
        async.parallel(asyncArray, (err, response) => {
          if(err)
            return res.status(500).send(err);
          console.log("Completed Scrapping !");
          return res.status(200).send(restaurants);      
        }) 
      })
      .catch((error) => {
        console.log('error in swiggy api')
        return res.status(500).send(error);
      })
    })
  })

  function crawlZomato(url, restaurant, cuisine, callback){
    axios.get(url)
      .then((response) => {
        let $ = cheerio.load(response.data);
        let obj = {};
        obj.restaurantName = restaurant;
        obj.dishes = [];

        $('.sc-1s0saks-9').each((index, element) => {
          let dish = {};
          dish.cuisine = $(element).find('.sc-1s0saks-11').text();
          dish.price = $(element).find('.sc-17hyc2s-1').text();
          if(dish.cuisine.toLowerCase().includes(cuisine.toLowerCase()))
            obj.dishes.push(dish);
        });

        restaurants.zomatoRestaurants.push(obj);
        callback();
      })
      .catch((error) => {
        console.log("error occured in zomato async parallel");
        callback(error);
      })
  }

  module.exports = router;