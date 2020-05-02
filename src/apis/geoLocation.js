const CITY_MAP = {
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
};

module.exports = {
    getLatLongForCity: (city) => {
        return CITY_MAP[city];
    }
}
