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
    }
  }

class Anim {
    constructor(width, height, MaxFrames, spriteSheet, duration) {
        this.width = width;
        this.height = height;
        this.MaxFrames = MaxFrames;
        this.spriteSheet = spriteSheet;
        this.frameIndex = 0;
        this.duration = duration;
        this.timepassed = 0;
    }
  }

  class Player {
    constructor(x, y) {
        this.health = 10;
        this.velocity = { // The x and y coordinates below determine the direction the player is moving. 
            x: 0,
            y: 0
        }
        this.position = { // This object stores the position of the player.
            x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
            y: y // The starting position of either player is determined by the respective input variables when the objects are created.
        }
        this.lookDirection = "right"; // This variable is used to flip assets when the player starts moving in differend directions.
        this.animator = new Anim(null, null, null, null, null)
    }
}

let player1 = new Player(100,100);
player1.animator = new Anim(Animations.standingAttack.width, Animations.standingAttack.height, Animations.standingAttack.length, Animations.standingAttack.spriteSheet);



let lastTimestamp = 0,
maxFPS = 15,
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
  
  

  requestAnimationFrame(update)
}
requestAnimationFrame(update);
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);