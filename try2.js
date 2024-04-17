const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const background = document.getElementById("background");

import Anim from './AnimClass'
import Player from './PlayerClass'


// "Animations" is an object that stores information about sprites that need to be rendered. It does not 
const Animations = {
    redRunRight: {
      spriteSheet: document.getElementById("redRunRight"),
      width: 34,
      height: 32,
      maxFrames: 8
    },
    redRunLeft: {
      spriteSheet: document.getElementById("redRunLeft"),
      width: 34,
      height: 32,
      maxFrames: 8
    },
    greenIdleRight: {
      spriteSheet: document.getElementById("greenIdleRight"),

    }
  }




let player1 = new Player(50,50); // MaxFrames, spriteSheet, duration, width, height
player1.animator = new Anim (Animations.redRunRight.maxFrames, Animations.redRunRight.spriteSheet, 1000, Animations.redRunRight.width, Animations.redRunRight.height, "runRight");



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
requestAnimationFrame(update);
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
  }
}) 