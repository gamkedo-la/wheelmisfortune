inGameState = new InGameState();
inGameState.prototype = new GameController(); //akin to inheritance in JS

//This is how it works!
function InGameState(){
    this.enter = function(){
	applyPlayerKind();
	};
    
    this.update = function() {
        if(activeMisfortunes.length > 0) {
            updateActiveMisfortunes();
        }
        this.updateAnims();
        this.moveEverything();
        this.drawEverything();
        this.collideEverything();
        this.handleInput();
        
        if(gameRunning) {
            animationFrameNumber = requestAnimationFrame(gameController.update);
        }
    };
    
    this.handleInput = function(){
        if (mouse_Left){
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
        
        player.draw();
    
        for (var i = 0; i < shotList.length; i++) {
            shotList[i].draw();
        }
				particleCanvasManager.draw();
        for (var e = 0; e < enemyList.length; e++) {
            enemyList[e].draw();
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
