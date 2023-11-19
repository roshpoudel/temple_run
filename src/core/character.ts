import * as THREE from 'three';

/* eslint-disable max-classes-per-file */

/*
  * Class representing a part of the character
  * @param {THREE.Geometry} geometry - The geometry of the part
  * @param {THREE.Material} material - The material of the part
  * @param {Object} position - The position of the part with respect to the parent
  * @param {THREE.Object3D} parent - The parent of the part
  */
class CharacterPart {
  mesh: THREE.Mesh<any, any, THREE.Object3DEventMap>;

  constructor(geometry, material, position: { x: number, y: number, z: number }, parent) {
    this.mesh = new THREE.Mesh(geometry, material);
    if (position) {
      this.mesh.position.set(position.x, position.y, position.z);
    }
    if (parent) {
      parent.add(this.mesh);
    }
  }
}

/*
  * Class representing the character
  */
export class Character {
  character: any;

  constructor() {
    // Create a new Object3D to represent the character
    this.character = new THREE.Object3D();
    this.createBody();
  }

  // Method to create the body of the character
  createBody() {
    // Define dimensions and materials
    const w = 250; // Width of the character
    const h = 500; // Height of the character
    const d = 125; // Depth of the character
    const limbH = (3.0 / 8.0) * h; // Height of the limbs (3/8th of the character height)
    const headH = (2.0 / 8.0) * h; // Height of the head (2/8th of the character height)
    const limbW = (1.0 / 4.0) * w; // Width of the limbs (1/4th of the character width)
    const chestW = (1.0 / 2.0) * w; // Width of the chest (1/2th of the character width)
    const headW = (1.0 / 2.0) * w; // Width of the head (1/2th of the character width)
    const limbD = (1.0 / 2.0) * d; // Depth of the limbs (1/2th of the character depth)
    const headD = d + 20; // Depth of the head (little bigger the character depth)
    // Material for the character
    const characterMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      castShadow: true,
      specular: 0x009900,
      shininess: 30,
    });
    const limbG = new THREE.BoxGeometry(limbW, limbH, limbD); // Geometry for the limbs
    const chestG = new THREE.BoxGeometry(chestW, limbH, limbD); // Geometry for the chest
    const headG = new THREE.BoxGeometry(headW, headH, headD); // Geometry for the head

    // Create body parts
    const upperBody = new THREE.Object3D(); // Object representing the upper body
    const torso = new THREE.Object3D(); // Object representing the torso
    const legs = new THREE.Object3D(); // Object representing the legs

    // Create legs
    new CharacterPart(limbG, characterMaterial, { x: -0.8 * limbW, y: limbH, z: 0 }, legs); // Create left leg
    new CharacterPart(limbG, characterMaterial, { x: 0.8 * limbW + 0.1, y: limbH, z: 0 }, legs); // Create right leg

    // Create torso
    new CharacterPart(chestG, characterMaterial, { x: 0, y: 100, z: 0 }, torso); // Create torso

    // Create arms
    new CharacterPart(limbG, characterMaterial, { x: -0.6 * chestW - 0.5 * limbW - 0.1, y: 0.5 * limbH, z: 0 }, torso); // Create left arm
    new CharacterPart(limbG, characterMaterial, { x: 0.6 * chestW + 0.5 * limbW + 0.1, y: 0.5 * limbH, z: 0 }, torso); // Create right arm

    // Create head
    // Here we can add custom material for head if needed
    new CharacterPart(headG, characterMaterial, { x: 0, y: limbH * 0.5 + headH * 0.5 + 110, z: 0 }, upperBody); // Create head

    // Assemble character
    upperBody.add(torso); // Add torso to the upper body
    upperBody.position.y = limbH + (0.5 * limbH) + 0.1; // Set the position of the upper body
    this.character.add(upperBody); // Add upper body to the character
    this.character.add(legs); // Add legs to the character
  }

  // Method to get the character mesh
  getMesh() {
    return this.character;
  }
}
