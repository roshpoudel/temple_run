/* eslint-disable max-len */
// This file contains function to create the objects for the game inside the textured 3D world.
// Path: src/core/sceneSetup.js

import * as THREE from 'three';
import { Scene, Texture } from 'three';

// function to create inside world

let groundPlane;

function createGroundPlane(texture: Texture) {
  const groundGeometry = new THREE.PlaneGeometry(2000, 4000);
  const groundMaterial = new THREE.MeshPhongMaterial({
    map: texture, side: THREE.DoubleSide, transparent: false, opacity: 1, shininess: 30,
  });
  if (!groundMaterial.map) {
    console.log('Texture not applied to material');
  }
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1200;
  ground.receiveShadow = true;
  return ground;
}

export function insideWorld(scene: Scene) {
  const loader = new THREE.TextureLoader();

  // for build version --> '/pouder0/CS360/Project6_Alpha/dist/assets/textures/groundplane/floor.png'
  // for dev version --> '/assets/textures/groundplane/floor.png

  const path = '/assets/textures/groundplane/floor.png';
  // const path = '/pouder0/CS360/Project6_Alpha/dist/assets/textures/groundplane/floor.png';

  loader.load(path, (texture) => {
    console.log('Texture loaded successfully', texture);
    groundPlane = createGroundPlane(texture);
    scene.add(groundPlane);
    console.log('Ground plane added to scene');
  });
}
