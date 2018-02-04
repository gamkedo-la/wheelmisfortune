// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;
var scaledCanvas, scaledContext;
var particleCanvasManager;

var gameRunning = true;
var animationFrameNumber;
const TIME_PER_TICK = 1/30; //30 is the FPS

var player;

const PIXEL_SCALE_UP = 2; // Number of times to scale up art tiles

function calculateMousePos(evt) {
	var rect = scaledCanvas.getBoundingClientRect(),
		root = document.documentElement;

	// account for the margins, canvas position on page, scroll amount, etc.
	mouseX = evt.clientX - rect.left;
	mouseY = evt.clientY - rect.top;
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
	canvasContext.webkitImageSmoothingEnabled = false;
	scaledContext.mozImageSmoothingEnabled = false;
	scaledContext.imageSmoothingEnabled = false;
	scaledContext.msImageSmoothingEnabled = false;
	scaledContext.webkitImageSmoothingEnabled = false;

	particleCanvasManager = new ParticleCanvasManager();

	loadImages();
	loadSounds();
};

function loadingDoneSoStartGame() {
	// these next few lines set up our game logic and render to happen many times per second
	gameController.changeState(MainMenuState); //Put initial game state here

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

	 // commenting out until/unless we can unblurry Chrome
	window.addEventListener("resize", onResize);
    onResize();

	//Disable right click context menu
	document.oncontextmenu = function() {
		return false;
	};

	setUpMisfortuneTimer();
	player = new Player(canvas.width/2, canvas.height/2);
	applyPlayerKind();

	spawnInitialEnemies();

} //end of loadingDoneSoStartGame

function windowOnFocus() {
	if(!gameRunning){
		gameRunning = true;
		animationFrameNumber = requestAnimationFrame(gameController.update);
	}
	adjustGameVolume(globalVolume);
}

function windowOnBlur() {
	gameRunning = false;
	cancelAnimationFrame(animationFrameNumber);
	adjustGameVolume(0);
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
