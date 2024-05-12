import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

/**
 * Textures
 */
// Loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

loadingManager.onLoad = function ( ) {
	console.log( 'Loading complete!');
};

loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

loadingManager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

// Textures Loader
const textureLoader = new THREE.TextureLoader();

/**
 * House
 */
// Group
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        color: "#AC8E82"
    })
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: "#b35F45"
    })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({
        color: "#AA7B7B"
    })
);
door.position.y = 1
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: "#89C854"
});

const bush1 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(
    bushGeometry,
    bushMaterial
);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
// Grave Group
const graves = new THREE.Group();
scene.add(graves);

const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial({
    color: "#B2B6B1"
});

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const grave = new THREE.Mesh(
        gravesGeometry,
        gravesMaterial
    );
    grave.position.set(x, 0.3, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: '#a9c388' })
);
floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#B9D5FF', 0.12);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#B9D5FF', 0.26);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

//
const doorLight = new THREE.PointLight("#FF7D46", 3, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Debug
 */
const lightsGuiFolder = gui.addFolder("Lights");

const ambientLightFolder = lightsGuiFolder.addFolder("Ambient Light");

ambientLightFolder.add(ambientLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.001)
    .name("Ambient Light Intensity")
;

const directionalLightFolder = lightsGuiFolder.addFolder("Directional Light");
directionalLightFolder.add(moonLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.001)
    .name("Directional Light Intensity")
;
directionalLightFolder.add(moonLight.position, 'x')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Directional Light X")
;
directionalLightFolder.add(moonLight.position, 'y')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Directional Light Y")
;
directionalLightFolder.add(moonLight.position, 'z')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Directional Light Z")
;

const pointLightFolder = lightsGuiFolder.addFolder("Point Light");
pointLightFolder.add(doorLight, 'intensity')
    .min(-3)
    .max(3)
    .step(0.001)
    .name("Point Light Intensity")
;
pointLightFolder.add(doorLight.position, 'x')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Point Light X")
;
pointLightFolder.add(doorLight.position, 'y')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Point Light Y")
;
pointLightFolder.add(doorLight.position, 'z')
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Point Light Z")
;

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();