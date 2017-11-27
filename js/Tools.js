const TWO_PI = Math.PI * 2;

function FrameCounter() {
	this.previousTime = 0;
	this.deltaTime = 0;
	this.fps = 0;
	this.count = 0;
	
	this.getFps = function() {
		if(this.previousTime === 0) {
			this.previousTime = performance.now();
			return;
		}
		
		this.deltaTime = (performance.now() - this.previousTime)/1000;
		this.previousTime = performance.now();
		this.fps = 1/this.deltaTime;
		
		this.count++;
		if(this.count > 60) {
			this.count = 0;
			console.log(this.fps);
		}
	};
}

var frameCounter = new FrameCounter();
