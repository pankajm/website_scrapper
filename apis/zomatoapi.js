/** Promise API to fetch zomato restaurants with parallel requests */

const axios = require('axios');
const cheerio = require('cheerio'); // For parsing HTML 
const async = require('async'); // For parallel processing of requests


function getZomatoRestaurants(zomatoUrl, cuisine){

  return new Promise((resolve, reject) => {
    console.log("Getting Zomato Restaurants");
    console.log(zomatoUrl);
    axios.get(zomatoUrl)
      .then((response) => {
        
        let $ = cheerio.load(response.data); // Loading response in cheerio to parse HTML
        let asyncArray = [];
        let zomatoRestaurantsData = [];
        $('.search-snippet-card').each((index, element) => {
          asyncArray.push(crawlZomato.bind(null, $(element).find('.result-title').attr('href')+'/order', $(element).find('.result-title').text().trim(), cuisine, zomatoRestaurantsData));
        });

        /** Sending parallel Request to each restarants to get cuisines  */
        async.parallel(asyncArray, (err, response) => {
          if(err)
            reject(err);
          console.log("Completed Scrapping !");
          resolve(zomatoRestaurantsData); 
        }) 
      })
      .catch((error) => {
        console.log('error in zomato api')
        reject(error);
      })
  })
}


function crawlZomato(url, restaurant, cuisine, restaurants, callback){
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

      restaurants.push(obj);
      console.log('Received data from ' + url);
      callback();
    })
    .catch((error) => {
      console.log("error occured in zomato async parallel");
      callback(error);
    })
}

module.exports.getZomatoRestaurants = getZomatoRestaurants;