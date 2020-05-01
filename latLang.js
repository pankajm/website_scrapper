
/** Temporarily The latitude longitude values are hardocoded for following 3 cities 
 *  due to Google APIs issue
 *  More cities can be added in following object
 */


module.exports = function getLatLng(city){
    
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