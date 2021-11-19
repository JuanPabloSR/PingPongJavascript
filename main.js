//MODELO BOARD

(function () {
  //función que ejecutara todos los elementos
  self.Board = function (width, height) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
  };

  self.Board.prototype = {
    get elements() {
      // tenemos un getter para obtener los elementos
      var elements = this.bars;
      elements.push(this.ball);
      return elements;
    },
  };
})();

(function () {
  self.Bar = function (x, y, width, height, board) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    this.board.bars.push(this);
    this.kind = "rectangule";
    this.speed = 10;
  };

  self.Bar.prototype = {
    down: function () {
      this.y += this.speed;
    },
    up: function () {
      this.y -= this.speed;
    },
    toString: function(){
      return "x: "+ this.x +" y: "+this.y ;
        }
  };
})();
//VISTA BOARDVIEW

(function () {
  self.BoardView = function (canvas, board) {
    // con el self modificamos el canvas
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
  };

  self.BoardView.prototype = {
    draw: function () {
      for (var i = this.board.elements.length - 1; i >= 0; i--) {
        var el = this.board.elements[i];

        draw(this.ctx,el);
      }
    },
  };

  function draw(ctx, element) {
    if(element !== null && element.hasOwnProperty("kind")) {
      switch (element.kind) {
        case "rectangule":
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
      }
    }
   
  }
})();


  var board = new Board(800, 400);
  var bar = new Bar(20, 100, 40, 100,board);
  var bar = new Bar(735, 100, 40, 100,board);
  var canvas = document.getElementById("canvas");
  var board_view = new BoardView(canvas,board);

document.addEventListener("keydown", function(ev){
  if(ev.keyCode == 38){
    bar.up();
  }
  else if(ev.keyCode == 40){
    bar.down();
  }
  console.log(""+bar);
});

self.addEventListener("load", main);

// CONTROLADORA QUE INSTANCIA NUESTROS OBJETOS

function main() {
  console.log("holamunfo")
  console.log(board);
  board_view.draw();
}
