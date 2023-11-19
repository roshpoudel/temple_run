// This file contains function to create the objects for the game inside the textured 3D world.
// Path: src/core/sceneSetup.js

// function to create inside world

let groundPlane;

function createGroundPlane(texture) {
  let groundGeometry = new THREE.PlaneGeometry(2000, 4000);
  let groundMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, map: texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  if (!groundMaterial.map) {
    console.log('Texture not applied to material');
  }
  let ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2.2;
  ground.position.y = -100;
  ground.receiveShadow = true;
  return ground;
}

function insideWorld(scene) {
  let loader = new THREE.TextureLoader();
  loader.load("../assets/textures/groundplane/floor.jpg");

  loader.addEventListener("load", function (e) {
    const texture = e.content;
    if (!texture) {
      console.log('Texture loading failed');
      return;
    }
    console.log('Texture loaded successfully', texture);
    groundPlane = createGroundPlane(texture);
    scene.add(groundPlane);
    console.log('Ground plane added to scene');
  });

  loader.addEventListener("error", console.error.bind(console));
}
