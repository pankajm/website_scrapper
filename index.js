var express = require('express');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var axios = require('axios');
var app = express();


var server = app.listen(3000, function() {
  console.log('Server listning on port 3000');
});

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.post('/api/crawl', async (req, res, next) => {

  let city = req.body.city;
  let cuisine = req.body.cuisine;
  let zomatoUrl = `https://www.zomato.com/${city}/restaurants?q=${cuisine}`;
  

  // Get data from Zomato

  console.log("Getting Zomato Restaurants");
  axios.get(zomatoUrl)
    .then((response) => {
      let restaurants = {
        zomato:[],
        swiggy:[]
      };
      let $ = cheerio.load(response.data);
      $('.search-snippet-card').each((index, element) => {
        let obj = {};
        obj.name = $(element).find('.result-title').text();
        obj.dishes = [];
        let dish = {};
        dish.price = $(element).find('.res-cost').text();
        dish.cuisine = $(element).find('.search-page-text a').text();
        obj.dishes.push(dish);
        restaurants.zomato.push(obj);
      });

      // Get data from Swiggy
      console.log("Getting Swiggy Restaurants");
      let cords = getLatLng(city);
      let swiggyUrl = "https://www.swiggy.com/dapi/restaurants/search/"+"v2_2?lat="+cords.lat+"&lng="+cords.lng+"&str="+cuisine+"&withMenuItems=true&sld=false&non_partner_search=false&submitAction=ENTER";

      axios.get(swiggyUrl)
      .then((response) => {
        let swiggyRestaurants = response.data.data.restaurants[0].restaurants;

        swiggyRestaurants.forEach(element => {
          let obj = {};
          obj.name = element.name;
          obj.dishes = element.menuItems.map(obj => {
            return {
              cuisine : obj.name,
              price : obj.price / 100
            }
          });
          restaurants.swiggy.push(obj);
        });

        console.log("Completed Scrapping !");
        return res.status(200).send(restaurants);
      })
      .catch((error)=>{
        console.log('error in swiggy api')
        return res.status(500).send(error);
      })
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
  })

  function getLatLng(city){
    
    let cities = {
      mumbai:{
        lat:"19.0759837",
        lng:"72.8776559"
      },
      nagpur:{
        lat:"21.1458004",
        lng:"79.0881546"
      },
      bangalore:{
        lat:"12.9715987",
        lng:"77.5945627"
      },
    }
    return cities[city];
  }