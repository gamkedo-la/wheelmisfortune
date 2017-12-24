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
	this.sprite = badguyPic;
	this.size = 80;
	this.flipToFaceLeft = false;
	
	// reflect player shot dynamic light? only works with circles
	this.useSpecularShineEffect = true; 

	this.life = 5;
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
		console.log("Heading: ", this.heading, "Facing: ", this.facing);
	};
	this.checkIfFacingLeft = function(){
		if (Math.abs(this.heading) > Math.PI/2){ return true;}
	}
	this.draw = function() {
		
		// draw enemy sprite
		drawBitmapCenteredAtLocationWithRotation(this.sprite, this.x, this.y,0 , this.checkIfFacingLeft());
		  
		// maybe draw a little shine
		if (this.useSpecularShineEffect) // reflect player shot dynamic light?
		{
			if (player.muzzleFlashFrames>0) // is player firing?
			{
				var shineRotation = Math.atan2(player.y - this.y, player.x - this.x);
				// rotate shine to face player, with extra 180 to match artwork
				drawBitmapCenteredAtLocationWithRotation(specularShinePic,this.x, this.y, shineRotation - (225*DEG_TO_RAD) );
			}
		}

	};
	
	this.gotHit = function(damage) {
		this.life -= damage;
		
		if (this.life <= 0) {
			this.remove = true;
			enemyList.push(new TestEnemy(80, 80));

			if(misfortunes.vampire.isActive) {
				misfortunes.vampire.properties.canRestoreHealth = true;
			}
		}
	};
	
	// Restrict heading to [-PI, PI)
	this.normalizeHeading = function() {
		this.heading = ((this.heading + THREE_PI) % TWO_PI) - Math.PI;
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
	this.turnRate = 0.025;
	this.shotRate = 100;
	this.nextShot = this.shotRate;
	
	this.move = function() {
		var targetX = player.x - this.x;
		var targetY = player.y - this.y;
		this.targetDirection = Math.atan2(targetY, targetX);
		
		this.normalizeHeading();
		
		// If the target is clockwise, rotate clockwise, unless the target is greater than PI in that direction
		if((this.targetDirection - this.heading > 0) != (Math.abs(this.targetDirection - this.heading) < Math.PI)) {
			this.heading -= this.turnRate;
		}
		else {
			this.heading += this.turnRate;
		}
		
		this.normalizeHeading();
		
		if(this.nextShot <= 0) {
			this.shoot();
		}
		this.nextShot--;
		
		this.parentMove();
	};
	
	this.shoot = function() {
		this.nextShot = this.shotRate;
		var shotDirection = 0.785398; //45 degrees in radians
		for(var i = 0; i < 8; i++) {
			shotList.push(new shotClass(this.x, this.y, shotDirection * i, true));
		}
	};
}
//TestEnemy end

//Slug enemy start
function Slug(startX,startY){
	Enemy.call(this, startX, startY);
	this.parentMove = this.move;
	this.targetDirection;
	this.turnRate = 0.025;
	this.shotRate = 100;
	//this.sprite = slugShieldPic;
	this.shieldBroken = false;
	
	this.move = function() {
		var targetX = player.x - this.x;
		var targetY = player.y - this.y;
		this.targetDirection = Math.atan2(targetY, targetX);
		
		this.normalizeHeading();
		
		// If the target is clockwise, rotate clockwise, unless the target is greater than PI in that direction
		if((this.targetDirection - this.heading > 0) != (Math.abs(this.targetDirection - this.heading) < Math.PI)) {
			this.heading -= this.turnRate;
		}
		else {
			this.heading += this.turnRate;
		}
		
		this.normalizeHeading();
		
		this.parentMove();
	};
}// Slug enemy end
enemyList.push(new TestEnemy(100, 100));