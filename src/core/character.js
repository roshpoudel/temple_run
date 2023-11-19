class CharacterPart {
    constructor(geometry, material, position, parent) {
        this.mesh = new THREE.Mesh(geometry, material);
        if (position) {
            this.mesh.position.set(position.x, position.y, position.z);
        }
        if (parent) {
            parent.add(this.mesh);
        }
    }
}

class Character {
    constructor() {
        this.character = new THREE.Object3D();
        this.createBody();
    }

    createBody() {
        // Define dimensions and materials
        const w = 20, h = 40, d = 10;
        const limbH = (3.0/8.0) * h;
        const headH = (2.0/8.0) * h;
        const limbW = (1.0/4.0) * w;
        const chestW = (1.0/2.0) * w;
        const headW = (1.0/2.0) * w;
        const limbD = (1.0/2.0) * d;
        const headD = d;
        const characterMaterial = new THREE.MeshNormalMaterial();
        const limbG = new THREE.BoxGeometry(limbW, limbH, limbD);
        const chestG = new THREE.BoxGeometry(chestW, limbH, limbD);
        const headG = new THREE.BoxGeometry(headW, headH, headD);

        // Create body parts
        const upperBody = new THREE.Object3D();
        const torso = new THREE.Object3D();
        const legs = new THREE.Object3D();
        
        // Legs
        new CharacterPart(limbG, characterMaterial, {x: -0.5 * limbW, y: limbH, z: 0}, legs);
        new CharacterPart(limbG, characterMaterial, {x: 0.5 * limbW + 0.1, y: limbH, z: 0}, legs);
        
        // Torso
        new CharacterPart(chestG, characterMaterial, null, torso);

        // Arms
        new CharacterPart(limbG, characterMaterial, {x: -0.5 * chestW - 0.5 * limbW - 0.1, y: 0.5 * limbH, z: 0}, torso);
        new CharacterPart(limbG, characterMaterial, {x: 0.5 * chestW + 0.5 * limbW + 0.1, y: 0.5 * limbH, z: 0}, torso);

        // Head
        // Here we can add custom material for head if needed
        new CharacterPart(headG, characterMaterial, {x: 0, y: limbH * 0.5 + headH * 0.5 + 0.1, z: 0}, upperBody);

        // Assemble character
        upperBody.add(torso);
        upperBody.position.y = limbH + (0.5 * limbH) + 0.1;
        this.character.add(upperBody);
        this.character.add(legs);
    }

    getMesh() {
        return this.character;
    }
}


