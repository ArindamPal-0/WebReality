const icosahedronGeometry = new THREE.IcosahedronGeometry();
const coneGeometry = new THREE.ConeGeometry();
const boxGeometry = new THREE.BoxGeometry();

const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
const material2 = new THREE.MeshStandardMaterial({color: 0xff0101});
const lineMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
const material3 = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    opacity: 0.8,
    transparent: true,
});

class Player{
    constructor(scene){
        this.mesh = new THREE.Mesh(boxGeometry, material);
        this.mesh.geometry.computeBoundingBox();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.box = new THREE.Box3().setFromObject(this.mesh);
        this.b = new THREE.BoxHelper(this.mesh, 0x00aa00);
        scene.add(this.mesh);
        scene.add(this.b);

        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
        this.scale = this.mesh.scale;

        this.lane = 1;
        this.position.x = -2 + (this.lane * 2);
    }

    render(){
        this.b.update();
        this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

    update(){

    }

    collidedBox(obj){
        return this.box.intersectsBox(obj.box);
    }

    remove(scene){
        scene.remove(this.mesh);
        scene.remove(this.b);
        this.mesh = null;
        this.box = null;
        this.b = null;
        this.position = null;
        this.rotation = null;
        this.scale = null;
    }
}

class Enemy{
    constructor(scene, number, lane = 0){
        this.number = number;
        this.mesh = new THREE.Mesh(boxGeometry, material3);
        this.mesh.geometry.computeBoundingBox();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.box = new THREE.Box3().setFromObject(this.mesh);
        this.b = new THREE.BoxHelper(this.mesh, 0x000000);
        scene.add(this.b);
        scene.add(this.mesh);

        this.speed = new THREE.Vector3(0, 0, 0.05);

        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
        this.scale = this.mesh.scale;

        if(lane < 0){
            lane = 0;
        }else if(lane > 2){
            lane = 2;
        }

        this.lane = lane;
        this.position.x = -2 + (this.lane * 2);

        this.position.z = -10;
    }

    render(){
        this.b.update();
        this.box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
    }

    update(){
        this.position.z += this.speed.z;
    }

    collidedBox(obj){
        return this.box.intersectsBox(obj.box);
    }

    remove(scene){
        scene.remove(this.mesh);
        scene.remove(this.b);
        this.mesh = null;
        this.box = null;
        this.b = null;
        this.speed = null;
        this.position = null;
        this.rotation = null;
        this.scale = null;
    }
}

class Line{
    constructor(start = new THREE.Vector2(0, 0), end = new THREE.Vector2(0, 0), scene){
        this.points = [];
        this.points.push(start);
        this.points.push(end);

        const lineGeometry = new THREE.BuffeerGeometry().setFromPoints(points);
        this.mesh = new THREE.Line(lineGeometry, lineMatrial);
        scene.add(this.mesh);
    }

    remove(scene){
        scene.remove(this.mesh);
        this.points.splice(0, this.points.length);
        this.lineGeometry = null;
        this.mesh = null;
    }
}

class GameObject{
    constructor(scene){
        this.gameover = false;
        this.paused = false;
        this.player = this.addPlayer(scene);
        this.enemies = [];

        this.ground = this.addGround(scene);
        this.ambient = null;
        this.light = null;

        this.addLights(scene);

        this.addEnemy(scene, 0);
    }

    addGround(scene){
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            opacity: 0.8,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const planeGeometry = new THREE.PlaneGeometry(1, 1);
        
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = - Math.PI / 2;
        plane.position.set(0, -0.6, -2);
        
        plane.scale.set(5.5, 15, 1);
        
        scene.add(plane);

        return plane;
    }

    removeGround(scene){
        if(this.ground){
            scene.remove(this.ground);
            this.ground = null;
        }
    }

    addLights(scene){
        this.ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
        scene.add( this.ambient );

        this.light = new THREE.DirectionalLight({color: 0xFFFFFF});
        this.light.intensity = 1.3;

        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 512;
        this.light.shadow.mapSize.height = 512;
        this.light.shadow.camera.near = 10;
        this.light.shadow.camera.far = 200;
        this.light.shadowRadius = 2;
        this.light.shadow.focus = 1;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 1024;

        this.light.position.set(10, 10, 7.5);

        scene.add(this.light);
    }

    removeLights(scene){
        if(this.ambient){
            scene.remove(this.ambient);
            this.ambient = null;
        }

        if(this.lights){
            scene.remove(this.lights);
            this.lights = null;
        }
    }

    addEnemy(scene, lane){
        let number;
        while(true){
            number = Math.random() * 10;
            let random = true;
            for(let i = 0; i < this.enemies.length; i++){
                if(number == this.enemies[i].number){
                    random = false;
                    break;
                }
            }

            if(random)
                break;
        }

        const enemy = new Enemy(scene, number, lane);
        this.enemies.push(enemy);
    }

    removeEnemy(scene, number){
        for(let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].number == number){
                this.enemies[i].remove(scene);
                this.enemies.splice(i, 1);
                break;
            }
        }
    }

    addPlayer(scene){
        return new Player(scene);
    }

    removePlayer(scene){
        if(this.player){
            this.player.remove(scene);
            this.player = null;
        }
    }

    render(){
        if(this.player){
            this.player.render();
        }

        this.enemies.forEach(enemy => {
            enemy.render();
        });
    }

    update(scene){
        if(!this.gameover && !this.paused){
            if(this.player){
                this.player.update();
            }

            this.enemies.forEach(enemy => {
                enemy.update();

                if(enemy.position.x > 2){
                    this.removeEnemy(scene, enemy.number);
                }
            });

            for(let i = 0; i < this.enemies.length; i++){
                this.gameover = this.enemies[i].collidedBox(this.player);
                if(this.gameover)
                    break;
            }
        }
    }

    input(data){
        if(!this.gameover && !this.paused){
            if(data){
                if(data.left && data.right){
        
                }else if(data.left){
                    if(this.player.lane > 0){
                        this.player.lane -= 1;
                        this.player.position.x = -2 + (this.player.lane * 2);
                    } 
                }else if(data.right){
                    if(this.player.lane < 2){
                        this.player.lane += 1;
                        this.player.position.x = -2 + (this.player.lane * 2);
                    }
                }
            }
        }
    }

    clearScene(scene){
        if(gameobject.player){
            gameobject.removePlayer(scene);
        }

        gameobject.enemies.forEach(enemy => {
            enemy.remove(scene);
        });
        gameobject.enemies.splice(0, gameobject.enemies.length);

        gameobject.removeGround();
        gameobject.removeLights();
    }
}