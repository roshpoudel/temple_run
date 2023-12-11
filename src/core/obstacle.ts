import * as THREE from 'three';
import { Scene, Texture } from 'three';

/* eslint-disable max-len */
const loader = new THREE.TextureLoader();

const path = '/assets/textures/obstacles/neonflame.jpeg';
// const path = '/pouder0/CS360/Project6_Alpha/dist/assets/textures/obstacles/neonflame.jpeg';

class Obstacle {
  x: number;

  y: number;

  z: number;

  speed: number;

  geometry: THREE.SphereGeometry;

  material: THREE.MeshBasicMaterial;

  mesh: THREE.Mesh;

  constructor(speed: number, onLoadCallback: (texture: THREE.Texture) => void) {
    const minX = -950;
    const maxX = 950;
    this.x = Math.random() * (maxX - minX) + minX;
    this.y = -1100; // Fixed y position
    this.z = -2000; // Initial z position
    this.speed = speed; // Initial speed

    this.geometry = new THREE.SphereGeometry(100);
    // Load the texture asynchronously
    loader.load(path, (texture) => {
      // Texture loaded callback
      texture.wrapS = THREE.MirroredRepeatWrapping;
      texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.repeat.set(2, 2);
      this.material = new THREE.MeshBasicMaterial({ map: texture }); // Apply the texture
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(this.x, this.y, this.z); // Set initial position

      // Call the callback function to indicate the obstacle is ready
      if (onLoadCallback) {
        onLoadCallback(this);
      }
    });
  }

  move() {
    if (this.material.map) {
      this.material.map.offset.y += 0.01;
    }
    this.z += this.speed; // Move towards positive z-axis
    this.mesh.position.z = this.z; // Update the z position of the mesh
  }

  increaseSpeed(factor: number) {
    this.speed *= factor; // Increase speed by a factor
  }
}

export default Obstacle;
