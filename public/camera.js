console.log('hey');

const video = document.createElement('video');
document.body.appendChild(video);

navigator.mediaDevices.getUserMedia({
    video:{
        facingMode: 'environment'
    },
    audio: false
}).then(stream => {
    video.srcObject = stream;
    video.play();
}).catch(error => {
    console.error(error);
});


const ui = document.createElement('div');
ui.classList.add('ui');
document.body.appendChild(ui);

const pauseCamera = document.createElement('div');
pauseCamera.classList.add('pause-camera');
pauseCamera.textContent = 'Pause Camera';
ui.appendChild(pauseCamera);

pauseCamera.addEventListener('click', () => {
    if(video.paused){
        video.play();
        pauseCamera.textContent = 'Pause Camera';
    }else {
        video.pause();
        pauseCamera.textContent = 'Play Camera';
    }
})