const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"

const AttackAudio = document.getElementById('AttackAudio')
const VictoryAudio = document.getElementById('Victory')
VictoryAudio.loop = false

const Gameaudio = document.getElementById('GameAudio')

let players = []

Animations = { // Data used in rendering and creating anim objects.
  run: {
    width: 34,
    height: 32,
    maxFrames: 8
  },
  idle: {
    width: 34,
    height: 32,
    maxFrames: 6
  },
  groundedAttack: {
    width:34,
    height: 32,
    maxFrames: 8
  },
  jump: {
    width:34,
    height:32,
    maxFrames: 8
  },
  groundedAttack: {
    width: 34,
    height: 32,
    maxFrames: 3
  },
  death: {
    width: 34,
    height: 32,
    maxFrames: 8
  },
  shield: {
    width: 36,
    height: 32,
    maxFrames: 3
  }
}

const controls = {
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  jump: ["KeyW", "ArrowUp"],
  attack: ["KeyF", "Slash"],
  shield: ["KeyE", "ShiftRight"]
}

let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

let keys = { }

window.addEventListener("keydown", (event) => {

  keys[event.code] = true

})
window.addEventListener("keyup", (event) => {

  keys[event.code] = false

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
"Red/deathLeft.png",
"Red/deathRight.png", 
"Red/idleLeft.png", 
"Red/idleRight.png", 
"Red/jumpLeft.png", 
"Red/jumpRight.png", 
"Red/runLeft.png", 
"Red/groundedAttackRight.png",
"Red/groundedAttackLeft.png",
"Red/runRight.png",
"Red/shieldLeft.png",
"Red/shieldRight.png",

"RedMod/deathLeft.png",
"RedMod/groundedAttackLeft.png",
"RedMod/groundedAttackRight.png", 
"RedMod/deathRight.png", 
"RedMod/idleLeft.png", 
"RedMod/idleRight.png", 
"RedMod/jumpLeft.png", 
"RedMod/jumpRight.png", 
"RedMod/runLeft.png", 
"RedMod/runRight.png",
"RedMod/shieldLeft.png",
"RedMod/shieldRight.png"
])

function startGame() {
  players = [
  new Player(50, 50, assetLoader, "Red"), 
  new Player(200, 50, assetLoader, "RedMod")]

  for (let player of players) {
    player.ChangeAnimation("jump", 1400);
  }
  
  Gameaudio.play()
  Gameaudio.volume = 0.3

  requestAnimationFrame(update) 
}


