class Player {
  constructor(x, y, assetLoader, color) {
      this.health = 10;
      this.color = color
      this.assetLoader = assetLoader;
      this.speed = 4;
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
        width: 0,
        height: -38
      }
      this.lookDirection = 1; // 1 is right, -1 is left. Probably will be used for the flipping of hitboxes.
      this.grounded = false;
      this.doubleJump = true;
      this.animator = new Anim(null, null, null, null, null, null)
      this.hitbox = {
        width: 34,
        height: 32,
      }
  }

  Jump() {
      if (this.grounded) {
        this.velocity.y = -11;
        this.grounded = false;
      } else if (this.doubleJump && this.velocity.y > -6) { // The second condition is there to prevent both jumps from being consumed in successive frames, which felt like shit.
        this.velocity.y = -9;
        this.doubleJump = false;
      }
    }

  ChangeAnimation(animationName, AnimationDuration) {


    if (this.animator.name !== animationName + ((this.lookDirection === 1) ? "Right" : "Left")) {


    this.animator = new Anim(
      Animations[animationName].maxFrames,
      this.assetLoader.getImage(`${this.color}/${animationName}${(this.lookDirection === 1) ? "Right" : "Left"}.png`), 
      AnimationDuration, 
      Animations[animationName].width, 
      Animations[animationName].height, 
      animationName + ((this.lookDirection === 1) ? "Right" : "Left"))
    }
  }
}