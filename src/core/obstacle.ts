import * as THREE from 'three';

/* eslint-disable max-len */

class Obstacle {
  x: number;

  y: number;

  z: number;

  speed: number;

  geometry: THREE.SphereGeometry;

  material: THREE.MeshBasicMaterial;

  mesh: THREE.Mesh;

  constructor(speed: number) {
    const minX = -800;
    const maxX = 800;
    this.x = Math.random() * (maxX - minX) + minX; // TODO: Clamp it to the plane
    this.y = -1050; // Fixed y position
    this.z = -2000; // Initial z position
    this.speed = speed; // Initial speed

    this.geometry = new THREE.SphereGeometry(100);
    const randomColor = Math.random() * 0xffffff; // Generate a random color
    this.material = new THREE.MeshBasicMaterial({ color: randomColor });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z); // initial position of the mesh
  }

  move() {
    this.z += this.speed; // Move towards positive z-axis
    this.mesh.position.z = this.z; // Update the z position of the mesh
  }

  increaseSpeed(factor: number) {
    this.speed *= factor; // Increase speed by a factor
  }
}

export default Obstacle;
