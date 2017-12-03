function Player(positionX, positionY) {
	this.x = positionX;
	this.y = positionY;
	this.speed = 1;
	this.playerHeight = 48;
	this.playerWidth = 30;
	
	this.fireRate = 4; //In frames
	this.nextFire = 0;
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
	
		if (this.x  < this.playerWidth/2) {
			this.x = this.playerWidth/2;
		}
		if (this.x > canvas.width - this.playerWidth/2) {
			this.x = canvas.width - this.playerWidth/2;
		}
		if (this.y < this.playerHeight/2) {
			this.y = this.playerHeight/2;
		}
		if (this.y > canvas.height - this.playerHeight/2) {
			this.y = canvas.height - this.playerHeight/2;
		}
		
		if(this.nextFire > 0) {
			this.nextFire--;
		}
	}; //end of playerMove
	
	this.draw = function() {
		drawBitmapFlipped(playerPic, this.x, this.y, mouseX < this.x);
		
		this.gunRotation = Math.atan2(mouseY - this.y, mouseX - this.x);
		
		drawBitmapCenteredAtLocationWithRotation(
			playerWeapon,
			this.x,
			this.y,
			this.gunRotation
		);
	};
	
	this.shoot = function() {
		if(this.nextFire === 0) {
			this.nextFire = this.fireRate;
			var direction = Math.atan2(mouseY - this.y, mouseX - this.x);
			shotList.push(new shotClass(this.x, this.y, direction));
		}
	};
}
//player = new Player(400, 400);