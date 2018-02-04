
var GameOverState = new GameOverState();
//GameOverState.prototype = new Gamecontroller();

function GameOverState(){
    var gameOverOptions = [
    {
        'displayName' : 'Return to the Main Menu',
        'x' : 180,
        'y' : 90,
        'width' : 150,
        'height': 20,
        'action': function(){gameController.changeState(MainMenuState);}
    },
    {
      'displayName' : 'Retry as same character',
      'x' : 180,
      'y' : 120,
      'width' : 150,
      'height': 20,
      'action': function(){gameController.changeState(inGameState);}
  }
];
  var selected = 0;
  var chosenDelayTime = 12;
  var delayTimer = 0;
  this.enter = function(){
    sounds.mainTheme.pause();
    sounds.pauseTheme.play();
  }

  this.update = function(){
    this.handleInput();
    this.clearScreen();
    this.drawEverything();
    if(gameRunning){
      animationFrameNumber = requestAnimationFrame(gameController.update);
    }
  };

  this.handleInput = function(){
    if (mouse_Left) {
      this.checkButtons();
      mouse_Left = false;
    }

    if (key_Menu_Select) {
      gameOverOptions[selected].action();
      key_Menu_Select = false;
    }


  if (delayTimer > 0) {
    delayTimer--;
    return;
  }

  if (key_Move_Down) {
    selected = mod(selected + 1, gameOverOptions.length);
    delayTimer = chosenDelayTime;
  }
  if (key_Move_Up) {
    selected = mod(selected - 1, gameOverOptions.length);
    delayTimer = chosenDelayTime;
  }
};

  this.drawEverything = function(){
      canvasContext.font = "20px Verdana";
      canvasContext.textAlign = "left";

      canvasContext.fillStyle = "yellow";
      canvasContext.fillText("Game Over", 140+1, 60+1);
      canvasContext.fillStyle = "red";
      canvasContext.fillText("Game Over", 140, 60);

      canvasContext.font = "10px Verdana";
      for (var i = 0; i < gameOverOptions.length; i++) {
          canvasContext.fillStyle = "white";

          colorRect(gameOverOptions[i].x, gameOverOptions[i].y, gameOverOptions[i].width, gameOverOptions[i].height, 'green');

          canvasContext.fillStyle = "white";
          canvasContext.fillText(" "+gameOverOptions[i].displayName, gameOverOptions[i].x, gameOverOptions[i].y + 15);

          if (i === selected) {
              colorRect(gameOverOptions[i].x -10, gameOverOptions[i].y + 10, 5, 5, 'white');
          }
      }
      scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
  };

  this.clearScreen = function(){
      canvasContext.fillStyle = "black";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  };

  this.checkButtons = function(){
      for(var i = 0; i < gameOverOptions.length; i++){
          var opt = gameOverOptions[i];
          //console.log(opt.x, opt.y, opt.width, opt.height, mouseX, mouseY);
          if(mouseInside(opt.x, opt.y, opt.width, opt.height)) {
              opt.action();
          }
      }
  };

}
