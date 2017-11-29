// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
var scaledCanvas, scaledContext;

var gameRunning = true;
var animationFrameNumber;

var player = new Player(400, 400);

const PIXEL_SCALE_UP = 3; // Number of times to scale up art tiles



function calculateMousePos(evt) {
	var rect = scaledCanvas.getBoundingClientRect(),
		root = document.documentElement;

	// account for the margins, canvas position on page, scroll amount, etc.
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
	var canvasStretch = scaledCanvas.width/ canvas.width;
	mouseX /= canvasStretch;
	mouseY /= canvasStretch;
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext("2d");

		// Get references for gameCanvas
    scaledCanvas = document.getElementById('gameCanvas');
    canvas = document.createElement('canvas');

    // Size gameCanvas
	canvas.width = 960/ PIXEL_SCALE_UP;
	canvas.height = 540/ PIXEL_SCALE_UP;
	scaledCanvas.width =960;
	scaledCanvas.height = 540;

	canvasContext = canvas.getContext('2d');
	scaledContext = scaledCanvas.getContext('2d');
	scaledContext.fillStyle = "black";

	// Helps it not blur from the scaling:
	canvasContext.mozImageSmoothingEnabled = false;
	canvasContext.imageSmoothingEnabled = false;
	canvasContext.msImageSmoothingEnabled = false;
	canvasContext.imageSmoothingEnabled = false;
	scaledContext.mozImageSmoothingEnabled = false;
	scaledContext.imageSmoothingEnabled = false;
	scaledContext.msImageSmoothingEnabled = false;
	scaledContext.imageSmoothingEnabled = false;
	
	loadImages();
};

function loadingDoneSoStartGame() {
	// these next few lines set up our game logic and render to happen many times per second
	gameController.changeState(defaultState);
	
	animationFrameNumber = requestAnimationFrame(gameController.update);
	
	scaledCanvas.addEventListener("mousemove", calculateMousePos);
	
	document.addEventListener("keydown", keyPressed);
	document.addEventListener("keyup", keyReleased);
	
	document.onmousedown = function() {
		return false;
	};
	
	document.addEventListener("mousedown", mousePressed);
	document.addEventListener("mouseup", mouseReleased);
	
	window.addEventListener("focus", windowOnFocus);
	window.addEventListener("blur", windowOnBlur);
	window.addEventListener("resize", onResize);
    onResize();
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

function onResize() { // changing window dimensions
    if (!canvas) return;
    var gameRatio = canvas.height/canvas.width;
    var widthIfHeightScaled = window.innerHeight / gameRatio;
    if(widthIfHeightScaled <= window.innerWidth) {
        scaledCanvas.width = widthIfHeightScaled;
        scaledCanvas.height = window.innerHeight;
    } else {
        var heightIfWidthScaled = window.innerWidth * gameRatio;
        scaledCanvas.width = window.innerWidth;
        scaledCanvas.height = heightIfWidthScaled;
    }
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
	canvasContext.fillStyle = "black";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	canvasContext.drawImage(backGroundPic,0,0,canvas.width,canvas.height);	
	player.draw();


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
	
	scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
		0, 0, scaledCanvas.width, scaledCanvas.height);
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
			if ((distX*distX + distY*distY) <= 100) {
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
