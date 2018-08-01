import axios from 'axios';
import data from '../beach_data.json';

import { init as initScene } from './scene';
import { init as initSphere } from './sphere';
import { init as initPaths } from './paths';

export default function initGlobe(container) {
  initScene(container);
  initSphere();
  const coords = data.map(beach => {
      const startLat = 53.3588;
      const startLng = 2.2727;
      const location = beach["location"].split(",");
      const endLat = parseFloat(location[0]);
      const endLng = parseFloat(location[1]);
      const beachName = beach["beach_name"];
      const beachFlightPrice = beach["best_flight_price"];
      const beachAccommodationPrice = beach["best_accommodation_price"];
      const beachRegion = beach["region"];
      const beachCategory = beach["beach_value"];
      return [ startLat, startLng, endLat, endLng, beachCategory, beachName, beachFlightPrice,
          beachAccommodationPrice, beachRegion ];

  });

  initPaths(coords);
  // axios.get('https://ecomfe.github.io/echarts-examples/public/data/asset/data/flights.json')
  //   .then(res => {
  //     const routes = res.data.routes.slice(0, 10000);
  //     const airports = res.data.airports;
  //     const coords = routes.map(route => {
  //       const startAirport = airports[route[1]];
  //       const endAirport = airports[route[2]];
  //       const startLat = startAirport[4];
  //       const startLng = startAirport[3];
  //       const endLat = endAirport[4];
  //       const endLng = endAirport[3];
  //       return [ startLat, startLng, endLat, endLng ];
  //     });
  //
  //     initPaths(coords);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
}
