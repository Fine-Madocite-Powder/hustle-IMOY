const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = document.getElementById("background");


// "Animations" is an object that stores information about sprites that need to be rendered. It does not 
const Animations = {
    standingAttack: {
      spriteSheet: document.getElementById("standingAttack"),
      width: 24,
      height: 24,
      length: 2
    },
    walkRight: {
        spriteSheet: document.getElementById("walking right"),
        width: 24,
        height: 24,
        length: 4
    },

    greenRunRight: {
      spriteSheet: document.getElementById("greenRunRight"),
      width: 34,
      height: 32,
      length: 8
    },
    greenRunLeft: {
      spriteSheet: document.getElementById("greenRunLeft"),
      width: 36,
      height: 36,
      length: 4
    }
  }

class Anim {
    constructor(MaxFrames, spriteSheet, duration, width, height, name) {
        this.width = width;
        this.name = name
        this.height = height;
        this.MaxFrames = MaxFrames;
        this.spriteSheet = spriteSheet;
        this.duration = duration;
        this.timepassed = 0;
    }
  }

  class Player {
    constructor(x, y) {
        this.health = 10;
        this.stoptimer = 0;
        this.velocity = { // The x and y coordinates below determine the direction the player is moving. 
            x: 0,
            y: 0
        }
        this.position = { // This object stores the position of the player.
            x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
            y: y // The starting position of either player is determined by the respective input variables when the objects are created.
        }
        this.lookDirection = 1; // This variable is used to flip assets when the player starts moving in differend directions.
                                // 1 means looking right, -1 means looking left.
        this.grounded = false;
        this.doubleJump = true;
        this.animator = new Anim(null, null, null, null, null, null)
    }

    Jump() {
      if (this.grounded) { 
        this.velocity.y = -10;
        this.grounded = false;
      } else if (this.doubleJump) {
        this.velocity.y = -8;
        this.doubleJump = false;
        this.grounded = false;
      }
    }
    // Add jump and attack functions. An attack funciton has to has as long of a windup as it has an animation, unfortunately.
    /*  Aerial attack: stop x and y velocity, 
    *   Standing attack: short stoptimer
    */  
}

let player1 = new Player(50,50); // MaxFrames, spriteSheet, duration, width, height
player1.animator = new Anim (Animations.greenRunRight.length, Animations.greenRunRight.spriteSheet, 1000, Animations.greenRunRight.width, Animations.greenRunRight.height, "runRight");



let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

function update(timestamp) {
  if (timestamp - lastTimestamp < timestep) {
      // Only continue if one timestep (1000/15 ms) has passed. Otherwise, schedule the next frame and cancel the current update code.
      requestAnimationFrame(update)
      return
  }
  lastTimestamp = timestamp
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
  player1.position.x += player1.velocity.x;
  player1.position.y += player1.velocity.y;

  if (player1.position.y >= canvas.height) {
    player1.position.y = canvas.height;
    player1.grounded = true;
    player1.doubleJump = true;
  }

  if (!player1.grounded) {
    player1.velocity.y += gravityForce;
  }


  player1.animator.timepassed += timestep;
  if (player1.animator.timepassed > player1.animator.duration) {
    player1.animator.timepassed = 0;
  }

  let frame = Math.floor(player1.animator.MaxFrames * player1.animator.timepassed / player1.animator.duration); // this line calculates the frame index player1 is currently at.
  ctx.drawImage(player1.animator.spriteSheet, frame * player1.animator.width, 0, player1.animator.width, player1.animator.height, player1.position.x - player1.animator.width / 2, player1.position.y - player1.animator.height, player1.animator.width, player1.animator.height);



  requestAnimationFrame(update)
}
requestAnimationFrame(update);
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);



// Hello future me! You gotta store these inputs as a variable, and then have update() execute based on the variable.
window.addEventListener("keydown", (event) => { //An eventlistener that listens to which key is pressed and act in respons depending on the key. The even object is the key that's being pressed//
  switch (event.key) {
    case "d":
    case "D":
      player1.velocity.x = 4
      player1.lookDirection = 1
      let exchangeD = new Anim (Animations.greenRunRight.length, Animations.greenRunRight.spriteSheet, 1000, Animations.greenRunRight.width, Animations.greenRunRight.height, "runRight");
      if (!(exchangeD.spriteSheet === player1.animator.spriteSheet)) player1.animator = exchangeD;
      break;
    case "w":
    case "W":
      player1.Jump();
      break
    case "a":
    case "A":
      player1.velocity.x = -4
      player1.lookDirection = -1
      let exchangeA = new Anim (Animations.greenRunLeft.length, Animations.greenRunLeft.spriteSheet, 1000, Animations.greenRunLeft.width, Animations.greenRunLeft.height, "runLeft");
      if (!(exchangeA.name === player1.animator.name)) player1.animator = exchangeA
      break
  }
})




window.addEventListener("keyup", (event) => {  //Event listener that listens to when you stop pressing a key to stop player 1 from moving//
    switch (event.key) { 
    case "d":
    case "D":
      player1.velocity.x = 0
      break;
    case "a":
    case "A":
      player1.velocity.x = 0
      break
  }
}) 