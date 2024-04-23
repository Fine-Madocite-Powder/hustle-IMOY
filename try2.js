const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = "background.jpg"

const audio = document.getElementById("GameAudio")
window.onload = function() {
  audio.play()
  audio.volume = 0.06;
}



let Animations = {};
let players = [new Player(50,50), new Player(100,50)]


let lastTimestamp = 0,
maxFPS = 30,
timestep = 1000 / maxFPS // ms for each frame
const gravityForce = 1 //Gravity so the player falls smoothly//

let keys = {
  ArrowRight: false,
  w: false
}

// Hello future me! You gotta store these inputs as a variable, and then have update() execute based on the variable.
window.addEventListener("keydown", (event) => { 
  //An eventlistener that listens to which key is pressed and act in respons depending on the key. The even object is the key that's being pressed//
  let player;
  if (['w','a','d','f'].includes(event.key)) player = players[0]
  else player = players[1];
  
  keys[event.key] = true
  switch (event.key) {

    case "d":
    case "ArrowRight":
      player.velocity.x = 4
      player.lookDirection = 1
      let exchangeD = new Anim (Animations.redRunRight.maxFrames, Animations.redRunRight.spriteSheet, 800, Animations.redRunRight.width, Animations.redRunRight.height, "run");
      if (exchangeD.spriteSheet !== player.animator.spriteSheet) player.animator = exchangeD;
      break

    case "w":
    case "ArrowUp":
      player.Jump();

      let spriteSheetJ;

      (player.lookDirection === 1) ? spriteSheetJ = Animations.jumpRedRight.spriteSheet : spriteSheetJ = Animations.jumpRedLeft.spriteSheet;

      let exchangeJ = new Anim (Animations.jumpRedLeft.maxFrames, spriteSheetJ, 1500, Animations.jumpRedLeft.width, Animations.jumpRedLeft.height, "jump")
      if (exchangeJ.spriteSheet !== player.animator.spriteSheet) player.animator = exchangeJ
      break

    case "a":
    case "ArrowLeft":
      player.velocity.x = -4
      player.lookDirection = -1
      let exchangeA = new Anim (Animations.redRunLeft.maxFrames, Animations.redRunLeft.spriteSheet, 800, Animations.redRunLeft.width, Animations.redRunLeft.height, "run");
      if (exchangeA.name !== player.animator.name) player.animator = exchangeA
      break

    case "f":
    case "-":
      let exchangeF = new Anim(Animations.standingAttack.maxFrames, Animations.standingAttack.spriteSheet, 600, Animations.standingAttack.width, Animations.standingAttack.height, "attack")
      if (exchangeF.name !== player.animator.name) player.animator = exchangeF
      break
  }
})

window.addEventListener("keyup", (event) => {  //Event listener that listens to when you stop pressing a key to stop player 1 from moving//
  let player = null;
  if (["d", "a"].includes(event.key)) player = players[0];
  else player = players[1];

  switch (event.key) { 
    case "d":
    case "a":
    case "ArrowRight":
    case "ArrowLeft":
      player.velocity.x = 0
      break
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

let assetLoader = new AssetLoader(["background.jpg", "Red/JumpRedLeft.png", "Red/RunRedRight.png", "Red/RunRedLeft.png", "Red/IdleRedRight.png", "Red/IdleRedLeft.png", "Red/AttackRed.png", "Red/JumpRedRight.png"])
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
    idleRedRight: {
      spriteSheet: assetLoader.getImage("Red/IdleRedRight.png"),
      width: 34,
      height: 32,
      maxFrames: 6
    },
    idleRedLeft: {
      spriteSheet: assetLoader.getImage("Red/IdleRedLeft.png"),
      width: 34,
      height: 32,
      maxFrames: 6
    },
    standingAttack: {
      spriteSheet: assetLoader.getImage("Red/AttackRed.png"),
      width:34,
      height: 32,
      maxFrames: 4
    },
    jumpRedRight: {
      spriteSheet: assetLoader.getImage("Red/JumpRedRight.png"),
      width:34,
      height:32,
      maxFrames: 8
    },
    jumpRedLeft: {
      spriteSheet: assetLoader.getImage("Red/JumpRedLeft.png"),
      width:34,
      height:32,
      maxFrames: 8
    }
  }

  for (let player of players) {
    player.animator = new Anim (Animations.idleRedRight.maxFrames, Animations.idleRedRight.spriteSheet, 2000, Animations.idleRedRight.width, Animations.idleRedRight.height, "idleRight");
  }

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
  


  for (let i = 0; i < players.length; i++) {
    let player = players[i];

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;

  if (player.position.y >= canvas.height) {
    player.position.y = canvas.height;
    player.grounded = true;
    player.doubleJump = true;

    let IspriteSheet;
    (player.lookDirection === 1) ? IspriteSheet = Animations.idleRedRight.spriteSheet : IspriteSheet = Animations.idleRedLeft.spriteSheet;

    let exchangeI = new Anim(Animations.idleRedLeft.maxFrames, IspriteSheet, 2000, Animations.idleRedLeft.width, Animations.idleRedLeft.height, "idle")
    if (exchangeI.name !== player.animator.name && player.velocity.x == 0) player.animator = exchangeI
  }
  if (player.position.x < 0) player.position.x = 0;
  if (player.position.x > canvas.width - player.animator.width) player.position.x = canvas.width - player.animator.width;

  if (!player.grounded) {
    player.velocity.y += gravityForce;
  }


  player.animator.timepassed += timestep;
  if (player.animator.timepassed > player.animator.duration) {
    player.animator.timepassed = 0;
  }

  let frame = Math.floor(player.animator.MaxFrames * player.animator.timepassed / player.animator.duration); // this line calculates the frame index player is currently at.
  ctx.drawImage(player.animator.spriteSheet, frame * player.animator.width, 0, player.animator.width, player.animator.height, player.position.x, player.position.y - player.animator.height, player.animator.width, player.animator.height);

  }

  requestAnimationFrame(update)
}


ctx.drawImage(background, 0, 0, canvas.width, canvas.height);



