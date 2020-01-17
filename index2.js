const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPasses = (dates) => {
  dates.forEach(x => {
    const { risetime, duration } = x;
    const datetime = new Date(0);
    datetime.setUTCSeconds(risetime);

    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  });
};

nextISSTimesForMyLocation()
  .then(passTimes => { printPasses(passTimes) })
  .catch(error => console.log("It didn't work :(", error.message));