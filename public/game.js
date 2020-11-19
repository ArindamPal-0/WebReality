console.log('game');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setClearColor('#efefef', .1);
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);

//const ui = document.querySelector('.ui');
//document.body.appendChild(ui);

const gameobject = new GameObject(scene);

const pauseButton = document.createElement('div');
pauseButton.textContent = 'Pause';
pauseButton.classList.add('pause');

pauseButton.addEventListener('click', () => {
    gameobject.paused = !gameobject.paused;
    if(gameobject.paused){
        pauseButton.textContent = 'Resume';
    }else{
        pauseButton.textContent = 'Pause';
    }
});

ui.appendChild(pauseButton);

let restartButton;

let intervalId;
const loop = () => {
    if(gameobject.gameover){
        if(restartButton){
            restartButton.style.display = 'block';
        }

        if(gameobject.player){
            gameobject.removePlayer(scene);
        }

        gameobject.enemies.forEach(enemy => {
            enemy.remove(scene);
        });
        gameobject.enemies.splice(0, gameobject.enemies.length);

        if(intervalId){
            clearInterval(intervalId);
        }
    }else{
        if(!gameobject.paused){
            let lane = Math.floor(Math.random() * 3);
            gameobject.addEnemy(scene, lane);
            //console.log(gameobject.enemies.length);
        }
    }
}

intervalId = setInterval(loop, 1000);

restartButton = document.createElement('div');
restartButton.textContent = 'Restart';
restartButton.classList.add('restart');

restartButton.addEventListener('click', () => {
    if(gameobject.gameover){
        gameobject.player = new Player(scene);
        intervalId = setInterval(loop, 1000);
        gameobject.gameover = false;
        restartButton.style.display = 'none';
    }
});

ui.appendChild(restartButton);


//set camera position
camera.position.x = 0;
camera.position.y = 5;
camera.position.z = 2;
camera.rotation.x = -38.4;

//window resize adjustment
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const render = () => {
    requestAnimationFrame(render);

    if(!gameobject.gameover){
        if(!gameobject.paused){
            gameobject.render();
            gameobject.update(scene);

            renderer.render(scene, camera);
        }
    }
}

//touch inputs
canvas.addEventListener('click', event => {
    if(!gameobject.gameover){
        if(!gameobject.paused){
            let left = false;
            let right = false;

            if(event.clientX < window.innerWidth / 2){
                left = true;
            }else if(event.clientX > window.innerWidth / 2){
                right = true;
            }

            if(left || right){
                gameobject.input({left, right});
            }
        }
    }
});


window.addEventListener('keyup', event => {
    if(event.code == 'Space'){
        
    }

    //for testing purposes,
    if(event.code == 'KeyP'){
        gameobject.gameover = true;
    }
});


//keyboard inputs
window.addEventListener('keydown', event => {
    let left = false;
    let right = false;
    
    /*
    if(event.code == 'ArrowLeft'){
        
    }

    if(event.code == 'ArrowRight'){

    }

    if(event.code == 'ArrowUp'){
        camera.rotation.x += 0.1;
    }

    if(event.code == 'ArrowDown'){
        camera.rotation.x -= 0.1;
    }
    */

    if(event.code == 'KeyA'){
        left = true;
    }

    if(event.code == 'KeyD'){
        right = true;
    }

    if(left || right){
        gameobject.input({left, right});
    }
    
});

render();