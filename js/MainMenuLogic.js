MainMenuState = new MainMenuState();
MainMenuState.prototype = new GameController();

function MainMenuState(){
    var mainMenuOptions = [
        {
            'displayName' : "Start Game",
            'x': 20,
            'y': 20,
            'width': 100,
            'height': 20,
            'action': function() {gameController.changeState(inGameState);}
        },
        {
            'displayName' : "Example Option",
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
    
    this.enter = function(){};
    
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
