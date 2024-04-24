class Anim {
  constructor(MaxFrames, spriteSheet, duration, width, height, name) {
      this.width = width; 
      this.name = name;   // As spritesheets seemingly cannot be compared (tried "if (spriteSheet1 !== spriteSheet")"),
                          // the name variable will instead be used to make sure the timepassed variable below is not re-set
                          // to 0 each time the updater judges that the animation should continue playing.
      this.height = height;
      this.MaxFrames = MaxFrames;
      this.spriteSheet = spriteSheet;
      this.duration = duration; // This is the full length of the animation, given in milliseconds. Could be stored in the Animations object, will see what we do later.
      this.timepassed = 0;
  }
}