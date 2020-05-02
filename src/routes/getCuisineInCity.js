const { getLatLongForCity } = require('../apis/geoLocation');
const zomatoApi = require('../apis/zomato');
const swiggyApi = require('../apis/swiggy');

module.exports = async (req, res, next) => {
    const { city, cuisine } = req.params;

    const restaurants = {
        city: null,
        cuisineName: null,
        zomatoRestaurants:[],
        swiggyRestaurants:[]
    };

    restaurants.city = city;
    restaurants.cuisineName = cuisine;

    const cords = getLatLongForCity(city);

    if(!cords) {
        return res.status(400).send('Invalid city');
    }

    await zomatoApi.fetch(city, cuisine, restaurants);
    await swiggyApi.fetch(cords, cuisine, restaurants);
    console.log('Done');
    res.status(200).send(restaurants);
}
