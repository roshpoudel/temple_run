/*
 * main.js
 * Author: Roshan Poudel, Sherry Khan
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { insideWorld } from './core/sceneSetup';

let camera: THREE.Camera; let scene: THREE.Scene; let
  renderer: THREE.WebGLRenderer;
let cameraControls: OrbitControls;

const clock = new THREE.Clock();

function fillScene() {
  scene = new THREE.Scene();

  // LIGHTS
  scene.add(new THREE.AmbientLight(0x333333));

  let light = new THREE.DirectionalLight(0xFFFFFF, 0.9);
  light.position.set(-1300, 700, 1240);
  light.castShadow = true;

  scene.add(light);

  light = new THREE.DirectionalLight(0xFFFFFF, 0.7);
  light.position.set(1000, -500, -1200);
  light.castShadow = true;

  scene.add(light);

  // MATERIALS
  const path = '../assets/textures/skybox/';
  const urls = [`${path}px.jpg`, `${path}nx.jpg`,
    `${path}py.jpg`, `${path}ny.jpg`,
    `${path}pz.jpg`, `${path}nz.jpg`];

  const textureCube = (new THREE.CubeTextureLoader()).load(urls);
  textureCube.format = THREE.RGBAFormat;

  const shader = THREE.ShaderLib.cube;
  shader.uniforms.tCube.value = textureCube;

  const skyMaterial = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(new THREE.BoxGeometry(5000, 5000, 5000), skyMaterial);
  scene.add(sky);

  // groundplane
  insideWorld(scene);

  // CHARACTER
  // Create and add Steve character to the scene
  // let gameCharacter = new Character();
  // let characterMesh = gameCharacter.getMesh();
  // characterMesh.position.set(0, 0, 0);
  // characterMesh.rotation.x = -Math.PI / 2.2;
  // characterMesh.position.y = -100;
  // characterMesh.receiveShadow = true;
  // scene.add(characterMesh);
}

function init() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // CAMERA
  camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 100, 20000);
  camera.position.set(0, 2000, 4000);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xffffff, 1.0);
  renderer.shadowMap.enabled = true;

  // CONTROLS
  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, -160, 0);

  // Screen Resize
  window.addEventListener('resize', onWindowResize, false);
}

// EVENT HANDLERS
function addToDOM() {
  const container = document.getElementById('container')!;
  const canvas = container.getElementsByTagName('canvas');
  if (canvas.length > 0) {
    container.removeChild(canvas[0]);
  }
  container.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
}

function onWindowResize() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// function createGround(texture) {
// let groundGeometry = new THREE.PlaneGeometry(2000, 4000);
// let groundMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, map: texture,
// side: THREE.DoubleSide, transparent: false, opacity: 1 });
// if (!groundMaterial.map) {
// console.log('Texture not applied to material');
// }
// let ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / 2.2;
// ground.position.y = -100;
// scene.add(ground);
// render();
// }

// //loading textures
// let loader = new THREE.TextureLoader();
// loader.load("../assets/textures/groundplane/floor.jpg", function (texture) {
// if (!texture) {
// console.log('Texture loading failed');
// return;
// }
// console.log('Texture loaded successfully');
// createGround(texture);
// });

init();
fillScene();
addToDOM();
animate();
