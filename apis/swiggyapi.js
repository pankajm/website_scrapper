/** Promise API to fetch swiggy restaurants */

const axios = require('axios'); // For sending HTTP requests to Zomato and Swiggy servers

function getSwiggyRestaurants(swiggyUrl){

  return new Promise((resolve, reject) => {
    console.log("Getting Swiggy Restaurants");
    axios.get(swiggyUrl)
    .then((response) => {
      console.log('response is '+response);
      let swiggyRestaurants = response.data.data.restaurants[0].restaurants;
      let swiggyRestaurantsData = [];
      swiggyRestaurants.forEach(element => {
        let obj = {};
        obj.restaurantName = element.name;
        obj.dishes = element.menuItems.map(obj => {
          return {
            cuisine : obj.name,
            price : obj.price / 100
          }
        });
        swiggyRestaurantsData.push(obj);
      });
      resolve(swiggyRestaurantsData);
    })
    .catch((error) => {
      console.log('error in swiggy api')
      reject(error);
    })
  })
}

module.exports.getSwiggyRestaurants = getSwiggyRestaurants;