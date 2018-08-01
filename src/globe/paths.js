import * as THREE from 'three';
import _ from 'lodash';
import Curve from './Curve';
import { rootMesh, paths, pathInfo } from './scene';
import { CURVE_COLOR_CAT_ONE, CURVE_COLOR_CAT_TWO, CURVE_COLOR_CAT_THREE,
    CURVE_COLOR_CAT_FOUR, CURVE_COLOR_CAT_FIVE, CURVE_COLOR_CAT_SIX, CURVE_COLOR_CAT_SEVEN } from './constants';

export function init(allCoords) {

  const curveMesh = new THREE.Mesh();

  allCoords.forEach(coords => {
    let pathColor = CURVE_COLOR_CAT_SEVEN;

    switch (coords[4]) {

        case "1":
          pathColor = CURVE_COLOR_CAT_ONE;
          break;
        case "2":
            pathColor = CURVE_COLOR_CAT_TWO;
            break;
        case "3":
            pathColor = CURVE_COLOR_CAT_THREE;
            break;
        case "4":
            pathColor = CURVE_COLOR_CAT_FOUR;
            break;
        case "5":
            pathColor = CURVE_COLOR_CAT_FIVE;
            break;
        case "6":
            pathColor = CURVE_COLOR_CAT_SIX;
            break;
        case "7":
            pathColor = CURVE_COLOR_CAT_SEVEN;
            break;

    }

    const material = new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        opacity: 0.6,
        transparent: true,
        color: pathColor
    });

    const curve = new Curve(coords, material);
    curveMesh.add(curve.mesh);
    paths.push(curve.mesh);
    let lineInfo = {};
    lineInfo["uuid"] = curve.mesh.uuid;
    lineInfo["beachName"] = coords[5];
    lineInfo["beachFlightPrice"] = coords[6];
    lineInfo["beachAccommodationPrice"] = coords[7];
    lineInfo["beachValueScore"] = coords[4];
    pathInfo.push(lineInfo);


  });

  rootMesh.add(curveMesh);
}