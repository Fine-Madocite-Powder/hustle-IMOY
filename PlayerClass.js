class Player {
  constructor(x, y) {
      this.health = 10;
      this.speed = 5;
      this.state = "idle right";
      this.stun = 0; // Prevents the player from entering other commands while attacking or immediately after being struck by an attack. 
      this.velocity = { // The x and y coordinates below determine the direction the player will be displaced each frame. 
          x: 0,
          y: 0
      }
      this.position = { // This object stores the position of the player.
          x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
          y: y // The starting position of each player is determined by the respective parameters when the objects are created.
      }
      this.hitbox = {
        position: this.position,
        width: 38,
        height: -38
      }
      this.lookDirection = 1; // Used to flip the hitboxes of attacks
      this.grounded = false;
      this.doubleJump = true;
      this.animator = new Anim(null, null, null, null, null, null) // creates a new animator. Will 
      this.hitbox = {
        position: this.position, //Position of the hitbox is dependant on the position of the player
        width: 34,
        height: 32,
      }
  }

  Jump() {
      if (this.grounded) {
        this.velocity.y = -11;
        this.grounded = false;
      } else if (this.doubleJump && this.velocity.y > -7) { // The second condition is there to prevent both jumps from being consumed in successive frames, which felt like shit.
        this.velocity.y = -9;
        this.doubleJump = false;
      }
    }

  ChangeAnimation(animationName, duration) {
    console.log("Boob")
    if (this.animator.name !== animationName)
    
    this.animator = new Anim(
      Animations[animationName].MaxFrames, 
      Animations[animationName].spriteSheet, 
      duration, 
      Animations[animationName].width, 
      Animations[animationName].height, 
      animationName )
  }
}