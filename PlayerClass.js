//import Anim from './AnimClass'

class Player {
    constructor(x, y) {
        this.health = 10;
        this.stun = 0; // Prevents the player from entering other commands while attacking or immediately after being struck by an attack. 
        this.velocity = { // The x and y coordinates below determine the direction the player will be displaced each frame. 
            x: 0,
            y: 0
        }
        this.position = { // This object stores the position of the player.
            x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
            y: y // The starting position of each player is determined by the respective parameters when the objects are created.
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

//export default Player