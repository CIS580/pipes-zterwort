"use strict";


module.exports = exports = Pipe;

function Pipe(position, isStart, isEnd){
  this.x = position.x;
  this.y = position.y;
  this.width  = 31;
  this.height = 32;
  this.startOrEnd = false;
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;

if(isStart == false){
  if(isEnd == true){
    this.frameX = 3;
    this.frameY = 0;
    this.startOrEnd = true;
  }
  else{
    do{
      var randomX = Math.floor(Math.random() * 4);
      var randomY = Math.floor(Math.random() * 5);
    } while((randomX == 0 && randomY == 4) || (randomX == 3 && randomY == 3) || (randomX == 3 && randomY == 4) || (randomX == 1 && randomY == 1) || (randomX == 1 && randomY == 3) || (randomX == 1 && randomY == 4) || (randomX == 2 && randomY == 3) || (randomX == 2 && randomY == 4) || (randomX == 3 && randomY == 1) || (randomX == 3 && randomY == 2) || (randomX == 0 && randomY == 0))
    this.frameX = randomX;
    this.frameY = randomY;
  }
}
else{
  this.frameX = 1;
  this.frameY = 0;
  this.startOrEnd = true;
}
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/pipes.png');
  this.ooze = false;

  if(this.frameX == 0 && this.frameY == 1){
    this.direction = "up"
  }else if(this.frameX == 1 && this.frameY == 1){
    this.direction = "right"
  }else if(this.frameX == 2 && this.frameY == 1){
    this.direction = "down"
  }else if(this.frameX == 0 && this.frameY == 2){
    this.direction = "up"
  }else if(this.frameX == 1 && this.frameY == 2){
    this.direction = "right"
  }else if(this.frameX == 2 && this.frameY == 2){
    this.direction = "up"
  }else if(this.frameX == 0 && this.frameY == 3){
    this.direction = "up"
  }else if(this.frameX == 1 && this.frameY == 0){
    this.direction = "right"
  }else if(this.frameX == 2 && this.frameY == 0){
    this.direction = "right";
  }else if(this.frameX == 3 && this.frameY == 0){
    this.direction = "right"
  }
}


Pipe.prototype.render = function(ctx, rotate, rotateBy){
  if(rotate){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
      this.spritesheet,
      this.frameX * 32, this.frameY * 32, this.width, this.height,
      this.x, this.y - 64, 64, 64
    );
    ctx.restore();
  }
  ctx.drawImage(
    this.spritesheet,
    this.frameX * 32, this.frameY * 32, this.width, this.height,
    this.x, this.y, 64, 64
  );
}

Pipe.prototype.fillOoze = function (ctx) {
  ctx.fillStyle = "#5CFF00";
  if(this.left && this.right){
    ctx.fillRect(this.x, this.y + 25, 10 + this.count, 10);
  }
  else if(this.up && this.down){
    ctx.fillRect(this.x, this.y + 25, 10 , 10 + this.count);
  }
  if(this.count < 55){
    this.count++;
  }
};
