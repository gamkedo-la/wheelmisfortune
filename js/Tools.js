const TWO_PI = Math.PI * 2;
const THREE_PI = Math.PI * 3;
var debug = true;

function dist(x1, y1, x2, y2){
	var xd = x2-x1;
	var yd = y2-y1;
	return Math.sqrt(xd * xd + yd * yd);
}

function FrameCounter() {
	this.active = false;
	this.previousTime = 0;
	this.deltaTime = 0;
	this.fps = 0;
	this.averageFps = 0;
	this.count = 0;
	
	this.getFps = function() {
		if(!this.active) {
			return;
		}
		
		if(this.previousTime === 0) {
			this.previousTime = performance.now();
			return;
		}
		
		this.deltaTime = (performance.now() - this.previousTime)/1000;
		this.previousTime = performance.now();
		this.fps = 1/this.deltaTime;
		this.averageFps += this.fps;
		
		this.count++;
		if(this.count >= 60) {
			console.log("FPS:" + this.averageFps/this.count);
			this.count = 0;
			this.averageFps = 0;
		}
	};
}

var frameCounter = new FrameCounter();

function mod(n, m) {
	return ((n % m) + m) % m;
}