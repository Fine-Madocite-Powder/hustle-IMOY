const canvas = document.getElementById("GameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"

const AttackAudio = document.getElementById('AttackAudio')

const VictoryAudio = document.getElementById('Victory')
VictoryAudio.loop = false

const Gameaudio = document.getElementById('GameAudio')

let ScoreBoard = document.getElementById('ScoreBoard')

let players = []

// This object contains the keybinds for different actions. Player 1 uses the first column of keybinds, player 2 the second.
const controls = {
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  jump: ["ArrowUp", "KeyW"],
  attack: ["Slash", "KeyF"],
  shield: ["ShiftRight", "KeyE"]
}

let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

let loserIndex = null,
  deathIsFinished = false,
  score = [0, 0]

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

function UpdateScore(ID) {
  score[ID]++

  ScoreBoard.innerHTML = `${score[0]}  XXX  ${score[1]}`
}

function startGame() {
  players = [
  new Player(canvas.width - 84, 50, assetLoader, "Red"), 
  new Player(50, 50, assetLoader, "RedMod")]

  for (let player of players) {
    player.ChangeAnimation("jump", 1400);
  }
  
  Gameaudio.play()
  Gameaudio.volume = 0.3

  deathIsFinished = false
  UpdateScore(2) // UpdateScore(2) updates the text inside the <p> element without changing the score, as there is no third player

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
  
  ctx.fillStyle = "black"
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40)

  for (let i = 0; i < players.length; i++) {
    
      // Defining both players
      let player = players[i];
      let otherPlayer;
      otherPlayer = (i) ? players[0] : players[1]
      // If we are currently calculating for player 1 (index 0), the statement will evaluate to falsy.

      // Drawing each player's health bar
      for (let j = 0; j < player.health; j++) {

        // Reminder: i = players.indexOf(player), from player's declaration
        let xFlip;
        if (i) { // When drawing player 2's health bar, draw from right to left. For player 1, do the opposite.
          xFlip = -1
        } else {
          xFlip = 1
        }
        ctx.fillStyle = "red"
        ctx.fillRect(canvas.width * i + (xFlip * j * 21), canvas.height - 35, 20 * xFlip, 30) // Leaves 1 pixel of space between each red bar
      }

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

    if (player.position.y >= canvas.height - 40) {
      player.position.y = canvas.height - 40;
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

        if (effectiveCommands.shield && player.shieldUp) {
          player.Shield()
          AnimationDuration = 500
          AnimationName = "shield"
        }
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
    
    if (frame === 3 && player.animator.name.slice(0, 6) === "shield") { // If the shield move has finished, the player goes back into idle.
      player.shieldUp = false;
      player.ChangeAnimation("idle", 1800)
    }

    if (frame === 1 && player.attackReady)
      switch (player.animator.name) {
        case "groundedAttackRight":
        case "groundedAttackLeft":
          player.GroundedAttack(otherPlayer);
          player.attackReady = false;
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
      loserIndex = 0
    } else {
      loserIndex = 1
    }

    players[loserIndex].ChangeAnimation("death", 3000)

    const winnerIndex = loserIndex === 0 ? 1 : 0
    players[winnerIndex].ChangeAnimation("jump", 1000) 

    UpdateScore(loserIndex) // Adds 1 to the winner.


    keys = {}
    Gameaudio.pause()
    Gameaudio.currentTime = 0
    VictoryAudio.play()

  }
}


function endGame (timestamp) {

  if (timestamp - lastTimestamp < timestep) {
    // Only continue if one timestep (1000/15 ms) has passed. Otherwise, schedule the next frame and cancel the current endGame code.
    requestAnimationFrame(endGame)
    return
  }
  lastTimestamp = timestamp 

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Refreshes the canvas.

  ctx.fillRect(0, canvas.height - 40, canvas.width, 40)

  for (let i = 0; i < players.length; i++) {
    const player = players[i]

    if (player.position.y < canvas.height - 40) player.position.y++

    if (i === loserIndex) {

      if (player.animator.timepassed + timestep < player.animator.duration && !(deathIsFinished)) {
        player.animator.timepassed += timestep
      } else {
        deathIsFinished = true
        player.animator.timepassed = player.animator.duration - 1
      }
    } else {
      player.animator.timepassed += timestep

      if (player.animator.timepassed > player.animator.duration) {
        player.animator.timepassed = 0;
      }
    }


    frame = Math.floor(player.animator.maxFrames * player.animator.timepassed / player.animator.duration) 
  
    console.log(player.animator.timepassed)

    ctx.drawImage(player.animator.spriteSheet,
      frame * player.animator.frameWidth, 0,
      player.animator.frameWidth, player.animator.height,
      player.position.x, player.position.y - player.animator.height,
      player.animator.frameWidth, player.animator.height,
    )

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