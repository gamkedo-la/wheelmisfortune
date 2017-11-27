// variables to keep track of player position
var playerX = 400,
	playerY = 300;
var playerSpeed = 3;

// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
var gameRunning = true;
var animationFrameNumber;



function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect(),
		root = document.documentElement;

	// account for the margins, canvas position on page, scroll amount, etc.
	mouseX = evt.clientX - rect.left;
	mouseY = evt.clientY - rect.top;
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");

	loadImages();
};

function loadingDoneSoStartGame() {
	// these next few lines set up our game logic and render to happen many times per second
	gameController.changeState(defaultState);
	
	animationFrameNumber = requestAnimationFrame(gameController.update);
	
	canvas.addEventListener("mousemove", calculateMousePos);
	
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	
	document.onmousedown = function() {
		return false;
	};
	
	document.addEventListener("mousedown", mousePressed);
	document.addEventListener("mouseup", mouseReleased);
	
	window.addEventListener("focus", windowOnFocus);
	window.addEventListener("blur", windowOnBlur);
	
	//Disable right click context menu
	document.oncontextmenu = function() {
		return false;
	};
} //end of loadingDoneSoStartGame

function windowOnFocus() {
	if(!gameRunning){
		gameRunning = true;
		animationFrameNumber = requestAnimationFrame(gameController.update);
	}
}

function windowOnBlur() {
	gameRunning = false;
	cancelAnimationFrame(animationFrameNumber);
}

function handleInput(){
	if (key_Space || mouse_Left){
		fireShot();
	}
}

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

	if (playerX < 0) {
		playerX = 0;
	}
	if (playerX > canvas.width) {
		playerX = canvas.width;
	}
	if (playerY < 0) {
		playerY = 0;
	}
	if (playerY > canvas.height) {
		playerY = canvas.height;
	}
} //end of playerMove

function moveEverything() {
	if(wheelShowing){
		wheelMove();
		return; // skipping gamemovement while wheelShowing
	}
	playerMove();
	for (var i = 0; i < shotList.length; i++) {
		shotList[i].move();
	}
	moveEnemies();
	for (var r = shotList.length - 1; r >= 0; r--) {
		if (shotList[r].removeMe) {
			shotList.splice(r, 1);
		}
	}
	
} //end of moveEverything

function drawEverything() {
	// clear the game view by filling it with black
	//canvasContext.fillStyle = "black";
	//canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	drawBitmapCenteredAtLocationWithRotation(
		backGroundPic,
		canvas.width / 2,
		canvas.height / 2,
		0
	);

	drawBitmapFlipped(playerpic, playerX, playerY, mouseX < playerX);
	var gunRotation = Math.atan2(mouseY - playerY, mouseX - playerX);
	drawBitmapCenteredAtLocationWithRotation(
		playerWeapon,
		playerX,
		playerY,
		gunRotation
	);

	canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
	playerWidth = 15;
	playerHeight = 20;

	canvasContext.fillRect(playerX - 15, playerY - 20, 30, 46);

	for (var i = 0; i < shotList.length; i++) {
		shotList[i].draw();
	}
	for (var e = 0; e < enemyList.length; e++) {
		enemyList[e].draw();
	}

	if(activeMisfortunes.length > 0) {
		updateActiveMisfortunes();
	}

	if(wheelShowing){
		drawWheel();
	}
} // end of drawEverything





	  
	  
    