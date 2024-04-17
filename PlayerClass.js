class Player {
    constructor(x, y) {
        this.health = 10;
        this.stun = 0;
        this.velocity = { // The x and y coordinates below determine the direction the player is moving. 
            x: 0,
            y: 0
        }
        this.position = { // This object stores the position of the player.
            x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
            y: y // The starting position of either player is determined by the respective input variables when the objects are created.
        }
        this.lookDirection = 1; // This variable is used to flip assets when the player starts moving in differend directions.
                                // 1 means looking right, -1 means looking left.
        this.grounded = false;
        this.doubleJump = true;
        this.animator = new Anim(null, null, null, null, null, null)
    }
    Jump() {
        if (this.grounded) { 
          this.velocity.y = -10;
          this.grounded = false;
        } else if (this.doubleJump) {
          this.velocity.y = -8;
          this.doubleJump = false;
          this.grounded = false;
        }
      }
      // Add jump and attack functions. An attack funciton has to has as long of a windup as it has an animation, unfortunately.
      /*  Aerial attack: stop x and y velocity, 
      *   Standing attack: short stoptimer
      */  
}

export default Player