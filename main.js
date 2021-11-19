//tablero
(function(){
  self.Board = function(width, height) {
      this.width = width;
      this.height = height;        
      this.playing = false;
      this.bars = [];
      this.ball = null;
      
  }

  self.Board.prototype = {
      // retorna los elementos dentro del tablero 2 barras y 1 esfera
      get elements() {
          var elements = this.bars.map(function(bar) { return bar});
          elements.push(this.ball)
          return elements;
      }
  }

})();

// Clase para crear la esfera
(function(){
  self.Ball = function(x, y, radius, board) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.board = board;
      this.speed = 6
      this.speed_x = 3
      this.speed_y = 0;
      this.direction = 1;
      this.bounce_angle = 0;
      this.max_bounce_angle = Math.PI/12;

      // añade la esfera a los atributos de la clase tablero
      board.ball = this;
      this.kind = "circle";
  }
  
  self.Ball.prototype = {
      move: function() {
          this.x += (this.speed_x * this.direction);
          this.y += (this.speed_y);
      },
      get width() {
          return this.radius * 2;
      },
      get height() {
          return this.radius * 2;
      },
      collision: function(bar) {
          
          var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
          var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

          this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

          this.speed_y = this.speed * -Math.sin(this.bounce_angle);
          this.speed_x = this.speed * Math.cos(this.bounce_angle);

          if (this.x > (this.board.width / 2)) {
              this.direction = -1;
          } else {
              this.direction = 1;
          }
      }
  }
})();

(function() {
  self.Bar = function(x, y, width, height, board) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.board = board;
      this.speed = 10;
      
      this.board.bars.push(this);
      this.kind = "rectangle"
  }

  self.Bar.prototype = {
      down: function() {
          this.y += this.speed;
      },
      up: function() {
          this.y -= this.speed;
      },
      toString: function() {
          return "x: " + this.x + "y: " + this.y
      },
      barCollisionUp: function() {
          this.y += this.speed * 2;
      },
      barCollisionDown: function() {
          this.y -= this.speed * 2;
      }
  }

})();

(function() {
  self.BoardView = function(canvas, board) {
      this.canvas = canvas;
      this.canvas.width = board.width;
      this.canvas.height = board.height;
      this.board = board;
      this.contexto = canvas.getContext('2d');
      this.puntajeplayer1 = 0;
      this.puntajeplayer2 = 0;
  }

  self.BoardView.prototype = {

      clean: function() {
          this.contexto.clearRect(0, 0, this.board.width, this.board.height);
      },
      draw: function() {
          for (var i = this.board.elements.length - 1; i >= 0; i--) {
              var el = this.board.elements[i]
              draw(this.contexto, el)
          };
      },
      check_collisions: function() {
          // detectas la colisiones de las barras tanto con la esfera como con los bordes del tablero
          for (var i=this.board.bars.length-1; i>=0; i--) {
              var bar = this.board.bars[i]
              if (hit(bar, this.board.ball)) {
                  this.board.ball.collision(bar);
              }
              if (hit_bar(bar) == 1) {
                  bar.barCollisionUp();
              } else if (hit_bar(bar) == -1) {
                  bar.barCollisionDown();
              }
          }
      },
      check_border_collisions: function() {
         
          if (hit_border(this.board.ball)) {
              this.board.ball.speed_y = -this.board.ball.speed_y;
          }
      },
      check_score: function() {
          
          if (score(this.board.ball) == 1){
              ball = new Ball(350, 200, 10, board);
              player1.innerHTML = this.puntajeplayer1 += 1;
          } else if (score(this.board.ball) == 2){                
              ball = new Ball(350, 200, 10, board);
              player2.innerHTML = this.puntajeplayer2 += 1;
          }
      },
      play: function() {
          if (this.board.playing) {                
              this.clean();
              this.draw();
              this.check_collisions();
              this.check_border_collisions();
              this.check_score();
              this.board.ball.move();
          }
          
      }
  };

  function hit(a, b) {
      // determina si la esfera choca con alguna de las barras
      var hit = false;

      if (b.x + b.width >= a.x && b.x < a.x + a.width) {
          if (b.y + b.height >= a.y && b.y < a.y + a.height) {
              hit = true;
          }
      }

      if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
          if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
              hit = true;
          }
      }

      if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
          if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
              hit = true;
          }
      }

      return hit
  }

  function hit_bar(bar) {
      
      var hit_border_bar = 0;

      if (bar.y <= 0) {
          hit_border_bar = 1;
      } else if (bar.y + bar.height >= this.board.height) {
          hit_border_bar = -1;
      }

      return hit_border_bar
  }

  function hit_border(ball) {
      
      var hit = false;

      if (ball.y - (ball.height / 2) <= 0 || ball.y + (ball.height / 2) >= this.board.height) {
          hit = true;
      }

      return hit
  }

  function score(ball) {
      // determina cuál es el jugador que anotó el punto
      var score_goal = 0;

      if (ball.x - (ball.height / 2) <= 0) {
          score_goal = 2;
      } else if (ball.x + (ball.height / 2) >= this.board.width) {
          score_goal = 1;
      }

      return score_goal
  }

  function draw(contexto, element) {
      // dibuja los elementos en el tablero
      switch(element.kind) {
          case "rectangle":
              contexto.fillRect(element.x, element.y, element.width, element.height);
              break;
          case "circle":
              contexto.beginPath();
              contexto.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
              contexto.fill();
              contexto.closePath();
              break;
      }        
  };
})();

// inicialización de objetos
var board = new Board(800, 400);
var bar = new Bar(20, 150, 20, 100, board);
var bar_2 = new Bar(760, 150, 20, 100, board);
var ball = new Ball(350, 200, 10, board);
var board_view = new BoardView(document.getElementById('canvas'), board);
const player1 = document.getElementById('puntaje1');
const player2 = document.getElementById('puntaje2');


document.addEventListener('keydown', function(event) {
  if (event.keyCode == 38) {
      event.preventDefault();
      bar_2.up();
  } else if (event.keyCode == 40) {
      event.preventDefault();
      bar_2.down();
  } else if (event.keyCode == 87) {
      event.preventDefault();
      bar.up()
  } else if (event.keyCode == 83) {
      event.preventDefault();
      bar.down();
  } else if (event.keyCode == 32) {
      event.preventDefault();
      board.playing = !board.playing;
  }
});

window.board_view.draw();

window.requestAnimationFrame(controller)

function controller() {
  board_view.play()
  window.requestAnimationFrame(controller);
}