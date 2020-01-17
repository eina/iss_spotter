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

    const data = JSON.parse(body);
    const { data: { latitude, longitude } } = data;
    callback(null, {latitude, longitude});
    return;
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};