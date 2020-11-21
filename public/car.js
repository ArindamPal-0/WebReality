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

let gyroInput = true;
let touchInput = false;
let autoRotate = false;


const setFromVector = (s, v) => {
    setFromCartesianCoords(s, v.x, v.y, v.z);
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(-6.74, 2.63, 2.93);
camera.rotation.set(-0.62, -1.08, -0.56);

const spherical = new THREE.Spherical();
const initSpherical = new THREE.Spherical();
setFromVector(spherical, camera.position);
setFromVector(initSpherical, camera.position);

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
div.classList.add('loading');
div.textContent = "Loading...";
document.body.appendChild(div);

//setup sensor
let gyroSensitivity = 0.01;
let rotX = 0;
let rotY = 0;
let rotationLimitX = 0.1;

let gyroReading = true;

let gyroscope = new Gyroscope({frequency: 60});

gyroscope.onreading = () => {
    rotY = 0;
    rotX = 0;

    rotX = Math.PI * gyroscope.x * gyroSensitivity;
    rotY = Math.PI * gyroscope.y * gyroSensitivity;

    /*
    if(rotY < -38.8){
        rotY = -38.8;
    }else if(rotY > -38){
        rotY = -38;
    }
    */

    //p.textContent = rotY;

    if(gyroInput){
        spherical.theta += rotY;
        spherical.phi += rotX;

        if(spherical.theta > Math.PI * 2){
            spherical.theta = 0;
        }

        if(spherical.phi < Math.PI / 4){
            spherical.phi = Math.PI / 4;
        }else if(spherical.phi > Math.PI / 2){
            spherical.phi = Math.PI / 2;
        }

        camera.position.setFromSpherical(spherical);
        camera.lookAt(new THREE.Vector3());
    }    
}

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
    gyroscope.start();
});

//ui from camera.js
const gyroButton = document.createElement('div');
gyroButton.classList.add('btn');
gyroButton.textContent = 'Disable Gyro Input';
gyroInput = true;
ui.appendChild(gyroButton);

gyroButton.addEventListener('click', () => {
    if(gyroInput){
        gyroInput = false;
        gyroButton.textContent = "Activate Gyro Input";
        
        //reset camera position
        camera.position.setFromSpherical(initSpherical);
        camera.lookAt(new THREE.Vector3());
    }else if(!gyroInput){
        if(touchInput){
            touchInput = false;
            touchButton.textContent = "Activate Touch Input";
        }
        gyroInput = true;
        gyroButton.textContent = "Disable Gyro Input";
    }
});

const touchButton = document.createElement('div');
touchButton.classList.add('btn');
touchInput = false;
touchButton.textContent = 'Activate Touch Input';
ui.appendChild(touchButton);

touchButton.addEventListener('click', () => {
    if(touchInput){
        touchInput = false;
        touchButton.textContent = "Activate Touch Input";
    }else if(!touchInput){
        if(gyroInput){
            gyroInput = false;
            gyroButton.textContent = "Activate Gyro Input";
            //reset camera position
            camera.position.setFromSpherical(initSpherical);
            camera.lookAt(new THREE.Vector3());
        }
        touchInput = true;
        touchButton.textContent = "Disable Touch Input";
    }
});

const autoButton = document.createElement('div');
autoButton.classList.add('btn');
autoButton.textContent = 'Activate Auto Rotate';
autoRotate = false;
ui.appendChild(autoButton);

autoButton.addEventListener('click', () => {
    if(!autoRotate){
        if(gyroInput){
            gyroInput = false;
            gyroButton.textContent = "Activate Gyro Input";
        }

        if(touchInput){
            touchInput = false;
            touchButton.textContent = "Activate Touch Input";
        }

        autoRotate = true;
        autoButton.textContent = "Disable Auto Rotate"

        setFromVector(spherical, camera.position);
    }else if(autoRotate){
        autoRotate = false;
        autoButton.textContent = "Activate Auto Rotate";

        if(!touchInput){
            touchInput = true;
            touchButton.textContent = "Disable Touch Input";
        }
    }
    

    camera.position.setFromSpherical(spherical);
    camera.lookAt(new THREE.Vector3());
});

const resetButton = document.createElement('div');
resetButton.classList.add('btn');
resetButton.textContent = 'Reset Camera Position';
ui.appendChild(resetButton);

resetButton.addEventListener('click', () => {
    if(gyroInput){
        gyroInput = false;
        gyroButton.textContent = 'Activate Gyro Input';
    }

    if(touchInput){
        touchInput = false;
        touchButton.textContent = 'Activate Touch Input';
    }

    camera.position.setFromSpherical(initSpherical);
    camera.lookAt(new THREE.Vector3());
});

let mouseDown = false;

/*
const value = document.createElement('div');
value.classList.add('btn');
value.textContent = 'value';
ui.appendChild(value);
*/

let prevPos = 0;

//BUGGY TOUCH CONTROLS FIX IT
window.addEventListener('touchstart', event => {
    mouseDown = true;
    prevPos = 0;

    window.addEventListener('touchmove', event => {
        if(event.touches[0].clientX != prevPos){
            let x = event.touches[0].clientX - prevPos;
            prevPos = event.touches[0].clientX;
            if(touchInput){
                setFromVector(spherical, camera.position);

                spherical.theta += -(Math.PI / 1000) * x;

                if(spherical.theta > Math.PI * 2){
                    spherical.theta = 0;
                }

                camera.position.setFromSpherical(spherical);
                camera.lookAt(new THREE.Vector3());
            }            
        }
    });

    window.addEventListener('touchend', event => {
        mouseDown = false;
    })
});

window.addEventListener('mousedown', () => {
    if(!mouseDown)
        mouseDown = true;
});

window.addEventListener('mouseup', () => {
    if(mouseDown)
        mouseDown = false;
})

window.addEventListener('mousemove', event => {
    if(touchInput){
        if(mouseDown){
            spherical.theta += -(Math.PI / 1000) * event.movementX;

            if(spherical.theta > Math.PI * 2){
                spherical.theta = 0;
            }

            camera.position.setFromSpherical(spherical);
            camera.lookAt(new THREE.Vector3());
        }        
    }
})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    if(autoRotate){
        spherical.theta += (Math.PI / 1000);

        if(spherical.theta > Math.PI * 2){
            spherical.theta = 0;
        }

        camera.position.setFromSpherical(spherical);
        camera.lookAt(new THREE.Vector3());
    }
}