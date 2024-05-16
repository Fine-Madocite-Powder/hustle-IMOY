const Animations = { // Data used in rendering and creating anim objects.
  run: {
    width: 34,
    height: 32,
    maxFrames: 8
  },
  idle: {
    width: 34,
    height: 32,
    maxFrames: 6
  },
  groundedAttack: {
    width:34,
    height: 32,
    maxFrames: 8
  },
  jump: {
    width:34,
    height:32,
    maxFrames: 8
  },
  groundedAttack: {
    width: 34,
    height: 32,
    maxFrames: 3
  },
  death: {
    width: 34,
    height: 32,
    maxFrames: 8
  },
  shield: {
    width: 36,
    height: 32,
    maxFrames: 3
  }
}


class Anim {
  constructor(maxFrames, spriteSheet, duration, frameWidth, height, name) {
      this.frameWidth = frameWidth; 
      this.name = name;   // As spritesheets seemingly cannot be compared (tried "if (spriteSheet1 !== spriteSheet")"),
                          // the name variable will instead be used to make sure the timepassed variable below is not re-set
                          // to 0 each time the updater judges that the animation should continue playing.
      this.height = height;
      this.maxFrames = maxFrames;
      this.spriteSheet = spriteSheet;
      this.duration = duration; // This is the full length of the animation, given in milliseconds. Could be stored in the Animations object, will see what we do later.
      this.timepassed = 0;
  }
}