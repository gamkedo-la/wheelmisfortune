    // variables to keep track of player position
    var playerX = 400,
      playerY = 300;
    var playerSpeed = 5;

    // save the canvas for dimensions, and its 2d context for drawing to it
    var canvas, canvasContext;
    var shotList = [];
 
    function shotClass(startX, startY, shotAng, shotSpeed) 
	{
		this.x = startX;
		this.y = startY;
		this.xv = Math.cos(shotAng) * shotSpeed;
		this.yv =  Math.sin(shotAng) * shotSpeed;
		this.lifeLeft = 100;
		this.removeMe = false;
		this.move = function (){
			this.x += this.xv;
			this.y += this.yv;
			if(this.x < 0 && this.xv < 0){
				this.xv *= -1;
			}
			if(this.x > canvas.width && this.xv > 0){
				this.xv *= -1;
			}
			if(this.y < 0 && this.yv < 0){
				this.yv *= -1;
			}
			if(this.y > canvas.height && this.yv > 0){
				this.yv *= -1;
			}
			this.lifeLeft--;
			if(this.lifeLeft < 0){
				this.removeMe = true;
			}
		}
		this.draw = function(){
			colorRect(this.x - 2, this.y - 2, 5, 5, 'yellow');
		}
	}
    function calculateMousePos(evt) {
      var rect = canvas.getBoundingClientRect(),
        root = document.documentElement;
    
      // account for the margins, canvas position on page, scroll amount, etc.
      mouseX = evt.clientX - rect.left - root.scrollLeft;
      mouseY = evt.clientY - rect.top - root.scrollTop;
    }
    
    window.onload = function() {
      canvas = document.getElementById("gameCanvas");
      canvasContext = canvas.getContext("2d");
    
      loadImages();
    }
	
	function loadingDoneSoStartGame() {
      // these next few lines set up our game logic and render to happen 30 times per second
      var framesPerSecond = 30;
      setInterval(function() {
        moveEverything();
        drawEverything();
      }, 1000 / framesPerSecond);
      document.addEventListener("keydown", keyPressed);
      document.addEventListener("keyup", keyReleased);
      canvas.addEventListener("mousemove", calculateMousePos);
    } //end of loadingDoneSoStartGame
	
	function playerMove() {
      if (key_Move_Left) {
        playerX -= playerSpeed;
      }
      if (key_Move_Right) {
        playerX += playerSpeed;
      }
      if (key_Move_Up) {
        playerY -= playerSpeed;
      }
      if (key_Move_Down) {
        playerY += playerSpeed;
      }

	  if(playerX < 0 ){
		  playerX = 0;
	  }	  
	  if(playerX > canvas.width){
		  playerX = canvas.width;
	  }
	  	  if(playerY < 0 ){
		  playerY = 0;
	  }	  
	  if(playerY > canvas.height){
		  playerY = canvas.height;
	  }
    }//end of playerMove
    
    function moveEverything() {
      playerMove();
	  for(var i = 0; i < shotList.length; i ++){
		  shotList[i].move();
	  }
	  for(var r = shotList.length - 1; r >= 0; r--){
		  if(shotList[r].removeMe){
			  shotList.splice(r, 1);
		  }
	  }
    } //end of player move
	
	function drawEverything() {
      // clear the game view by filling it with black
      //canvasContext.fillStyle = "black";
      //canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      drawBitmapCenteredAtLocationWithRotation (
        backGroundPic,
        canvas.width / 2,
        canvas.height / 2,
        0
      );
	  


	  
	  drawBitmapFlipped(
	  playerpic,
	  playerX,
	  playerY,
	  mouseX < playerX
	  );
	  var gunRotation = Math.atan2(mouseY - playerY, mouseX - playerX);
	  drawBitmapCenteredAtLocationWithRotation(
	  playerWeapon,
	  playerX,
	  playerY,
	  gunRotation);
	  
	  for(var i = 0; i < shotList.length; i ++){
		  shotList[i].draw();
	  }
	  
	  } // end of drawEverything
	  
	  
    