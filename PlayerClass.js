class Player {
  constructor(x, y, assetLoader, color) {
    this.color = color
    this.assetLoader = assetLoader;

    this.health = 8;
    this.speed = 4;
    this.hitbox = {
      width: 34,
      height: 32,
    }

    this.attackReady = true;
    this.shieldUp = true;
    this.grounded = false;
    this.doubleJump = true;
    this.stun = 0; // Prevents the player from entering other commands while attacking or immediately after being struck by an attack. 
    
    this.velocity = { // The x and y coordinates below determine the direction the player will be displaced each frame. 
      x: 0,
      y: 0
    }
    this.position = { // This object stores the position of the player.
      x: x, // The position is at the bottom left of the player's sprite (at least, that's where it will be rendered from)
      y: y // The starting position of each player is determined by the respective parameters when the objects are created.
    }
    this.lookDirection = 1; // 1 is right, -1 is left. Probably will be used for the flipping of hitboxes.

      
    this.animator = new Anim(null, null, null, null, null, null)
  }

  Jump() {
    if (this.grounded) {
      this.velocity.y = 11;
      this.grounded = false;
    } else if (this.doubleJump && this.velocity.y < 6) { 
      // The second condition is there to prevent both jumps from 
      // being consumed in successive frames, which felt like shit.
      
      this.velocity.x = 4 * this.lookDirection;
      this.velocity.y = 9;

      this.doubleJump = false;
    }
  }

  Shield() {

  }

  GroundedAttack(otherPlayer) {

    if(otherPlayer.animator.name === "shieldLeft" || otherPlayer.animator.name === "shieldRight") return 
    

    this.attackReady = false


    if (AttackAudio.currentTime > 0.25 && !AttackAudio.paused) AttackAudio.currentTime = 0
    else AttackAudio.play()

    const atkhitbox = {
      position: {
        x: this.position.x + this.lookDirection * (this.hitbox.width / 2 - 5),
        y: this.position.y
      },
      width: 34,
      height: 60
    }

    if (
      atkhitbox.position.x < otherPlayer.position.x + otherPlayer.hitbox.width / 2 &&
      atkhitbox.position.x + atkhitbox.width / 2 > otherPlayer.position.x 
      &&
      atkhitbox.position.y < otherPlayer.position.y + otherPlayer.hitbox.height / 2 &&
      atkhitbox.position.y + atkhitbox.height / 2 > otherPlayer.position.y
    ) {


      otherPlayer.stun += 200
      otherPlayer.grounded = false;
      otherPlayer.velocity.y = 8;
      otherPlayer.velocity.x = 3 * this.lookDirection
      otherPlayer.health -= 1
    }
  }

  TakeDamage(dmg) {
    this.health -= dmg
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