const axios = require('axios');
const Promise = require('bluebird'); // For parallel processing of requests

module.exports = {
    fetch : async (coords, cuisine, restaurants) => {
        const url = "https://www.swiggy.com/dapi/restaurants/search/"+"v2_2?lat="+coords.lat+"&lng="+coords.lng+"&str="+cuisine+"&withMenuItems=true&sld=false&non_partner_search=false&submitAction=ENTER";
        const response = await axios.get(url)
        const swiggyRestaurants = response.data.data.restaurants[0].restaurants;
        const swiggyRestaurantsData = [];
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

        restaurants.swiggyRestaurants = swiggyRestaurantsData;
    }
}
