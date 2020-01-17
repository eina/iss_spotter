const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res && res.statusCode !== 200)  {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const data = JSON.parse(body);
    callback(null, data && data.ip);
    return;
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request('https://ipvigilante.com/' + ip, (err, res, body) => {
    if (err) {
      callback(err, null);
    }

    if (res && res.statusCode !== 200)  {
      const msg = `Status Code ${res.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { data: { latitude, longitude } } = JSON.parse(body);
    callback(null, {latitude, longitude});
    return;
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  const { latitude: lat, longitude: lon } = coords;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;
  request(url, (err, res, body) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (res && res.statusCode !== 200)  {
      const msg = `Status Code ${res.statusCode} when fetching coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const data = JSON.parse(body);
    const { response } = data;
    callback(null, response);
    return;
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation
};