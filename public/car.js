console.log('car');

const setFromCartesianCoords = (s, x, y, z) => {
    s.radius = Math.sqrt(x * x + y * y + z * z);

    if(s.radius === 0){
        s.theta = 0;
        s.phi = 0;
    }else{
        s.theta = Math.atan2(x, z);
        s.phi = Math.acos(Math.max(-1, Math.min(y / s.radius, 1)));
    }
}

const setFromVector = (s, v) => {
    setFromCartesianCoords(s, v.x, v.y, v.z);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(-6.74, 2.63, 2.93);
camera.rotation.set(-0.62, -1.08, -0.56);

const spherical = new THREE.Spherical();
setFromVector(spherical, camera.position);

hlight = new THREE.AmbientLight (0x404040,100);
scene.add(hlight);
directionalLight = new THREE.DirectionalLight(0xffffff,100);
directionalLight.position.set(0,1,0);
directionalLight.castShadow = true;
scene.add(directionalLight);
light = new THREE.PointLight(0xc4c4c4,10);
light.position.set(0,300,500);
scene.add(light);
light2 = new THREE.PointLight(0xc4c4c4,10);
light2.position.set(500,100,0);
scene.add(light2);
light3 = new THREE.PointLight(0xc4c4c4,10);
light3.position.set(0,100,-500);
scene.add(light3);
light4 = new THREE.PointLight(0xc4c4c4,10);
light4.position.set(-500,300,500);
scene.add(light4);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, .1);
document.body.appendChild(renderer.domElement);

const div = document.createElement('div');
div.textContent = "Loading...";
document.body.appendChild(div);

let loader = new THREE.GLTFLoader();
loader.load('/car.gltf', gltf => {
    car = gltf.scene.children[0];
    car.position.set(0, 0, 0);
    let scale = 0.5;
    car.scale.set(scale, scale, scale);
    scene.add(gltf.scene);
    animate();
    //console.log(document.body.lastChild == div);
    div.remove();
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    
    spherical.theta += Math.PI / 1000;
    if(spherical.theta > Math.PI * 2){
        spherical.theta = 0;
    }

    camera.position.setFromSpherical(spherical);
    camera.lookAt(new THREE.Vector3());
    
}