const TWO_PI = Math.PI * 2;
const THREE_PI = Math.PI * 3;
var debug = true;

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
