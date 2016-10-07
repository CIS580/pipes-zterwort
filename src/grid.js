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
