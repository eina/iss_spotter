const { nextISSTimesForMyLocation } = require('./iss');

const printPasses = (dates) => {
  dates.forEach(x => {
    const { risetime, duration } = x;
    const datetime = new Date(0);
    datetime.setUTCSeconds(risetime);

    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  });
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work", error);
  }
  printPasses(passTimes);
});