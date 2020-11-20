console.log('sensor');

/*
const p = document.createElement('div');
p.classList.add('pos');
p.textContent = 'pos';
ui.appendChild(p);
*/
let gyroSensitivity = .005;
let rotY = 0;
let rotX = -38.4;
let pos = 0;
let rotationLimitY = 0.1;
let rotationLimitX = 0.1;

let gyroReading = true;

let gyroscope = new Gyroscope({frequency: 60});

gyroscope.onreading = () => {
    rotY += gyroscope.y * gyroSensitivity;
    rotX += gyroscope.x * gyroSensitivity;

    if(rotY < -rotationLimitY){
        rotY = -rotationLimitY;
    }else if(rotY > rotationLimitY){
        rotY = rotationLimitY;
    }

    if(rotX < -38.8){
        rotX = -38.8;
    }else if(rotX > -38){
        rotX = -38;
    }

    //p.textContent = rotX;
    camera.rotation.y = rotY;
    camera.rotation.x = rotX;
}

gyroscope.start();