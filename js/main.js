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
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");

	loadImages();
};

function loadingDoneSoStartGame() {
	// these next few lines set up our game logic and render to happen 30 times per second
	var framesPerSecond = 30;
	animationFrameNumber = requestAnimationFrame(mainLoop);
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	canvas.addEventListener("mousemove", calculateMousePos);
	window.addEventListener("focus", windowOnFocus);
	window.addEventListener("blur", windowOnBlur);
} //end of loadingDoneSoStartGame

function mainLoop() {
	moveEverything();
	drawEverything();
	if(gameRunning){
		animationFrameNumber = requestAnimationFrame(mainLoop);
	}
}

function windowOnFocus() {
	if(!gameRunning){
		gameRunning = true;
		animationFrameNumber = requestAnimationFrame(mainLoop);
	}
}

function windowOnBlur() {
	gameRunning = false;
	cancelAnimationFrame(animationFrameNumber);
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
	playerMove();
	for (var i = 0; i < shotList.length; i++) {
		shotList[i].move();
	}
	for (var e = 0; e < enemyList.length; e++) {
		enemyList[e].move();
	}
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

	for (var i = 0; i < shotList.length; i++) {
		shotList[i].draw();
	}
	for (var e = 0; e < enemyList.length; e++) {
		enemyList[e].draw();
	
}
} // end of drawEverything



	  
	  
    