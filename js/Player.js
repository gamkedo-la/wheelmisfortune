function Player(positionX, positionY) {
	this.x = positionX;
	this.y = positionY;
	this.speed = 3;
	this.gunRotation = 0;

	this.move = function playerMove() {
		if (key_Move_Left) {
			this.x -= this.speed;
		}
		if (key_Move_Right) {
			this.x += this.speed;
		}
		if (key_Move_Up) {
			this.y -= this.speed;
		}
		if (key_Move_Down) {
			this.y += this.speed;
		}
	
		if (this.x < 0) {
			this.x = 0;
		}
		if (this.x > canvas.width) {
			this.x = canvas.width;
		}
		if (this.y < 0) {
			this.y = 0;
		}
		if (this.y > canvas.height) {
			this.y = canvas.height;
		}
	}; //end of playerMove
	
	this.draw = function() {
		drawBitmapFlipped(playerpic, this.x, this.y, mouseX < this.x);
		
		this.gunRotation = Math.atan2(mouseY - this.y, mouseX - this.x);
		
		drawBitmapCenteredAtLocationWithRotation(
			playerWeapon,
			this.x,
			this.y,
			this.gunRotation
		);
	};
}
//player = new Player(400, 400);