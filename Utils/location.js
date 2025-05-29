const axios = require('axios');
const ExpressError = require('./ExpressError');


const API_KEY = 'AlzaSyEnpq7m2Gj4Cxsk6NgvcXYYesYttmtJLVb';


async function getCoordsForAddress(address) {
    const response = await axios.get(`https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new ExpressError(422, "Could not find address for specific location!");
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
};

module.exports = getCoordsForAddress;