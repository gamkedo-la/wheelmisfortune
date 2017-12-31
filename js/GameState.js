
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

// FIXME: are we creating TWO new GameController()s in this file?
// to avoid calling class construtor twice above maybe we should do it this way:
// inGameState.prototype = Object.create(GameController.prototype);
