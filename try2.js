const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"


let players = [];
let Animations = {};
// let players = [new Player(50,50, assetLoader, "Red/IdleRedRight.png"), new Player(100,50, assetLoader, "RedMod/IdleRedLeft-modified.png")]
const controls = {
  left: ["a", "ArrowLeft"],
  right: ["d", "ArrowRight"],
  jump: ["w", "ArrowUp"],
  attack: ["f", "-"]
}

let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

let keys = { }

window.addEventListener("keydown", (event) => {

  keys[event.key] = true
})
window.addEventListener("keyup", (event) => {

  keys[event.key] = false

}) 


class AssetLoader {
  constructor(imageSrcList) {
    this.imageSrcList = imageSrcList;
  }

  load() {
    return new Promise((resolve) => {
      this.images = {};
      let loadedCount = 0;

      for(const src of this.imageSrcList) {
        let image = new Image()
        image.src = src;

        image.onload = () => {
          loadedCount++;
          this.images[src] = image;

          if(loadedCount == this.imageSrcList.length) {
            resolve()
          }

        }
      }
    });
  }

  getImage(src) {
    return this.images[src];
  }
}

let assetLoader = new AssetLoader([
"background.jpg", 
"Red/attackRight.png", 
"Red/deathRight.png", 
"Red/idleLeft.png", 
"Red/idleRight.png", 
"Red/jumpLeft.png", 
"Red/jumpRight.png", 
"Red/runLeft.png", 
"Red/runRight.png"])
assetLoader.load().then(() => {

  players = [new Player(50,50, assetLoader, "Red"), new Player(100,50, assetLoader, "Red")]
  
  Animations = { // Data used in rendering and creating anim objects.
    runRight: {
      width: 34,
      height: 32,
      maxFrames: 8
    },
    runLeft: {
      width: 34,
      height: 32,
      maxFrames: 8
    },
    idleRight: {
      width: 34,
      height: 32,
      maxFrames: 6
    },
    idleLeft: {
      width: 34,
      height: 32,
      maxFrames: 6
    },
    groundedAttackRight: {
      width:34,
      height: 32,
      maxFrames: 8
    },
    groundedAttackLeft: {
      width:34,
      height: 32,
      maxFrames: 8
    },
    jumpRight: {
      width:34,
      height:32,
      maxFrames: 8
    },
    jumpLeft: {
      width:34,
      height:32,
      maxFrames: 8
    }
  }

  for (let player of players) {
    player.ChangeAnimation("idleRight", 1400);
  }


  requestAnimationFrame(update) 
  // After having loaded all images, put them into the assetLoader library, 
  // and written the Animations object, start the Update function for the first time.
})


function update(timestamp) {

        /// TIME ///

  if (timestamp - lastTimestamp < timestep) {
      // Only continue if one timestep (1000/15 ms) has passed. Otherwise, schedule the next frame and cancel the current update code.
      requestAnimationFrame(update)
      return
  }
  lastTimestamp = timestamp
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Refreshes the canvas.
  

  for (let i = 0; i < players.length; i++) {
    
    // Defining both players
    let player = players[i];
    let otherPlayer;
    otherPlayer = players.indexOf(player) ? players[0] : players[1]
    // If we are currently calculating for player 1 (index 0), the statement will evaluate to falsy.


      /* These three lines store the commands that the player currently considered has entered. 
       * The controls object is defined at the top. 
       * The effectiveCommands var is local, and will reset each loop.
      */
    let effectiveCommands = {}
    for (const command in controls) {
      if ( keys[  controls[command] [players.indexOf(player)]  ]) effectiveCommands[command] = true
    }

        /// PHYSICS AND FOUNDATIONAL LOGIC ///
  if (!player.grounded) 
  player.velocity.y += gravityForce;

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
  // Moves the player along its trajectory

  if (player.position.y >= canvas.height) {
    player.position.y = canvas.height;
    player.grounded = true;
    player.doubleJump = true;
    // When the player is on the ground, keep it there and refresh the jump states.
  }
  if (player.position.x < 0) player.position.x = 0;
  if (player.position.x > canvas.width - player.animator.width) player.position.x = canvas.width - player.animator.width;


  /* Available commands are left, right, jump, and attack, all in lower case.
   * 
   * 
   * Left + right => still
   * side => move in chosen direction at constant pace
   * jump => I think you can figure this one out..
   * 
   * 
   * 
  */

  if (player.stun >= 0) { // The player does not have control of their character while stunned/performing an attack.
    
    let AnimationName;
    let AnimationDuration = 1800;


    if (effectiveCommands.left === effectiveCommands.right) {
      player.velocity.x = 0;
      AnimationName = "idle"
    } else if (effectiveCommands.left) {
      player.velocity.x = -player.speed
      player.lookDirection = -1
      AnimationName = "run"
    } else if (effectiveCommands.right) {
      player.velocity.x = player.speed
      player.lookDirection = 1
      AnimationName = "run"
    } // Could probably be moved to a method in the player class, ask Ray

    if (effectiveCommands.jump) {
      player.Jump();
      AnimationDuration = 1000;
      AnimationName = "jump"
    }

    if (effectiveCommands.attack && player.grounded) { 
      player.stun += 500;
      AnimationDuration = 400
      AnimationName = "groundedAttack"
    }

    AnimationName += (player.lookDirection === 1) ? "Right" : "Left"

    
    if (player.animator.name !== AnimationName){
    player.ChangeAnimation(AnimationName, AnimationDuration) }

    if (player.animator.name !== AnimationName)    player.ChangeAnimation(AnimationName, AnimationDuration) 

  } else player.stun -= timestep;



// Compare hitboxes for collision detection
if (
  player.hitbox.position.x < otherPlayer.hitbox.position.x + otherPlayer.hitbox.width &&
  player.hitbox.position.x + player.hitbox.width > otherPlayer.hitbox.position.x &&
  player.hitbox.position.y < otherPlayer.hitbox.position.y + otherPlayer.hitbox.height &&
  player.hitbox.position.y + player.hitbox.height > otherPlayer.hitbox.position.y
) {
  // Collision detected
  console.log("Collision detected between player and otherPlayer");
  // You can add whatever logic you need here when a collision is detected
}




  player.animator.timepassed += timestep;
  if (player.animator.timepassed > player.animator.duration) {
    player.animator.timepassed = 0;
  }
  let frame = Math.floor(player.animator.maxFrames * player.animator.timepassed / player.animator.duration) // this line calculates the frame index player is currently at.
  ctx.drawImage(player.animator.spriteSheet, frame * player.animator.width, 0, player.animator.width, player.animator.height, player.position.x, player.position.y - player.animator.height, player.animator.width, player.animator.height, player.hitbox.position.x, player.hitbox.position.y, player.hitbox.width, player.hitbox.height);

  }

  requestAnimationFrame(update)
}


