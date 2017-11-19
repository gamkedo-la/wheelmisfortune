var enemyList = [];

function enemyClass(startX, startY, shotAng, enemySpeed) {
	this.x = startX;
	this.y = startY;
	this.xv = startX * enemySpeed;
	this.yv = startY * enemySpeed;

	//this.lifeLeft = 100;
	//this.removeMe = false;
	this.move = function() {
		this.x += this.xv;
		this.y += this.yv;
		if (this.x < 0 && this.xv < 0) {
			this.xv *= -1;
		}
		if (this.x > canvas.width && this.xv > 0) {
			this.xv *= -1;
		}
		if (this.y < 0 && this.yv < 0) {
			this.yv *= -1;
		}
		if (this.y > canvas.height && this.yv > 0) {
			this.yv *= -1;
		}
		/*this.lifeLeft--;
		if (this.lifeLeft < 0) {
			this.removeMe = true;
		}*/
	};
	this.draw = function() {
		colorRect(canvas.width,canvas.height/2, 10, 10, "red");
	};
}