"use strict";


module.exports = exports = Ooze;

function Ooze(x, y){
  this.x = x;
  this.y = y;
  this.width = 0;
  this.height = 0;
  this.xComplete = false;
  this.yComplete = false;
  this.changeY = 0;

  this.direction = "right"

  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
}

Ooze.prototype.updateOoze = function(level){
  switch(this.direction){
    case "right":
      if(this.width < 64) this.width += .25;
      else this.xComplete = true;
      if(this.height > -64) this.height -= 64;
      else this.yComplete = true;
      break;
    case "up":
      if(this.height == -64) this.height = 0;
      if(this.width < 64) this.width += 64;
      else this.xComplete = true;
      if(this.height > -63.75) this.height -= .25;
      else this.yComplete = true;
      break;
    case "down":
      if(this.height < 0){
        this.height = 0;
        this.changeY = -64;
      }
      if(this.width < 64) this.width += 64;
      else this.xComplete = true;
      if(this.height < 63.75) this.height += .25;
      else this.yComplete = true;
      break;
  }
}

Ooze.prototype.render = function(ctx){
  ctx.fillStyle = "#5CFF00";
  ctx.fillRect(this.x, (this.y + 64) + this.changeY, this.width, this.height);
}
