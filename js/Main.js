// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
var gameRunning = true;
var animationFrameNumber;

var player = new Player(400, 400);

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

function moveEverything() {
	if(wheelShowing){
		wheelMove();
		return; // skipping gamemovement while wheelShowing
	}
	player.move();
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
	
	player.draw();


	// canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
	// playerWidth = 15;
	// playerHeight = 20;

	// canvasContext.fillRect(player.x - 15, player.y - 20, 30, 46);

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
	
	frameCounter.getFps();
} // end of drawEverything

function collideEverything() {
	var distX;
	var distY;
	for (var i = 0; i < shotList.length; i++) {
		var currentShot = shotList[i]

		for (var j = 0; j < enemyList.length; j++) {
			var currentEnemy = enemyList[j];

			//Hacky collision code, replace at some point
			distX = currentShot.x - currentEnemy.x;
			distY = currentShot.y - currentEnemy.y;
			if (Math.abs(currentShot.x - currentEnemy.x) + Math.abs(currentShot.y - currentEnemy.y) <= 10) {
//			if ((distX*distX + distY*distY) <= 100) {
				currentShot.removeMe = true;
				currentEnemy.life -= currentShot.damage;
				if (currentEnemy.life <= 0) {
					currentEnemy.remove = true;
					currentEnemy.life = 9999999; //So it won't keep adding more enemies before it's removed.
					enemyList.push(new TestEnemy(200, 200));
				}
			}

		}
		
	}
	
} //end of collideEverything