assetLoader.load().then(startGame)
// When all images have finished loading, run the startGame function, initializing players and update().


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


      // These three lines store the commands that the player currently considered has entered. 
      // The controls object is defined at the top. 
      let effectiveCommands = {}
      for (const command in controls) {
        if ( keys[  controls[command][i]  ] ) effectiveCommands[command] = true
      }

          /// PHYSICS AND FOUNDATIONAL LOGIC ///
    if (!player.grounded) player.velocity.y -= gravityForce;

    player.position.x += player.velocity.x;
    player.position.y -= player.velocity.y;
    // Moves the player along its trajectory. Positive y velocity moves us upward because we aren't brutes.

    if (player.position.y >= canvas.height) {
      player.position.y = canvas.height;
      player.grounded = true;
      player.doubleJump = true;
      // When the player is on the ground, keep it there and refresh the jump states.
    }
    if (player.position.x < 0) {
      player.position.x = 0;
    }
    if (player.position.x > canvas.width - player.animator.frameWidth) {
      player.position.x = canvas.width - player.animator.frameWidth
    }


    if (player.stun <= 0) { // The player does not have control of their character while stunned or performing an attack. 
      // Attacks that started before the player was stunend will still go through, although they can miss due to knockback.
      
      let AnimationName;
      let AnimationDuration = 1800;

      if (effectiveCommands.left !== effectiveCommands.right) {
        if (effectiveCommands.left) {
          player.lookDirection = -1;
        } else {
          player.lookDirection = 1;
        }
      }
      
      if (player.grounded) {

        if (effectiveCommands.left === effectiveCommands.right) {
          player.velocity.x = 0;
          AnimationName = "idle";
        } else {
          player.velocity.x = effectiveCommands.left ? -player.speed : player.speed;
          AnimationName = "run";
        }
      }

      if (effectiveCommands.shield) {
        player.Shield()
        AnimationDuration = 500
        AnimationName = "shield"
      }

      if (effectiveCommands.jump) {
        player.Jump();
        AnimationDuration = 1000
        AnimationName = "jump"
      }

      if (effectiveCommands.attack && player.grounded) { 
        player.stun += 350 - 2 * timestep; // -timestep finns till för att förhindra en bug där första bilden i attacken visas i en frame 
        AnimationDuration = 350
        AnimationName = "groundedAttack"
      }


      if (AnimationName) // Prevents an error where AnimationName is never given a value. undefined is considered falsy.
        player.ChangeAnimation(AnimationName, AnimationDuration)

    } else player.stun -= timestep;


    player.animator.timepassed += timestep;
    if (player.animator.timepassed > player.animator.duration) {
      player.animator.timepassed = 0;
    }
    let frame = Math.floor(player.animator.maxFrames * player.animator.timepassed / player.animator.duration) 
    // this line calculates the frame index player is currently at.
    
    if (frame === 1 && player.attackReady)

      switch (player.animator.name) {
        case "groundedAttackRight":
        case "groundedAttackLeft":
          player.GroundedAttack(otherPlayer);
          player.attackReady = false
          break;
        
        case "airAttackRight":
        case "airAttackLeft":
        break;

        default:
        break;
      }

    else if (frame === 2) player.attackReady = true

    ctx.drawImage(player.animator.spriteSheet,
      frame * player.animator.frameWidth, 0,
      player.animator.frameWidth, player.animator.height,
      player.position.x, player.position.y - player.animator.height,
      player.animator.frameWidth, player.animator.height,
    );
    

  }

  if (players[1].health > 0 && players[0].health > 0) {
    requestAnimationFrame(update)
  } else {

    requestAnimationFrame(endGame)
    if (players[0].health === 0) {
      gameController.loser = players[0]
    } else {
      gameController.loser = players[1]
    }

    gameController.loser.ChangeAnimation("death", 3000)

    keys = {}
    Gameaudio.pause()
    Gameaudio.currentTime = 0

  }
}


var gameController = {
  loser: null,
  deathIsFinished: false
}

function endGame (timestamp) {

  if (timestamp - lastTimestamp < timestep) {
    // Only continue if one timestep (1000/15 ms) has passed. Otherwise, schedule the next frame and cancel the current update code.
    requestAnimationFrame(endGame)
    return
}
lastTimestamp = timestamp

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Refreshes the canvas.



  if (gameController.loser.animator.timepassed + timestep < gameController.loser.animator.duration && !(gameController.deathIsFinished)) {
    gameController.loser.animator.timepassed += timestep
  } else {
    gameController.deathIsFinished = true
    gameController.loser.animator.timepassed = gameController.loser.animator.duration - 1
  }



  let frame = Math.floor(gameController.loser.animator.maxFrames * gameController.loser.animator.timepassed / gameController.loser.animator.duration) 
 
  console.log(frame)
  
  ctx.drawImage(gameController.loser.animator.spriteSheet,
    frame * gameController.loser.animator.frameWidth, 0,
    gameController.loser.animator.frameWidth, gameController.loser.animator.height,
    gameController.loser.position.x, gameController.loser.position.y - gameController.loser.animator.height,
    gameController.loser.animator.frameWidth, gameController.loser.animator.height,
  )

  // If the victory audio hasn't been played yet and the loser's death animation has finished playing
  if (!gameController.victoryAudioPlayed && gameController.loser.animator.timepassed >= gameController.loser.animator.duration) {
    // Play the victory audio
    VictoryAudio.play();
    // Mark that the victory audio has been played
    gameController.victoryAudioPlayed = true;
  }

  // Restart the game if Enter key is pressed
  if (keys["Enter"]) {
    // Reset the game state
    gameController.victoryAudioPlayed = false;
    VictoryAudio.pause()
    VictoryAudio.currentTime = 0
    startGame();

  } else {
    // Continue rendering the endGame screen
    requestAnimationFrame(endGame);
  }
}
