// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the character components
const head = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
const torso = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), new THREE.MeshBasicMaterial({ color: 0xff6347 }));
const arm2 = arm1.clone();
const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), new THREE.MeshBasicMaterial({ color: 0x008000 }));
const leg2 = leg1.clone();

// Position the components
head.position.y = 4;
torso.position.y = 2.5;
arm1.position.y = 2.5;
arm1.position.x = -1.25;
arm2.position.y = 2.5;
arm2.position.x = 1.25;
leg1.position.y = 0.5;
leg1.position.x = -0.5;
leg2.position.y = 0.5;
leg2.position.x = 0.5;

// Create a group and add the components
const character = new THREE.Group();
character.add(head);
character.add(torso);
character.add(arm1);
character.add(arm2);
character.add(leg1);
character.add(leg2);

// Add the character to the scene
scene.add(character);

// Create ground
const groundGeometry = new THREE.PlaneGeometry(100, 5);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Set camera position
camera.position.z = 10;

// Animation variables
const clock = new THREE.Clock();
const runningSpeed = 10;

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  const delta = clock.getDelta();

  // Simulate running by rotating arms and legs
  arm1.rotation.x = Math.sin(time * runningSpeed) * Math.PI / 4;
  arm2.rotation.x = -Math.sin(time * runningSpeed) * Math.PI / 4;
  leg1.rotation.x = -Math.sin(time * runningSpeed) * Math.PI / 4;
  leg2.rotation.x = Math.sin(time * runningSpeed) * Math.PI / 4;

  // Move the ground to simulate running forward
  ground.position.z = (ground.position.z + delta * 5) % 100;

  renderer.render(scene, camera);
}

// Start animation loop
animate();
