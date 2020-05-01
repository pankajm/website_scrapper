var http = require('http');
var express = require('express');
var request = require('request');
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

app.post('/api/crawl', (req, res, next) => {

  console.log('api hit');

  let city = req.body.city;
  let cuisine = req.body.cuisine;
  console.log("city and cuisine "+city + " "+cuisine);
  let url = `https://www.zomato.com/${city}/restaurants?q=${cuisine}`;
  console.log(url);
  
  axios.get(url)
    .then((response) => {
      let restaurantsArray = [];
      console.log('Got the response');  
      let $ = cheerio.load(response.data);
      $('.search-snippet-card').each((index, element) => {
        let obj = {};
        obj.restaurantName = $(element).find('.result-title').text();
        obj.price = $(element).find('.res-cost').text();
        obj.cuisine = $(element).find('.search-page-text a').text();
        restaurantsArray.push(obj);
      });
      console.log(restaurantsArray);
      return res.status(200).send(restaurantsArray);
    })
    .catch((error) => {
      console.log('error occured');
      console.log(error);
    });
})