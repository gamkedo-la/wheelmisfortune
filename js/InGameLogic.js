inGameState = new InGameState();
inGameState.prototype = new GameController(); //akin to inheritance in JS

// Make this global for now
var inGamePaused = false;

//This is how it works!
function InGameState(){
    this.enter = function(){
	applyPlayerKind();
    inGamePaused = false;
    // Don't pause if you hold down enter when the game starts
    this.canChangePauseState = !key_Menu_Select;
    
    sounds.pauseTheme.pause();   
    sounds.mainTheme.play();
	};
    
    this.update = function() {
        if(activeMisfortunes.length > 0) {
            updateActiveMisfortunes();
        }
        if (!inGamePaused) this.updateAnims();
        if (!inGamePaused) this.moveEverything();
        this.drawEverything();
        if (!inGamePaused) this.collideEverything();
        this.handleInput();
        
        if(gameRunning) {
            animationFrameNumber = requestAnimationFrame(gameController.update);
        }
    };
    
    this.handleInput = function(){
        if (mouse_Left){
            if(clickLock == false){
                clickLock = true;
                if (!inGamePaused) player.shoot();
            }
        } else{
            clickLock = false;
        }
        if(key_Space && wheelShowing){
            kickWheel();
        }
        if (key_Menu_Select) {
            // This is so the game doesn't rapidly pause and unpause when you hold down the enter key.
            if (this.canChangePauseState === true) {
                if (inGamePaused === true) {
                    inGamePaused = false;
                    sounds.mainTheme.play();
                    sounds.pauseTheme.pause();
                }
                else {
                    inGamePaused = true;
                    sounds.mainTheme.pause();
                    sounds.pauseTheme.play();
                }
                this.canChangePauseState = false;
            }    
        }
        else {
            this.canChangePauseState = true;
        }
    };
    
    //Could be easily modified to update player as well
    this.updateAnims = function(){
        enemyList.forEach(function (enemy) {
            if (typeof enemy.sprite != "undefined")
                enemy.sprite.update();
        });
        shotList.forEach(function (enemy) {
            if (typeof enemy.sprite != "undefined")
                enemy.sprite.update();
        });
    };
    
    this.moveEverything = function() {
        if(wheelShowing){
            wheelMove();
            return; // skipping game movement while wheelShowing
        }
    
        player.move();
        moveEnemies();
        moveShots();
        
        if (swapWeaponThisFrame) {
            swapWeapon();
            swapWeaponThisFrame = false;
        }
        moveWeapons();
    };
    
    this.drawEverything = function() {
        // clear the game view by filling it with black
        canvasContext.fillStyle = "black";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(backGroundPic,0,0,canvas.width,canvas.height);
        
        var allObjectsToDrawDepthSorted = enemyList.concat([player],shotList);
        allObjectsToDrawDepthSorted.sort(function(a, b) {
            return (a.y+a.spriteHeight/2) -
                   (b.y+b.spriteHeight/2); // sorting on their feet
        });
        for (var i=0;i<allObjectsToDrawDepthSorted.length; i++) {
            allObjectsToDrawDepthSorted[i].draw();
        }
        
        if(wheelShowing){
            drawWheel();
        }
        
        playerHealthArray.length = player.maxHealth;
        for (var i = 0; i < player.maxHealth; i++) {
            playerHealthArray[i] = i < player.health;
        }
        for (var i = 0; i < player.health; i++) {
            if (playerHealthArray[i]) {
                //colorRect(i*20,0,19,19,"red");
                canvasContext.drawImage(heartPic,4+i*12,4,8,8);
            }
        }
        displayMisfortuneTimer();
        //Scale and redraw the game canvas to the screen
        scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
            0, 0, scaledCanvas.width, scaledCanvas.height);
    
        if(debug) {
            frameCounter.getFps();
        }
    };
    
    this.collideEverything = function() {
        checkBulletCollisions();
        checkSwordCollisions();
    };
}
