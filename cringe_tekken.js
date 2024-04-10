const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- The "anim" object contains all sprites, spritesheets, and information that might be needed to animate the object. ---
let anim = {
    FireFist: {
        frameWidth: 12,
        frameHeight: 18,
        frameCount: 2,
        spriteSheet: document.getElementById("FireFist")
    },
    Background: {
        spriteSheet: document.getElementById("background")
    }
}


// --- The "Player" class contains all information used to move and render both player characters. ---
class Player {
    constructor (x, y) {
        this.health = 12;
        this.grounded = true;
        this.doublejump = true;
        this.velX = 0;
        this.velY = 0;
        this.position = {
            x: x,
            y: y
        }
        this.facesright = true;
        this.stundur = 0;
    }

    fallAttack() {

    }

    standAttack() {

    }

    moveAttack(){

    }
}

let player1 = new Player();
let player2 = new Player();




let startTime = 0;
let endTime = 0;
let deltaTime = 0; // Use deltaTime variable for physics calculations. It is very precise.

function update() {
    startTime = performance.now();

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(anim.FireFist.spriteSheet, 0, 0, canvas.width, canvas.height);


    

    

    endTime = performance.now();
    //deltaTime = endTime - startTime;

    //requestAnimationFrame(update)
}

requestAnimationFrame(update);