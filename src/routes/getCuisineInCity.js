const { getLatLongForCity } = require('../apis/geoLocation');
const zomatoApi = require('../apis/zomato');
const swiggyApi = require('../apis/swiggy');

module.exports = async (req, res, next) => {
    const { city, cuisine } = req.params;

    const restaurants = {
        city,
        cuisineName : cuisine,
        zomatoRestaurants:[],
        swiggyRestaurants:[]
    };

    const cords = getLatLongForCity(city);

    if(!cords) {
        return res.status(400).send('Invalid city');
    }

    restaurants.zomatoRestaurants = await zomatoApi.fetch(city, cuisine);
    restaurants.swiggyRestaurants = await swiggyApi.fetch(cords, cuisine);

    res.status(200).send(restaurants);
}
