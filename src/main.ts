/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable one-var */
/* eslint-disable default-case */
/*
 * main.js
 * Author: Roshan Poudel, Sherry Khan
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { insideWorld } from './core/sceneSetup';
import { Character } from './core/character';
import Obstacle from './core/obstacle';
import { showGameOverScreen } from './core/gamescreens';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let cameraControls: OrbitControls;
let gameCharacter: Character;

let obstacles: Obstacle[] = [];
let lastObstacleSpawnTime = 0;
let obstacleSpawnInterval = 1; // seconds
let globalSpeedFactor = 1;
let lastSpeedIncreaseTime = 0;
const speedIncreaseInterval = 10; // seconds

const minimumInterval = 0.2; // seconds
const intervalDecrement = 0.01; // decrease interval by this amount
const removalPositionZ = 2100; // z-position at which obstacles are removed

// Collision detection
let isGameOver = false; // Flag to track the game over state

// CLOCK
const clock = new THREE.Clock();

// CONTROLLING ANIMATION
let animationId: number;
let animationActive = true; // Flag to control the animation loop

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
  const path = '/assets/textures/skybox/';
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
  gameCharacter = new Character();
  const characterMesh = gameCharacter.getMesh();
  characterMesh.position.set(0, -1100, 1800);
  // characterMesh.position.y = -1300;
  characterMesh.castShadow = true;
  scene.add(characterMesh);

  // Create and add obstacles to the scene
  // createObstacles();
  createObstacle();
}

// OBSTACLES
function createObstacle() {
  const initialSpeed = 10 * globalSpeedFactor;
  const obstacle = new Obstacle(initialSpeed);
  obstacles.push(obstacle);
  scene.add(obstacle.mesh);
}

function init() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // CAMERA
  camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 100, 20000);
  camera.position.set(0, 0, 3700);

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

function render() {
  const delta = clock.getDelta();
  cameraControls.update(delta);
  renderer.render(scene, camera);
}

function animate() {
  if (!animationActive) {
    render();
    animationId = null;
    return; // Stop the function if the animation should no longer be active
  }

  update(clock.getDelta());
  render();
  animationId = requestAnimationFrame(animate); // Request next frame if animation is still active
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const KEY_UP = 38;
const KEY_W = 87;
const KEY_LEFT = 37;
const KEY_A = 65;
const KEY_DOWN = 40;
const KEY_S = 83;
const KEY_RIGHT = 39;
const KEY_D = 68;
const KEY_SPACE = 32;
const KEY_R = 82;
// const FPS = 60;

const keyState = Object.create(null) as Record<number, boolean>;

window.addEventListener('keydown', (event: KeyboardEvent) => {
  keyState[event.keyCode] = true;
  // Check if the spacebar is pressed
  if (event.keyCode === KEY_SPACE) {
    gameCharacter.jump(); // Call the jump method on character object
  }
  if (event.keyCode === KEY_R) {
    isGameOver = false; // Reset the game over flag

    // Reset game stats
    lastObstacleSpawnTime = 0;
    obstacleSpawnInterval = 1;
    globalSpeedFactor = 1;
    lastSpeedIncreaseTime = 0;
    obstacles = [];
    scene.remove(...scene.children); // Remove all children from the scene
    fillScene(); // Add all the objects back to the scene

    // Only restart the animation loop if it is not already running
    // This prevents multiple animation loops from running simultaneously
    if (!animationId) {
      animationActive = true; // Set the flag to start the animation loop
      animate(); // Start the animation loop
    }
  }
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  keyState[event.keyCode] = false;
});

function update(delta: number) {
  let x = 0,
    z = 0;

  if (keyState[KEY_UP] || keyState[KEY_W]) z += 1;
  if (keyState[KEY_LEFT] || keyState[KEY_A]) x += 1;
  if (keyState[KEY_DOWN] || keyState[KEY_S]) z += -1;
  if (keyState[KEY_RIGHT] || keyState[KEY_D]) x += -1;

  gameCharacter.move(x, z);
  gameCharacter.update(delta); // Update the character for jumping and other animations

  // Spawn new obstacles at decreasing intervals
  if (clock.getElapsedTime() - lastObstacleSpawnTime > obstacleSpawnInterval) {
    createObstacle();
    lastObstacleSpawnTime = clock.getElapsedTime();
    obstacleSpawnInterval = Math.max(minimumInterval, obstacleSpawnInterval - intervalDecrement);
  }

  // Increase global speed factor periodically
  if (clock.getElapsedTime() - lastSpeedIncreaseTime > speedIncreaseInterval) {
    globalSpeedFactor += 0.1;
    lastSpeedIncreaseTime = clock.getElapsedTime();
  }

  // move and remove obstacles
  obstacles = obstacles.filter((obstacle) => {
    obstacle.move();
    if (obstacle.mesh.position.z > removalPositionZ) {
      scene.remove(obstacle.mesh);
      return false;
    }
    return true;
  });

  // Collision detection
  obstacles.forEach((obstacle) => {
    const distance = obstacle.mesh.position.distanceTo(gameCharacter.getMesh().position);

    if (distance < 150) {
      isGameOver = true; // Set the flag to true if a collision is detected
      gameOver();
    }
  });

  // render();
}

function gameOver() {
  showGameOverScreen(scene); // Display the game over screen
  render(); // Update the rendering immediately
  animationActive = false; // Set the flag to stop the animation loop
  cancelAnimationFrame(animationId); // Cancel the current animation frame request
}

// setInterval(update, 1000 / FPS); // update FPS times per second

init();
fillScene();
addToDOM();
animate();
