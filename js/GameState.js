
/////////////////         State machine that handles all the background stuff     ///////////////

function GameController() {

    this.handleInput = function () {
        state_.handleInput(); //Delegate the input to the state object
    };
    this.update = function () {
        state_.update(); //Also delegated
    };
    this.changeState = function (state) {
        if (typeof state !== "undefined") {
            // console.log("Changed state");
            state_ = state;
            state_.enter();
        }
    };
    var state_; //default state, changes during runtime
}
gameController = new GameController();

//This is how it works!
function InGameState(){
    this.update = function() {
        if(activeMisfortunes.length > 0) {
            updateActiveMisfortunes();
        }
        updateAnims();
        moveEverything();
        drawEverything();
        collideEverything();
        this.handleInput();

        if(gameRunning) {
            animationFrameNumber = requestAnimationFrame(gameController.update);
        }
    };
    this.handleInput = function(){
        if (key_Space || mouse_Left){
            if(clickLock == false){
                clickLock = true;
                player.shoot();
            }
        } else{
            clickLock = false;
        }
        if(key_Space && wheelShowing){
            kickWheel();
        }
    };
    this.enter = function(){

    };
}

function MainMenuState(){

  //This can be out of the update() function, since you only need to define it one time
  var mainMenuOptions = {
    'startGame' : {
      'displayName' : "Start Game",
      'IsSelected' : false,
      'x': 0,
      'y': 0
    },
    'exampleOption' : {
      'displayName' : "Example Option",
      'IsSelected' : false,
      'x': 0,
      'y': 0
    }
  }
  var mainMenuOptionsArray = Object.keys(mainMenuOptions);
  var arrow = 0;

  var defaultSelect = 0; //the first selected thing
  mainMenuOptions[mainMenuOptionsArray[defaultSelect]].IsSelected = true;

  var chosenDelayTime = 5; //number of frames to wait between selection
  var delayTimer = 0; //this gets increased by 1 every frame

  this.update = function(){

    this.handleInput();
    this.clearScreen();
    this.drawEverything();

    if(gameRunning) {
        animationFrameNumber = requestAnimationFrame(gameController.update);
    }
  }

  this.handleInput = function(){

    //This is the timer that delays the selections
    if (delayTimer < chosenDelayTime){
      delayTimer++; //increment and leave for now
      //console.log("Timer: ", delayTimer);
      return;
    }
    //we can act now
    else {
      delayTimer = chosenDelayTime; //just setting the value so we don't have a huge number that always increases
    }

    if (key_Space && mainMenuOptions[mainMenuOptionsArray[0]].IsSelected) {
      gameController.changeState(inGameState);
      return;
    }

    var initial = arrow; //to compare at the end
    if (key_Move_Down) {
      arrow++;
    }

    if (key_Move_Up) {
      arrow --;
    }

    if (arrow >= mainMenuOptionsArray.length) {
      arrow = 0;
    }
    if (arrow < 0) {
      arrow = mainMenuOptionsArray.length - 1; //-1 because the array starts at 0 and has length 2
    }

    for(var i = 0; i < mainMenuOptionsArray.length; i++){
      if (i != arrow ) {
        mainMenuOptions[mainMenuOptionsArray[i]].IsSelected = false;
      }
      else {
        mainMenuOptions[mainMenuOptionsArray[i]].IsSelected = true;
      }
    }


    //if we made a change, reset timer!
    if (initial != arrow){
      delayTimer = 0;
      console.log("Reset timer. Arrow value: ", arrow);
    }
  }

  this.drawEverything = function(){

    for (var i = 0; i < mainMenuOptionsArray.length; i++) {
      //console.log(mainMenuOptions[mainMenuOptionsArray[i]].displayName);
      if (i == 0) {
        mainMenuOptions[mainMenuOptionsArray[i]].x = 100;
        mainMenuOptions[mainMenuOptionsArray[i]].y = 100;
      }
      else {
        mainMenuOptions[mainMenuOptionsArray[i]].x = mainMenuOptions[mainMenuOptionsArray[i-1]].x;
        mainMenuOptions[mainMenuOptionsArray[i]].y = mainMenuOptions[mainMenuOptionsArray[i-1]].y+10;
      }
      //console.log(mainMenuOptions[mainMenuOptionsArray[i]].x);
      //console.log(mainMenuOptions[mainMenuOptionsArray[i]].IsSelected);
      canvasContext.fillStyle = "white";
      canvasContext.fillText(mainMenuOptions[mainMenuOptionsArray[i]].displayName, mainMenuOptions[mainMenuOptionsArray[i]].x, mainMenuOptions[mainMenuOptionsArray[i]].y);

      if (mainMenuOptions[mainMenuOptionsArray[i]].IsSelected) {
          colorRect(mainMenuOptions[mainMenuOptionsArray[i]].x -10, mainMenuOptions[mainMenuOptionsArray[i]].y-5, 5, 5, 'white');
          //console.log(arrow);
      }
    }
    scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
  }
  this.clearScreen = function(){
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  }

  this.enter = function(){

  }
}
inGameState = new InGameState();
inGameState.prototype = new GameController(); //akin to inheritance in JS
MainMenuState = new MainMenuState();
MainMenuState.prototype = new GameController();

// FIXME: are we creating TWO new GameController()s in this file?
// to avoid calling class construtor twice above maybe we should do it this way:
// inGameState.prototype = Object.create(GameController.prototype);
defaultState = MainMenuState; //accessed on startup

//Could be easily modified to update player as well
function updateAnims(){
    enemyList.forEach(function (enemy) {
        if (typeof enemy.sprite != "undefined")
        enemy.sprite.update();
    });
}
