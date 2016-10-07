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
