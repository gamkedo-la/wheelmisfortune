
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
inGameState = new InGameState();
inGameState.prototype = new GameController(); //akin to inheritance in JS
// FIXME: are we creating TWO new GameController()s in this file?
// to avoid calling class construtor twice above maybe we should do it this way:
// inGameState.prototype = Object.create(GameController.prototype); 
defaultState = inGameState; //accessed on startup

//Could be easily modified to update player as well
function updateAnims(){
    enemyList.forEach(function (enemy) {
        if (typeof enemy.sprite != "undefined")
        enemy.sprite.update();
    });
}




