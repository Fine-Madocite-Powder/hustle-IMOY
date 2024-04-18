const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"

const audio = document.getElementById("GameAudio")
window.onload = function() {
  audio.play()
}



let Animations = {};
let player1 = new Player(50,50); // MaxFrames, spriteSheet, duration, width, height

let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

// Hello future me! You gotta store these inputs as a variable, and then have update() execute based on the variable.
window.addEventListener("keydown", (event) => { //An eventlistener that listens to which key is pressed and act in respons depending on the key. The even object is the key that's being pressed//
  switch (event.key) {
    case "d":
      player1.velocity.x = 4
      player1.lookDirection = 1
      let exchangeD = new Anim (Animations.redRunRight.maxFrames, Animations.redRunRight.spriteSheet, 800, Animations.redRunRight.width, Animations.redRunRight.height, "runRight");
      if (exchangeD.spriteSheet !== player1.animator.spriteSheet) player1.animator = exchangeD;
      break;
    case "w":
      player1.Jump();
      break
    case "a":
      player1.velocity.x = -4
      player1.lookDirection = -1
      
      
      let exchangeA = new Anim (Animations.redRunLeft.maxFrames, Animations.redRunLeft.spriteSheet, 800, Animations.redRunLeft.width, Animations.redRunLeft.height, "runLeft");
      
      
      if (exchangeA.name !== player1.animator.name) player1.animator = exchangeA
      break
    case "f":
      let exchangeF = new Anim(Animations.standingAttack.maxFrames, Animations.standingAttack.spriteSheet, 600, Animations.standingAttack.width, Animations.standingAttack.height, "RedAttack")
      if (exchangeF.name !== player1.animator.name) player1.animator = exchangeF
      break
    default:
      let exchangeI = new Anim(Animations.IdleRed.maxFrames, Animations.IdleRed.spriteSheet, 1000, Animations.IdleRed.width, Animations.IdleRed.height, "RedIdle")
      if (!(exchangeI.name === player1.animator.name)) player1.animator = exchangeI
      break
  }
})

window.addEventListener("keyup", (event) => {  //Event listener that listens to when you stop pressing a key to stop player 1 from moving//
    switch (event.key) { 
    case "d":
    case "D":
    case "a":
    case "A":
      player1.velocity.x = 0
      break
    case "f": //Attack animation//
      
  }
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
          console.log(src, "loaded")

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

let assetLoader = new AssetLoader(["background.jpg", "Red/RunRedRight.png", "Red/RunRedLeft.png", "Red/IdleRed.png", "Red/AttackRed.png"])
assetLoader.load().then(() => {
  
  Animations = { // Stoppa in alla animationer i animations-objektet
    redRunRight: {
      spriteSheet: assetLoader.getImage("Red/RunRedRight.png"),
      width: 34,
      height: 32,
      maxFrames: 8
    },
    redRunLeft: {
      spriteSheet: assetLoader.getImage("Red/RunRedLeft.png"),
      width: 34,
      height: 32,
      maxFrames: 8
    },
    IdleRed: {
      spriteSheet: assetLoader.getImage("Red/IdleRed.png"),
      width: 34,
      height: 32,
      maxFrames: 4
    },
    standingAttack: {
      spriteSheet: assetLoader.getImage("Red/AttackRed.png"),
      width:34,
      height: 32,
      maxFrames: 4
    }
  }

  player1.animator = new Anim (Animations.IdleRed.maxFrames, Animations.IdleRed.spriteSheet, 1000, Animations.IdleRed.width, Animations.IdleRed.height, "runRight");


  requestAnimationFrame(update) 
  // After having loaded all images, put them into the assetLoader library, 
  // and written the Animations object, start the Update function for the first time.
})


function update(timestamp) {

  if (timestamp - lastTimestamp < timestep) {
      // Only continue if one timestep (1000/15 ms) has passed. Otherwise, schedule the next frame and cancel the current update code.
      requestAnimationFrame(update)
      return
  }
  lastTimestamp = timestamp
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
  player1.position.x += player1.velocity.x;
  player1.position.y += player1.velocity.y;

  if (player1.position.y >= canvas.height) {
    player1.position.y = canvas.height;
    player1.grounded = true;
    player1.doubleJump = true;
  }
  if (player1.position.x < 0) player1.position.x = 0;
  if (player1.position.x > canvas.width - player1.animator.width) player1.position.x = canvas.width - player1.animator.width;

  if (!player1.grounded) {
    player1.velocity.y += gravityForce;
  }


  player1.animator.timepassed += timestep;
  if (player1.animator.timepassed > player1.animator.duration) {
    player1.animator.timepassed = 0;
  }

  let frame = Math.floor(player1.animator.MaxFrames * player1.animator.timepassed / player1.animator.duration); // this line calculates the frame index player1 is currently at.
  ctx.drawImage(player1.animator.spriteSheet, frame * player1.animator.width, 0, player1.animator.width, player1.animator.height, player1.position.x, player1.position.y - player1.animator.height, player1.animator.width, player1.animator.height);



  requestAnimationFrame(update)
}


ctx.drawImage(background, 0, 0, canvas.width, canvas.height);



