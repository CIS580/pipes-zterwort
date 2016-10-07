(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');
const Grid = require('./grid');
const Pipe = require('./pipe');
const Ooze = require('./ooze');

/* Global variables */
var canvas = document.getElementById('screen');
var drawGrid = new Grid(canvas.width, canvas.height , 64);
var pipes = [];
var pipe5 =new Pipe({x: 64, y: 64}, false, false);
var pipe4 =new Pipe({x: 64, y: 128}, false, false);
var pipe3 =new Pipe({x: 64, y: 192}, false, false);
var pipe2 =new Pipe({x: 64, y: 256}, false, false);
var pipe1 =new Pipe({x: 64, y: 320}, false, false);
pipes[0] = pipe1;
pipes[1] = pipe2;
pipes[2] = pipe3;
pipes[3] = pipe4;
pipes[4] = pipe5;
var pipesInPlay = [];
var game = new Game(canvas, update, render);
var image = new Image();
var currentIndex, currentX, currentY;
var score = 0;
var level = 1;

var startPipe = new Pipe({x: 192,y: 384}, true, false);
var endPipe = new Pipe({x: 704,y: 384}, false, true);
var pipesInPlay = [];
pipesInPlay.push(startPipe);
pipesInPlay.push(endPipe);

var oozies = [];
var ooze1 = new Ooze(startPipe.x, startPipe.y);
oozies.push(ooze1);
var oozeCounter = 0;

var place = new Audio();
place.src = 'assets/place.wav'
place.volume = .8;

var replace = new Audio();
replace.src = 'assets/replace.wav'
replace.volume = .8

var rotate = new Audio();
rotate.src = 'assets/rotate.wav'
rotate.volume = .8;

var leak = new Audio();
leak.src = 'assets/leak.wav'
leak.volume = 1;

var complete = new Audio();
complete.src = 'assets/complete.wav'
complete.volume = 1;

var background = new Image();
background.src = 'assets/background.png'
image.src = 'assets/pipes.png';

var grid = [];
for (var x = 0; x < 9; x++) {
  for (var y = 0; y < 9; y++) {
    grid.push({x: x, y: y, used: false});
  }
}

var gameOver = false;

canvas.oncontextmenu = function(event){
  event.preventDefault();
  var ctx = canvas.getContext('2d');
  currentX = Math.floor((event.offsetX) / 64);
  currentY = Math.floor((event.offsetY) / 64);
  currentIndex = currentY * 9 + currentX;
  if(currentX < 3 || currentX > 11 || currentY < 1 || currentY > 6) return;
  if(grid[currentIndex].used){
    var x = currentX * 64;
    var y = currentY * 64;
    for (var i = 0; i < pipesInPlay.length; i++) {
      if((x == pipesInPlay[i].x) && (y == pipesInPlay[i].y)){
        pipesInPlay[i].render(ctx, true, 1);
        leak.play();
      }
    }
  }
}

canvas.onclick = function(event) {
  if(gameOver){
    return;
  }
  event.preventDefault();

  currentX = Math.floor((event.offsetX) / 64);
  currentY = Math.floor((event.offsetY) / 64);
  console.log("Current X: ", currentX);
  console.log("Current Y: ", currentY);
  currentIndex = currentY * 9 + currentX;
  if(currentX < 3 || currentX > 11 || currentY < 1 || currentY > 6 || (currentX == (startPipe.x / 64) && currentY == (startPipe.y / 64)) || (currentX == (endPipe.x / 64) && currentY == (endPipe.y / 64))) return;
  if(grid[currentIndex].used){
    pipes[0].x = currentX * 64;
    pipes[0].y = currentY * 64;
    for (var i = 0; i < pipesInPlay.length; i++) {
      if((pipes[0].x == pipesInPlay[i].x) && (pipes[0].y == pipesInPlay[i].y))
      pipesInPlay[i] = pipes[0];
      replace.play();
    }
    for (var i = 0; i < pipes.length - 1; i++) {
      pipes[i] = pipes[i + 1];
      pipes[i].y += 64;
    }
    var newPipe = new Pipe({x: 64, y: 64}, false, false);
    pipes[4] = newPipe;
  }
  else {
    pipes[0].x = currentX * 64;
    pipes[0].y = currentY * 64;
    pipesInPlay.push(pipes[0]);
    place.play();
    for (var i = 0; i < pipes.length - 1; i++) {
      pipes[i] = pipes[i + 1];
      pipes[i].y += 64;
    }
    var newPipe = new Pipe({x: 64, y: 64}, false);
    pipes[4] = newPipe;
  }
  grid[currentIndex].used = true;
  // TODO: Place or rotate pipe tile
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  if(!gameOver){
      setTimeout(function(){game.loop(timestamp)}, 1000/32);
  }
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  var check = 0;
  for (var i = 0; i < pipesInPlay.length; i++) {

    if(pipesInPlay[i].x == oozies[oozeCounter].x && pipesInPlay[i].y == oozies[oozeCounter].y){
      oozies[oozeCounter].updateOoze();
      check = 1;
    }
    if(oozies[oozeCounter].xComplete == true && oozies[oozeCounter].yComplete == true){
      score++;
      if(oozies[oozeCounter].direction == "right"){
        var oozie = new Ooze(oozies[oozeCounter].x + 64, oozies[oozeCounter].y);
      }
      if(oozies[oozeCounter].direction == "up"){
        var oozie = new Ooze(oozies[oozeCounter].x, oozies[oozeCounter].y - 64);
      }
      if(oozies[oozeCounter].direction == "down"){
        var oozie = new Ooze(oozies[oozeCounter].x, oozies[oozeCounter].y + 64);
      }
      if(oozies[oozeCounter].direction == "left"){
        var oozie = new Ooze(oozies[oozeCounter].x - 64, oozies[oozeCounter].y - 64);
      }
      oozies.push(oozie);
      oozeCounter++;
    }
  }

  for (var j = 0; j < pipesInPlay.length; j++) {
    if(pipesInPlay[j].x == oozies[oozeCounter].x && pipesInPlay[j].y == oozies[oozeCounter].y){
      oozies[oozeCounter].direction = pipesInPlay[j].direction;
    }
  }

  if(check == 0){
    gameOver = true;
  }

  if(endPipe.x == oozies[oozeCounter].x && endPipe.y == oozies[oozeCounter].y){
    complete.play();
    pipesInPlay = [];
    pipesInPlay.push(startPipe);
    pipesInPlay.push(endPipe);
    oozies = [];
    var ooze1 = new Ooze(startPipe.x, startPipe.y);
    oozies.push(ooze1);
    oozeCounter = 0;
    level++;
  }
  // TODO: Advance the fluid
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(background, 0, 0, 800, 800);
  drawGrid.renderCells(ctx);
  for(var z = 0; z < oozies.length; z++){
    oozies[z].render(ctx);
  }
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].render(ctx);
  }
  for (var j = 0; j < pipesInPlay.length ; j++) {
    pipesInPlay[j].render(ctx);
  }



  var text = "Score: " + score;
  ctx.fillStyle = 'black';
  ctx.fillText(text, 10, 20);
  // TODO: Render the board


}

},{"./game":2,"./grid":3,"./ooze":4,"./pipe":5}],2:[function(require,module,exports){
"use strict";

var bgmusic = new Audio();
bgmusic.src = 'assets/background-music.wav'
bgmusic.volume = .3;
/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  bgmusic.play();
  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict"

module.exports = exports = Grid;

function Grid(width, height, size){
  this.size = size;
  this.widthInCells = Math.ceil(width / size);
  this.heightInCells = Math.ceil(height / size);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++){
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

Grid.prototype.renderCells = function(ctx){
  for (var x = 1; x < this.widthInCells - 11; x++) {
    for (var y = 1; y < this.heightInCells - 3; y++) {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * this.size, y * this.size, this.size, this.size);
    }
  }

  for (var x = 3; x < this.widthInCells - 1; x++) {
    for (var y = 1; y < this.heightInCells - 1; y++) {
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * this.size, y * this.size, this.size, this.size);
    }
  }
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}]},{},[1]);
