var enemyList = []; //list of enemies
const MIN_SPAWN_DIST_TO_PLAYER = 250;

function spawnInitialEnemies(){
	var deathSphereCount = 1 + Math.floor(Math.random() * 2);
	var slugCount = 2 + Math.floor(Math.random() * 3);
	for(var i = 0; i < deathSphereCount; i++){
		var nextPt = pointNotTooCloseToPlayer(MIN_SPAWN_DIST_TO_PLAYER);
		enemyList.push(new DeathSphere(nextPt.x,nextPt.y));
	}
	for(var i = 0; i < deathSphereCount; i++){
		var nextPt = pointNotTooCloseToPlayer(MIN_SPAWN_DIST_TO_PLAYER);
		enemyList.push(new Slug(nextPt.x,nextPt.y));
	}
	for(var i = 0; i < 3; i++){
		var nextPt = pointNotTooCloseToPlayer(MIN_SPAWN_DIST_TO_PLAYER);
		enemyList.push(new LilBox(nextPt.x,nextPt.y));
	}
	for(var i = 0; i < 2; i++){
		var nextPt = pointNotTooCloseToPlayer(MIN_SPAWN_DIST_TO_PLAYER);
		enemyList.push(new BigBox(nextPt.x,nextPt.y));
	}
}

function moveEnemies() {
	for (var i = enemyList.length - 1; i >= 0; i--) {  //backwards since we are splicing out
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
	//this.sprite = badguyPic;
	this.size = 80;
	this.faceLeft = false;
	
	// set to zero for no kickback / knockback effect
	this.hitKnockback = -3.0; // how far back it gets pushed when it gets hit
	
	// reflect player shot dynamic light? only works with circles
	this.useSpecularShineEffect = true; 

	this.life = 5;
	this.remove = false;

	this.sprite = new spriteClass();
	this.sprite.setSprite(this.spriteSheet, //note these values must be defined from the deriving class
		this.spriteWidth, this.spriteHeight,
		this.spriteFrames, this.spriteSpeed, true);
	
	this.move = function() {
		if(this.life <= 0) {
			this.remove = true; 
			return;
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
	this.checkIfFacingLeft = function(){
		if (Math.abs(this.heading) > Math.PI/2){
			this.faceLeft = true;
		}
		else {this.faceLeft = false;}
		return this.faceLeft;
	};
	this.draw = function() {
		
		// draw enemy sprite
		this.sprite.draw(this.x, this.y, this.checkIfFacingLeft());
		//drawBitmapCenteredAtLocationWithRotation(this.sprite, this.x, this.y,0 , this.checkIfFacingLeft());
		  
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
	
	this.gotHit = function(damage, shotInBack) {

		this.life -= damage;
		
		if (this.hitKnockback) // enemy gets nudged a few pixels back when hit
		{
			var dir = Math.atan2(player.y - this.y, player.x - this.x);
			this.x += Math.cos(dir) * this.hitKnockback;
			this.y += Math.sin(dir) * this.hitKnockback;
		}

		if (this.life <= 0) {
			this.remove = true;
			//enemyList.push(new DeathSphere(80, 80)); //spawned new enemy each time one dies for testing

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
//end base enemy class

//Enemy type code goes below here

//DeathSphere begin
DeathSphere.prototype = new Enemy();
DeathSphere.prototype.constructor = DeathSphere;

function DeathSphere(startX, startY){

	this.spriteSheet = badguyPic;	//bit hacky to rely on ordering like this, but works for now
	this.spriteWidth = 16;
	this.spriteHeight = 16;
	this.spriteFrames = 1;
	this.spriteSpeed = 1;

	Enemy.call(this, startX, startY); //calls base class constructor
	
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
//DeathSphere end

//Slug enemy start

const 	SLUG_THINK_DELAY = 300;

Slug.prototype = new Enemy();
Slug.prototype.constructor = Slug;
function Slug(startX,startY){

	this.spriteSheet = slugShieldPic;	//bit hacky to rely on ordering like this, but works for now
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 2;
	this.spriteSpeed = 1;

	Enemy.call(this, startX, startY);
	this.parentMove = this.move;
	this.targetDirection;
	this.framesUntilDirectionUpdate = 0;
	this.turnRate = 0.025;
	this.shotRate = 100;
	//this.useSpecularShineEffect = false;

	this.life = 3; //low because it only reduces for back hits or when shield is broken
	this.shieldHP = 10;
	this.shieldBroken = false;
	
	// reflect player shot dynamic light? NO: the effect only works with circles
	this.useSpecularShineEffect = false; 

	this.move = function() {
		this.framesUntilDirectionUpdate--;
		if(this.framesUntilDirectionUpdate <= 0){
			this.framesUntilDirectionUpdate = SLUG_THINK_DELAY;
			var targetX = player.x - this.x;
			var targetY = player.y - this.y;
			this.targetDirection = Math.atan2(targetY, targetX);
			
			this.normalizeHeading();
		}
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
	this.gotHit = function(damage, back){
		var backHit = back || false; //defaults to false
		
		if (backHit){
			console.log("Back hit! Damage: ", damage);
		}
		else if (!this.shieldBroken){
			this.shieldHP--;
			if (this.shieldHP<=0){
				console.log("Shield just broke");
				this.shieldBroken = true;
				this.sprite.setSprite(slugNoShieldPic,
					this.spriteWidth, this.spriteHeight,
					this.spriteFrames, this.spriteSpeed, true);
			}
			return; //we don't deal actual damage until the shield is broken
		}
		else {
			console.log("Hit in the face");
		}

		Slug.prototype.gotHit.call(this, damage); //redirects to the normal parent function
	}
}// Slug enemy end

LilBox.prototype = new Enemy();
LilBox.prototype.constructor = LilBox;

function LilBox(startX, startY){

	this.spriteSheet = crateShortPic;	//bit hacky to rely on ordering like this, but works for now
	this.spriteWidth = 16;
	this.spriteHeight = 16;
	this.spriteFrames = 1;
	this.spriteSpeed = 1;

	Enemy.call(this, startX, startY); //calls base class constructor
	
	this.hitKnockback = -13.0; // lightweight box

	this.parentMove = this.move;
	
	this.move = function() {
		this.velocity = 0; // it's a box
		this.parentMove();
	};
}
//LilBox end

BigBox.prototype = new Enemy();
BigBox.prototype.constructor = BigBox;

function BigBox(startX, startY){

	this.spriteSheet = crateTallPic;	//bit hacky to rely on ordering like this, but works for now
	this.spriteWidth = 16;
	this.spriteHeight = 32;
	this.spriteFrames = 1;
	this.spriteSpeed = 1;

	Enemy.call(this, startX, startY); //calls base class constructor
	
	this.hitKnockback = -1.0; // heavy box

	this.parentMove = this.move;
	
	this.move = function() {
		this.velocity = 0; // it's a box, too
		this.parentMove();
	};
}
//LilBox end