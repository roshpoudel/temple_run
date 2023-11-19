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
  ground.rotation.x = -Math.PI / 2.2;
  ground.position.y = -1000;
  ground.receiveShadow = true;
  return ground;
}

export function insideWorld(scene: Scene) {
  const loader = new THREE.TextureLoader();
  loader.load('/assets/textures/groundplane/floor.png', (texture) => {
    console.log('Texture loaded successfully', texture);
    groundPlane = createGroundPlane(texture);
    scene.add(groundPlane);
    console.log('Ground plane added to scene');
  });
}
