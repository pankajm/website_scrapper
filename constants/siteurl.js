function getSwiggyUrl(lat, lng, cuisine){
  return "https://www.swiggy.com/dapi/restaurants/search/"+"v2_2?lat="+lat+"&lng="+lng+"&str="+cuisine+"&withMenuItems=true&sld=false&non_partner_search=false&submitAction=ENTER";
}

function getZomatoUrl(city, cuisine){
  return `https://www.zomato.com/${city}/restaurants?q=${cuisine}`;
}

module.exports.getSwiggyUrl = getSwiggyUrl;
module.exports.getZomatoUrl = getZomatoUrl;