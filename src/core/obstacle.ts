import * as THREE from 'three';

/* eslint-disable max-len */

class Obstacle {
  x: number;

  y: number;

  z: number;

  speed: number;

  geometry: THREE.BoxGeometry;

  material: THREE.MeshBasicMaterial;

  mesh: THREE.Mesh;

  constructor() {
    this.x = Math.random() * 10; // TODO: Clamp it to the plane
    this.y = 0; // Fixed y position
    this.z = 0; // Initial z position
    this.speed = Math.random() * 0.5 + 0.5; // Random speed between 0.5 and 1

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z); // initial position of the mesh
  }

  update() {
    this.z += this.speed; // Move towards positive z-axis
    this.mesh.position.z = this.z; // Update the z position of the mesh
  }
}

export default Obstacle;
