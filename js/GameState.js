
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
    var mainMenuOptions = [
        {
            'displayName' : "Start Game",
            'IsSelected' : false,
            'x': 20,
            'y': 20,
            'width': 100,
            'height': 20,
            'action': function() {gameController.changeState(inGameState);console.log("Start Game Button");}
        },
        {
            'displayName' : "Example Option",
            'IsSelected' : false,
            'x': 20,
            'y': 50,
            'width': 100,
            'height': 20,
            'action': function(){console.log("Example Button");}
        }
    ];
    
    var selected = 0;
    
    var chosenDelayTime = 12; //number of frames to wait between selection
    var delayTimer = 0; //this gets increased by 1 every frame
    
    this.update = function(){
        this.handleInput();
        this.clearScreen();
        this.drawEverything();
        
        if(gameRunning) {
            animationFrameNumber = requestAnimationFrame(gameController.update);
        }
    };
    
    this.handleInput = function(){
        if(mouse_Left) {
            this.checkButtons();
        }
        
        if (key_Menu_Select) {
            mainMenuOptions[selected].action();
        }
        
        //This is the timer that delays the keyboard selections
        if (delayTimer > 0){
            delayTimer--;
            return;
        }
        
        if (key_Move_Down) {
            selected = mod(selected + 1, mainMenuOptions.length);
            delayTimer = chosenDelayTime;
        }
        if (key_Move_Up) {
            selected = mod(selected - 1, mainMenuOptions.length);
            delayTimer = chosenDelayTime;
        }
    };
    
    this.drawEverything = function(){
        for (var i = 0; i < mainMenuOptions.length; i++) {
            canvasContext.fillStyle = "white";
            
            colorRect(mainMenuOptions[i].x, mainMenuOptions[i].y, mainMenuOptions[i].width, mainMenuOptions[i].height, 'green');
            
            canvasContext.fillStyle = "white";
            canvasContext.fillText(mainMenuOptions[i].displayName, mainMenuOptions[i].x, mainMenuOptions[i].y + 15);
            
            if (i === selected) {
                colorRect(mainMenuOptions[i].x -10, mainMenuOptions[i].y + 10, 5, 5, 'white');
            }
        }
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
    };
    
    this.clearScreen = function(){
        canvasContext.fillStyle = "black";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    this.enter = function(){
        
    };
    
    this.checkButtons = function(){
        for(var i = 0; i < mainMenuOptions.length; i++){
            var opt = mainMenuOptions[i];
            console.log(opt.x, opt.y, opt.width, opt.height, mouseX, mouseY);
            if(mouseInside(opt.x, opt.y, opt.width, opt.height)) {
                opt.action();
            }
        }
    };
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
