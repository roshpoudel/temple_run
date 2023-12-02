/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable max-len */

import * as THREE from 'three';
import { Pendulum } from './pendulum';

function pos(x: number, y: number, z: number) {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  return o;
}

/**
 * Represents a part of a character in the game.
 */
class CharacterPart {
  mesh: THREE.Mesh;

  /**
   * Creates a new CharacterPart instance.
   * @param geometry - The geometry of the character part.
   * @param material - The material of the character part.
   * @param position - The position of the character part.
   * @param joint - The joint object of the character part.
   * @param parent - The parent object of the character part.
   */
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, position: { x: number, y: number, z: number }, public joint: THREE.Object3D, parent: THREE.Object3D) {
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y, position.z);

    this.joint.add(this.mesh);
    if (parent) {
      parent.add(this.joint);
    }
  }

  /**
   * Rotates the character part.
   * @param x - The rotation value along the x-axis.
   * @param y - The rotation value along the y-axis.
   * @param z - The rotation value along the z-axis.
   */
  rotate(x: number, y: number, z: number) {
    this.joint.rotation.set(x, y, z);
  }
}

/**
 * This class represents a character in the game.
 */
export class Character {
  character: THREE.Object3D;
  leftLeg!: CharacterPart;
  rightLeg!: CharacterPart;
  leftArm!: CharacterPart;
  rightArm!: CharacterPart;

  pendulum: Pendulum;

  // following variables are used for animation of hands and legs
  dx = 0;
  dz = 0;

  // following variables are used for jumping
  jumpVelocity = 0; // Initial velocity of the jump
  isJumping = false;
  gravity = -9.8 * 150; // Gravity value
  jumpStartY!: number; // Initial starting position of the jump

  /**
   * Creates a new instance of the Character class.
   */
  constructor() {
    // Create a new Object3D to represent the character
    this.character = new THREE.Object3D();
    // experiment with the values of the pendulum
    this.pendulum = new Pendulum(-100, 0.5, 5);
    this.createBody();
  }

  // updateDirection(x: number, z: number) {
  //   this.directionVec.setX(x);
  //   this.directionVec.setZ(z);
  //   this.startWalkingAnimation();
  // }

  /**
   * Creates the body of the character.
   */
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
    const headD = d; // Depth of the head (little bigger the character depth)

    // Material for the character
    const characterMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      specular: 0x009900,
      shininess: 30,
    });

    const headGeometry = new THREE.BoxGeometry(headW, headH, headD);
    const chestGeometry = new THREE.BoxGeometry(chestW, limbH, limbD);
    const limbGeometry = new THREE.BoxGeometry(limbW, limbH, limbD);

    const upperBody = new THREE.Object3D();

    new CharacterPart(headGeometry, characterMaterial, { x: 0, y: limbH + headH + 40, z: 0 }, new THREE.Object3D(), upperBody);
    new CharacterPart(chestGeometry, characterMaterial, { x: 0, y: limbH, z: 0 }, new THREE.Object3D(), upperBody);

    this.leftArm = new CharacterPart(limbGeometry, characterMaterial, { x: -0.55 * (chestW + limbW), y: -limbH, z: 0 }, pos(0, limbH * 2, 0), upperBody);
    this.rightArm = new CharacterPart(limbGeometry, characterMaterial, { x: 0.55 * (chestW + limbW), y: -limbH, z: 0 }, pos(0, limbH * 2, 0), upperBody);

    this.leftLeg = new CharacterPart(limbGeometry, characterMaterial, { x: -0.55 * limbW, y: -limbH, z: 0 }, pos(0, limbH, 0), upperBody);
    this.rightLeg = new CharacterPart(limbGeometry, characterMaterial, { x: 0.55 * limbW, y: -limbH, z: 0 }, pos(0, limbH, 0), upperBody);

    this.character.add(upperBody);
  }

  /**
   * Returns the mesh representing the character.
   * @returns The character's mesh.
   */
  getMesh() {
    return this.character;
  }

  // move(dx: number, dz: number) {
  //   this.dx = dx;
  //   this.dz = dz;

  //   this.character.rotation.y = Math.atan2(-dx, -dz);
  //   this.character.position.add((new THREE.Vector3()).setFromCylindricalCoords(10 * Math.sqrt(dx ** 2 + dz ** 2), this.character.rotation.y, 0));
  //   this.updateAnimation();
  // }

  /**
   * Moves the character in the specified direction.
   * @param dx - The x-component of the movement direction.
   * @param dz - The z-component of the movement direction.
   */
  move(dx: number, dz: number) {
    this.dx = dx;
    this.dz = dz;

    // Set the character's rotation based on movement direction
    this.character.rotation.y = Math.atan2(-dx, -dz);

    // Update the character's position based on the input direction
    // The character moves at a speed proportional to the magnitude of dx and dz
    this.character.position.add(new THREE.Vector3().setFromCylindricalCoords(10 * Math.sqrt(dx ** 2 + dz ** 2), this.character.rotation.y, 0));

    // Clamping the character's position to stay within the bounds of the carpet area
    // The carpet's width is 2000 units.
    this.character.position.x = Math.max(-1000, Math.min(1000, this.character.position.x));

    // The carpet's depth is 4000 units and its center z-position is at 1800.
    this.character.position.z = Math.max(-2000, Math.min(2000, this.character.position.z));

    // Update the character's animation based on the current movement
    this.updateAnimation();
  }

  /**
   * Updates the character's animation.
   */
  updateAnimation() {
    let m = 1;
    [this.leftLeg, this.rightLeg, this.rightArm, this.leftArm].forEach((part) => {
      part.rotate(m * this.pendulum.swing, 0, 0);
      m *= -1;
    });

    if (!this.dx && !this.dz) {
      this.pendulum.update(1 / 60, false);

      return;
    }

    this.pendulum.update(1 / 60, true);
  }

  /**
   * Initiates a jump for the character.
   */
  jump() {
    if (!this.isJumping) { // Prevent jumping if already in the air
      this.isJumping = true;
      this.jumpStartY = this.character.position.y; // Store the initial position of the jump
      this.jumpVelocity = 1000; // Set initial jump velocity
    }
  }

  /**
   * Updates the character's position and animation on each frame.
   * @param dt - The time elapsed since the last frame.
   */
  update(dt: number) {
    this.jumpStartY ??= this.character.position.y; // only initialize jumpStartY if it is undefined/null

    this.updateAnimation();

    if (this.isJumping) {
      // Apply the jump velocity to the character's Y position
      this.character.position.y += this.jumpVelocity * dt;
      // Reduce the jump velocity
      this.jumpVelocity += this.gravity * dt;
    }

    // Check if the character has landed
    if (this.character.position.y <= this.jumpStartY) {
      this.character.position.y = this.jumpStartY;
      this.isJumping = false;
      this.jumpVelocity = 0; // Reset the jump velocity
    }
  }
}
