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
const textureLoader = new THREE.TextureLoader(loadingManager);
// Door
const doorAlpha = textureLoader.load("textures/door/alpha.jpg");
const doorAmbientOcclusion = textureLoader.load("textures/door/ambientOcclusion.jpg");
const doorColor = textureLoader.load("textures/door/color.jpg");
const doorHeight = textureLoader.load("textures/door/height.jpg");
const doorMetalness = textureLoader.load("textures/door/metalness.jpg");
const doorNormal = textureLoader.load("textures/door/normal.jpg");
const doorRoughness = textureLoader.load("textures/door/roughness.jpg");

// Walls
const wallsAmbientOcclution = textureLoader.load("textures/bricks/ambientOcclusion.jpg");
const wallsColor = textureLoader.load("textures/bricks/color.jpg");
const wallsNormal = textureLoader.load("textures/bricks/normal.jpg");
const wallsRoughness = textureLoader.load("textures/bricks/roughness.jpg");

// Grass
const grassAmbientOcclusion = textureLoader.load("textures/grass/ambientOcclusion.jpg");
const grassColor = textureLoader.load("textures/grass/color.jpg");
const grassNormal = textureLoader.load("textures/grass/normal.jpg");
const grassRoughness = textureLoader.load("textures/grass/roughness.jpg");
grassAmbientOcclusion.repeat.set(8, 8);
grassColor.repeat.set(8, 8);
grassNormal.repeat.set(8, 8);
grassRoughness.repeat.set(8, 8);
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping;
grassColor.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;

// ColorSpace
doorColor.colorSpace = THREE.SRGBColorSpace;
wallsColor.colorSpace = THREE.SRGBColorSpace;
grassColor.colorSpace = THREE.SRGBColorSpace;

/**
 * Fog
 */
const fog = new THREE.Fog(
    "#262837",
    1, // Near
    15 // Far
);
scene.fog = fog;

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
        aoMap: wallsAmbientOcclution,
        map: wallsColor,
        normalMap: wallsNormal,
        roughnessMap: wallsRoughness
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
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: doorAlpha,
        aoMap: doorAmbientOcclusion,
        map: doorColor,
        displacementMap: doorHeight,
        displacementScale: 0.1,
        normalMap: doorNormal,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughness,
        transparent: true,
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
    new THREE.MeshStandardMaterial({
        aoMap: grassAmbientOcclusion,
        map: grassColor,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
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
const doorLight = new THREE.PointLight("#FF7D46", 1.4, 7);
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
    .min(-2)
    .max(2)
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

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#FF00FF", 6, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00FFFF", 6, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#FFFF00", 6, 3);
scene.add(ghost3);

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
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    /**
     * Update Ghosts
     */
    // Ghost 1
    const ghosts1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghosts1Angle) * 4;
    ghost1.position.z = Math.sin(ghosts1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    // Ghost 2
    const ghosts2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghosts2Angle * 2) * 5;
    ghost2.position.z = Math.sin(ghosts2Angle * 2) * 5;
    ghost2.position.y = Math.cos(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // Ghost 3
    const ghosts3Angle = -elapsedTime * 0.18;
    ghost3.position.x = Math.sin(ghosts3Angle) * (7 * Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.cos(ghosts3Angle) * (7 * Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();