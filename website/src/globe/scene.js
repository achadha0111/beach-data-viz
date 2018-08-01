import * as THREE from 'three';
import Hammer from 'hammerjs';
import { clamp } from './utils';
import { GLOBE_RADIUS, PI_TWO } from './constants';
import _ from 'lodash';

// import { TubeAnim, TubeStatic, CurveStatic, CurveAnim } from './curve';
// import { BoxStatic, BoxAnim } from './marker';
// import { play as playPathAnim } from './paths';

let _deltaX = 0;
let _deltaY = 0;
let _startX = 0;
let _startY = 0;

const CAMERA_Z_MIN = 300;
const CAMERA_Z_MAX = 1300;
let _cameraZ = 1100;

let mouseMesh;

export const scene = new THREE.Scene();
export const rootMesh = new THREE.Mesh(new THREE.Geometry());
export const paths = [];
export const pathInfo = [];

export function init(container) {
  const width = container.offsetWidth || window.innerWidth;
  const height = container.offsetHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // main animation loop
  const play = () => {
    // rotation
    rootMesh.rotation.x += Math.atan(_deltaY / _cameraZ) * 0.2;
    rootMesh.rotation.y += Math.atan(_deltaX / _cameraZ) * 0.2;
    if (rootMesh.rotation.x > PI_TWO) rootMesh.rotation.x -= PI_TWO;
    if (rootMesh.rotation.y > PI_TWO ) rootMesh.rotation.y -= PI_TWO;

    // zoom
    camera.position.z = _cameraZ;

    // animate paths
    // playPathAnim();

    // render
    renderer.render(scene, camera);

    // next frame
    requestAnimationFrame(play);
  };

  // init scene
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  camera.position.z = _cameraZ;

  let mouseGeometry = new THREE.SphereGeometry(1, 0, 0);

  let mouseMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff
  });

  mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);

  mouseMesh.position.z = -5;

  scene.add(mouseMesh);

  // add rootMesh to scene
  scene.add(rootMesh);



  // lighting
  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
  scene.add(light);

  // init event listeners
  initPanListener(container);
  initZoomListener(container);
  initResizeListener(container, camera, renderer);
  initMousedownListener(container, camera, renderer);
  initMouseoverListener(container, camera, renderer);

  // play scene
  play();
}

function reset() {
  _deltaX = 0;
  _deltaY = 0;
  _startX = 0;
  _startY = 0;
}

function initPanListener(container) {
  const mc = new Hammer.Manager(container);

  mc.add(new Hammer.Pan());

  mc.on('pan', (e) => {
    _deltaX = e.deltaX - _startX;
    _deltaY = e.deltaY - _startY;
  });

  mc.on('panstart', () => {
    reset();
    container.style.cursor = 'move';
  });

  mc.on('panend', () => {
    reset();
    container.style.cursor = 'auto';
  });
}

function initMouseoverListener(container, camera, renderer) {

    container.addEventListener('mousemove', (e) => {
        // e.preventDefault();

        const mouse = new THREE.Vector2();
        mouse.x = ( e.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        //
        // let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        // vector.unproject( camera );
        // let dir = vector.sub( camera.position ).normalize();
        // let distance = - camera.position.z / dir.z;
        // let pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        //
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse, camera );

        let intersects = raycaster.intersectObjects( paths );

        if ( intersects.length > 0 ) {
            container.style.cursor = 'pointer';

        } else {
            container.style.cursor = 'default';
        }
    })

}

function initMousedownListener(container, camera, renderer) {

  container.addEventListener('mousedown', (e) => {

        e.preventDefault();

        const mouse = new THREE.Vector3();
        mouse.x = ( e.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( e.clientY / renderer.domElement.clientHeight ) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera( mouse, camera );

        let intersects = raycaster.intersectObjects( paths );

      if ( intersects.length > 0 ) {
            const lineUUID = intersects[0].object.uuid;
            const lineIndex = _.findIndex(pathInfo, function(beach) { return beach.uuid === lineUUID});
            let beachNameSpan = document.getElementById("beach_name");
            let beachFlightSpan = document.getElementById("beach_flight_cost");
            let beachAccommodationSpan = document.getElementById("beach_accommodation_cost");
            let beachValueSpan = document.getElementById("beach_value_score");
            beachNameSpan.innerHTML = pathInfo[lineIndex]["beachName"];
            beachFlightSpan.innerHTML = pathInfo[lineIndex]["beachFlightPrice"];
            beachAccommodationSpan.innerHTML = pathInfo[lineIndex]["beachAccommodationPrice"];
            beachValueSpan.innerHTML = pathInfo[lineIndex]["beachValueScore"]
            //showTooltip(pathInfo[lineIndex], mouse.x, mouse.y);

        }
  })

}

function initZoomListener(container) {
  container.addEventListener('mousewheel', (e) => {
    const delta = e.wheelDeltaY * 0.2;
    _cameraZ = clamp(_cameraZ - delta, CAMERA_Z_MIN, CAMERA_Z_MAX);
  }, false);
}

function initResizeListener(container, camera, renderer) {
  window.addEventListener('resize', () => {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, false);
}
