const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// The "anim" object contains all sprites, spritesheets, and information that might be needed to animate the object.

let anim = {
    FireFist: {
        frameWidth: 12,
        frameHeight: 18,
        frameCount: 1,
        spriteSheet: document.getElementById("FireFist")
    }
}



class Player {
    constructor () {
        this.health = 12;
        this.grounded = true;
        this.doublejump = true;
        this.velX = 0;
        this.velY = 0;
        this.position = {
            x: 350,
            y: 200
        }
    }

    fallAttack() {

    }

    standingAttack() {

    }

    moveAttack(){

    }
}



let startTime = 0;
let endTime = 0;
let deltaTime = 0;
function update() {
    startTime = performance.now();
    
    console.log(deltaTime);

    /*ctx.fillStyle = "red";
    ctx.fillRect(0, 0, canvas.width, canvas.height);*/

    endTime = performance.now();
    deltaTime = endTime - startTime;

    requestAnimationFrame(update)
}

requestAnimationFrame(update);