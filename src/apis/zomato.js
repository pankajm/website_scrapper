const axios = require('axios');
const Promise = require('bluebird'); // For parallel processing of requests
const cheerio = require('cheerio'); // For parsing HTML

const crawlZomato = function (url, restaurant, cuisine, restaurants){
   console.log('Fetching ',url);
   return axios.get(url)
        .then((response) => {
            console.log('Received ', url);
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
            console.log('Finished ', url);
            return response;
        });
}

module.exports = {
    fetch: async (city, cuisine, restaurants) => {
        const url = `https://www.zomato.com/${city}/restaurants?q=${cuisine}`;
        console.log(url);
        const response = await axios.get(url);
        console.log('got zomato response');
        const $ = cheerio.load(response.data); // Loading response in cheerio to parse HTML
        const asyncArray = [];

        $('.search-snippet-card').each((index, element) => {
                asyncArray.push({
                    url: $(element).find('.result-title').attr('href') + '/order',
                    restaurant: $(element).find('.result-title').text().trim(),
                    cuisine,
                    restaurants
                });
        });

        /** Sending parallel Request to each restarants to get cuisines  */
        return Promise.map(asyncArray, (request) => {
            return crawlZomato(request.url, request.restaurant, request.cuisine, request.restaurants);
        }, {concurrency: 10});
    }
}
