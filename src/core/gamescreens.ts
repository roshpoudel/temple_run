import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TTFLoader } from 'three/examples/jsm/Addons.js';

export function showGameOverScreen(scene: THREE.Scene) {
  // Create a font loader
  const ttfloader = new TTFLoader();

  // Load font
  ttfloader.load('/assets/textures/fonts/game_over.ttf', (json) => {
    // Parse the font
    const font = new FontLoader().parse(json);

    // Split text into lines
    const lines = ['Game Over!', 'Press R to Restart'];
    const lineHeight = 500;

    lines.forEach((line, index) => {
      // Create text geometry for each line
      const textGeometry = new TextGeometry(line, {
        font,
        size: 1000,
        height: 5,
      });

      // Create a mesh with the text
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Adjust Y position based on line height
      textMesh.position.set(-2100, -index * lineHeight + 1000, -2000);

      // Add text mesh to your scene
      scene.add(textMesh);
    });
  }, undefined, (error) => {
    console.error('An error occurred loading the font:', error);
  });
}
