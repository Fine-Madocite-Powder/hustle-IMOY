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
    walk: {
        spriteSheet: document.getElementById("walking"),
        width: 24,
        height:24,
        length: 4
    }
  }

class Anim {
    constructor(MaxFrames, spriteSheet, duration, width, height) {
        this.width = width;
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
            x: 1,
            y: 0
        }
        this.position = { // This object stores the position of the player.
            x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
            y: y // The starting position of either player is determined by the respective input variables when the objects are created.
        }
        this.lookDirection = "right"; // This variable is used to flip assets when the player starts moving in differend directions.
        this.animator = new Anim(null, null, null, null, null)
    }
    // Add jump and attack functions. An attack funciton has to has as long of a windup as it has an animation, unfortunately.
    /*  Aerial attack: stop x and y velocity, 
    *   Standing attack: short stoptimer
    */  
}

let player1 = new Player(0,150); // MaxFrames, spriteSheet, duration, width, height
player1.animator = new Anim (Animations.walk.length, Animations.walk.spriteSheet, 1000, Animations.walk.width, Animations.walk.height);



let lastTimestamp = 0,
maxFPS = 50,
timestep = 1000 / maxFPS // ms for each frame

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

  player1.animator.timepassed += timestep;

  if (player1.animator.timepassed > player1.animator.duration) {
    player1.animator.timepassed = 0;
  }

  let frame = Math.floor(player1.animator.MaxFrames * player1.animator.timepassed / player1.animator.duration); // this line calculates the frame index player1 is currently at.

  ctx.drawImage(player1.animator.spriteSheet, frame * player1.animator.width, 0, player1.animator.width, player1.animator.height, player1.position.x, player1.position.y, player1.animator.width, player1.animator.height);



  requestAnimationFrame(update)
}
requestAnimationFrame(update);
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);