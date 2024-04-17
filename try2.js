const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"

Animations = {};

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

let assetLoader = new AssetLoader(["background.jpg", "Red/RunRedRight.png", "Red/RunRedLeft.png"])
assetLoader.load().then(() => {
  
  Animations = {
    greenRunRight: {
      spriteSheet: assetLoader.getImage("Red/RunRedRight"),

    },

        redRunRight: {
          spriteSheet: assetLoader.getImage("Red/RunRedRight.png"),
          width: 34,
          height: 32,
          maxFrames: 8
        },
    
        IdleRed: {
          spriteSheet: document.getElementById("IdleRed"),
          width: 34,
          height: 32,
          length: 4,
        },

        redRunLeft: {
          spriteSheet: assetLoader.getImage("Red/RunRedLeft.png"),
          width: 34,
          height: 32,
          maxFrames: 8
        }
      }
      
  requestAnimationFrame(update)
})


/* "Animations" is an object that stores information about sprites that need to be rendered.
Remove it from here, declare it at the top, 
const Animations = {
<<<<<<< HEAD
    standingAttack: {
      spriteSheet: document.getElementById("standingAttack"),
      width: 34,
      height: 32,
      length: 8
    },
    walkRight: {
        spriteSheet: document.getElementById("walking right"),
        width: 24,
        height: 24,
        length: 4
    },

    greenRunRight: {
      spriteSheet: document.getElementById("greenRunRight"),
=======
    redRunRight: {
      spriteSheet: assetLoader.getImage("Red/RunRedRight.png"),
      width: 34,
      height: 32,
      maxFrames: 8
    },
<<<<<<< HEAD
    greenRunLeft: {
      spriteSheet: document.getElementById("greenRunLeft"),
      width: 36,
      height: 36,
      length: 4
    },

    IdleRed: {
      spriteSheet: document.getElementById("IdleRed"),
      width: 34,
      height: 32,
      length: 4,
=======
    redRunLeft: {
      spriteSheet: assetLoader.getImage("Red/RunRedLeft.png"),
      width: 34,
      height: 32,
      maxFrames: 8
    }
  }
*/


let players = [new Player(50,50), new Player(100, 50)];
let player1 = new Player(50,50); // MaxFrames, spriteSheet, duration, width, height

player1.animator = new Anim (Animations.IdleRed.length, Animations.IdleRed.spriteSheet, 1000, Animations.IdleRed.width, Animations.IdleRed.height, "runRight");



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

console.log(ctx);
console.log(background);

ctx.drawImage(background, 0, 0, canvas.width, canvas.height);



// Hello future me! You gotta store these inputs as a variable, and then have update() execute based on the variable.
window.addEventListener("keydown", (event) => { //An eventlistener that listens to which key is pressed and act in respons depending on the key. The even object is the key that's being pressed//
  switch (event.key) {
    case "d":
    case "D":
      player1.velocity.x = 4
      player1.lookDirection = 1
      let exchangeD = new Anim (Animations.redRunRight.maxFrames, Animations.redRunRight.spriteSheet, 1000, Animations.redRunRight.width, Animations.redRunRight.height, "runRight");
      if (exchangeD.spriteSheet !== player1.animator.spriteSheet) player1.animator = exchangeD;
      break;
    case "w":
    case "W":
      player1.Jump();
      break
    case "a":
    case "A":
      player1.velocity.x = -4
      player1.lookDirection = -1
      let exchangeA = new Anim (Animations.redRunLeft.maxFrames, Animations.redRunLeft.spriteSheet, 1000, Animations.redRunLeft.width, Animations.redRunLeft.height, "runLeft");
      if (exchangeA.name !== player1.animator.name) player1.animator = exchangeA
      break
    case "f":
      let exchangeF = new Anim(Animations.standingAttack.length, Animations.standingAttack.spriteSheet, 1000, Animations.standingAttack.width, Animations.standingAttack.height, "RedAttack")
      if (!(exchangeF.name === player1.animator.name)) player1.animator = exchangeF
      break
    default:
      let exchangeI = new Anim(Animations.IdleRed.length, Animations.IdleRed.spriteSheet, 1000, Animations.IdleRed.width, Animations.IdleRed.height, "RedIdle")
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