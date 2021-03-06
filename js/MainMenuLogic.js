MainMenuState = new MainMenuState();
MainMenuState.prototype = new GameController();

var menubuttonY = 20;
var buttonYJump = 30;
var showingCredits = false;

function MainMenuState(){
    var mainMenuOptions = [
        {
            'displayName' : "Play as Ninja",
            'x': 180,
            'y': 90,
            'width': 100,
            'height': 20,
            'action': function() {playerKind = PLAYER_KIND_NINJA; gameController.changeState(inGameState);}
        },
		{
            'displayName' : "Play as Cowboy",
            'x': 180,
            'y': 120,
            'width': 100,
            'height': 20,
            'action': function() {playerKind = PLAYER_KIND_COWBOY; gameController.changeState(inGameState);}
        },
		        {
            'displayName' : "Play as Knight",
            'x': 180,
            'y': 150,
            'width': 100,
            'height': 20,
            'action': function() {playerKind = PLAYER_KIND_KNIGHT; gameController.changeState(inGameState);}
        },
        {
            'displayName' : "Play as Wizard",
            'x': 180,
            'y': 180,
            'width': 100,
            'height': 20,
            'action': function() {playerKind = PLAYER_KIND_WIZARD; gameController.changeState(inGameState);}
        },
                {
            'displayName' : "Play as Barbarian",
            'x': 180,
            'y': 210,
            'width': 100,
            'height': 20,
            'action': function() {playerKind = PLAYER_KIND_BARBARIAN; gameController.changeState(inGameState);}
        },
        {
            'displayName' : "Credits",
            'x': 180,
            'y': 240,
            'width': 100,
            'height': 20,
            'action': function(){ showingCredits = true;}
        }
    ];

    var selected = 0;

    var chosenDelayTime = 12; //number of frames to wait between selection
    var delayTimer = 0; //this gets increased by 1 every frame

    this.enter = function(){
        activeMisfortunes = [];
        for (type in misfortunes) {
            misfortunes[type].isActive = false;
        }
        sounds.mainTheme.pause();
        sounds.pauseTheme.play();
    };

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
            if(showingCredits) {
                showingCredits = false;
            } else {
                this.checkButtons();
            }
            mouse_Left = false; // prevent repeat fire flipping menu screens
        }

        if (key_Menu_Select) {
            if(showingCredits) {
                showingCredits = false;
            } else {
                mainMenuOptions[selected].action();
            }
            key_Menu_Select = false; // prevent repeat fire flipping menu screens
        }

        //This is the timer that delays the keyboard selections
        if (delayTimer > 0){
            delayTimer--;
            return;
        }

        if(showingCredits == false) {
            if (key_Move_Down) {
                selected = mod(selected + 1, mainMenuOptions.length);
                delayTimer = chosenDelayTime;
            }
            if (key_Move_Up) {
                selected = mod(selected - 1, mainMenuOptions.length);
                delayTimer = chosenDelayTime;
            }
        }
    };

    this.drawCreditsScreen = function() {
        canvasContext.font = "20px Verdana";
        canvasContext.fillStyle = "cyan";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Credits", canvas.width/2, 30);
        canvasContext.textAlign = "left";
        canvasContext.fillStyle = "white";
        canvasContext.font = "13px Verdana";
        var lineX = 20;
        var lineY = 50;
        var lineYskip = 12;

        canvasContext.fillText("Cameron Button: project lead, main code, wheel, background", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Marc Silva: Art and code for slimes, wizard", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Jose Contreras: Player-enemy collision, enemy spawns code", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Nicholas Polchies: Optimizations, mute on focus loss", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Dan Dela Rosa: Sword functionality", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Jeremy Jackson: Shadows, audio manager, vampire mode", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Jerry McClellan Jr.: Player character sprites", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Rémy Lapointe: Slug enemy", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Kise: Main rock music", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Michael \"Misha\" Fewkes: boss music", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Barış Köklü: Main menu, health bar functionality, game over", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Kyle Thomas: Crates and stone walls", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Asix Jin: Monocle Monarch sprite", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Christer Kaitila: hearts, wheel art, knockback, gamepad, lighting", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Eugene Meidinger: Shot collision code", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("Vignesh Ramesh: Menu music, shooting sounds, hit sounds", lineX, lineY); lineY+= lineYskip;
        canvasContext.fillText("SirKawaine: Player sprite integration", lineX, lineY); lineY+= lineYskip;

        lineY+= lineYskip; // extra skip
        canvasContext.fillStyle = "cyan";
        canvasContext.fillText("Game made by members of gamkedo.com - click anywhere to return", lineX, lineY);

        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);
    }

    this.drawEverything = function(){
        if(showingCredits) {
            this.drawCreditsScreen();
            return;
        }
        canvasContext.font = "20px Verdana";
        canvasContext.textAlign = "left";

        canvasContext.fillStyle = "yellow";
        canvasContext.fillText("Wheel of Misfortune", 140+1, 60+1);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wheel of Misfortune", 140, 60);

        canvasContext.font = "10px Verdana";
        for (var i = 0; i < mainMenuOptions.length; i++) {
            canvasContext.fillStyle = "white";

            colorRect(mainMenuOptions[i].x, mainMenuOptions[i].y, mainMenuOptions[i].width, mainMenuOptions[i].height, 'green');

            canvasContext.fillStyle = "white";
            canvasContext.fillText(" "+mainMenuOptions[i].displayName, mainMenuOptions[i].x, mainMenuOptions[i].y + 15);

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
            //console.log(opt.x, opt.y, opt.width, opt.height, mouseX, mouseY);
            if(mouseInside(opt.x, opt.y, opt.width, opt.height)) {
                opt.action();
            }
        }
    };
}
