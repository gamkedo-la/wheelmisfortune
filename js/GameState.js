
/////////////////         State machine that handles all the neat background stuff     ///////////////

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
        moveEverything();
        drawEverything();
        collideEverything();
        handleInput();
        
        if(gameRunning) {
            animationFrameNumber = requestAnimationFrame(gameController.update);
        }
    };
    this.handleInput = function(){

    };
    this.enter = function(){

    };
}
inGameState = new InGameState();
inGameState.prototype = new GameController(); //akin to inheritance in JS
// FIXME: are we creating TWO new GameController()s in this file?
// to avoid calling class construtor twice above maybe we should do it this way:
// inGameState.prototype = Object.create(GameController.prototype); 
defaultState = inGameState; //accessed on startup




////////////            We can have something like this (not yet implemented)              //////////////
var misfortune = {
    "vanilla": false,
    "meleeOnly": false,
    "friendlyFire": false,
    "eternalBullet": false,
}; //etc

//A method of the main menu?
function spinTheWheel(){
    var random = Math.random();
}




