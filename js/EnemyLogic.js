var enemyList = [];

function moveEnemies() {
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].move();
		if(enemyList[i].remove) {
			enemyList.splice(i, 1);
		}
	}
}

function Enemy(startX, startY) {
	this.x = startX;
	this.y = startY;
	this.moveSpeed = 2;
	this.heading = 0.523599;
	this.velocity = 2;
	this.facing = 0;
	this.spinSpeed = 0.025;
	
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
		colorRect(this.x, this.y, 10, 10, "red");
	};
}

//Test code, remove this later
enemyList.push(new Enemy(100, 100));

//Enemy type code goes below here

//TestEnemy begin
TestEnemy.prototype = new Enemy();
TestEnemy.prototype.constructor = TestEnemy;

function TestEnemy(startX, startY){
	Enemy.call(this, startX, startY);
	this.parentMove = this.move;
	this.targetDirection;
	
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
		
		this.parentMove();
	}
}
//TestEnemy end
enemyList.push(new TestEnemy(200, 200));
