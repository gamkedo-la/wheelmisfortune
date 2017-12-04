var enemyList = [];

function moveEnemies() {
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].move();
		if(enemyList[i].remove) {
			enemyList[i] = null;
			enemyList.splice(i, 1);
		}
	}
}

function Enemy(startX, startY) {
	this.x = startX;
	this.y = startY;
	this.heading = 0.523599;
	this.velocity = .7;
	this.facing = 0;
	
	this.life = 100;
	this.remove = false;
	
	this.move = function() {
		if(this.life <= 0) {
			this.remove = true;
		}
		
		this.x += Math.cos(this.heading) * this.velocity;
		this.y += Math.sin(this.heading) * this.velocity;
		
		if (this.x < 0) {
			this.x = 0;
			this.heading = (Math.PI - this.heading) % TWO_PI;
		}
		if (this.x > canvas.width) {
			this.x = canvas.width;
			this.heading = (Math.PI - this.heading) % TWO_PI;
		}
		if (this.y < 0) {
			this.y = 0;
			this.heading = (TWO_PI - this.heading) % TWO_PI;
		}
		if (this.y > canvas.height) {
			this.y = canvas.height;
			this.heading = (TWO_PI - this.heading) % TWO_PI;
		}
		this.facing += this.spinSpeed;
	};
	
	this.draw = function() {
		drawBitmapCenteredAtLocationWithRotation(badguyPic,
	      this.x, this.y,0);
	};
	
	this.gotHit = function(damage) {
		this.life -= damage;
		
		if (this.life <= 0) {
			this.remove = true;
			enemyList.push(new TestEnemy(80, 80));
		}
	};
}

//Test code, remove this later
enemyList.push(new Enemy(50, 50));

//Enemy type code goes below here

//TestEnemy begin
TestEnemy.prototype = new Enemy();
TestEnemy.prototype.constructor = TestEnemy;

function TestEnemy(startX, startY){
	Enemy.call(this, startX, startY);
	this.parentMove = this.move;
	this.targetDirection;
	this.spinSpeed = 0.025;
	this.shotRate = 60;
	this.nextShot = this.shotRate;
	
	this.move = function() {
		var targetX = player.x - this.x;
		var targetY = player.y - this.y;
		this.targetDirection = Math.atan2(targetY, targetX);
		
		if(((this.heading - this.targetDirection) + Math.PI) % TWO_PI - Math.PI > 0) {
			this.heading -= this.spinSpeed;
		}
		else {
			this.heading += this.spinSpeed;
		}
		
		if(this.nextShot <= 0) {
			this.shoot();
		}
		this.nextShot--;
		
		this.parentMove();
	}
	
	this.shoot = function() {
		this.nextShot = this.shotRate;
		var shotDirection = 0.785398; //45 degrees in radians
		for(var i = 0; i < 8; i++) {
			shotList.push(new shotClass(this.x, this.y, shotDirection * i, true));
		}
	}
}
//TestEnemy end
enemyList.push(new TestEnemy(100, 100));
