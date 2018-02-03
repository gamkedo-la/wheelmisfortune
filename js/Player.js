const PLAYER_BUMP_RADIUS = 6;
const FRAMES_BETWEEN_PLAYER_DAMAGE = 60;

function applyPlayerKind() {
    if (playerKind === playerSpritePics.indexOf(knightPic)) {
        selectSpecificWeapon('Sword');
    }
}

function pointNotTooCloseToPlayer(minDist){
	var testX, testY;
	var safetyLimit = 300; //if it takes more than 300 checks something is wrong, BAIL
	do {
        testX = Math.floor(Math.random()*40)*16;
        var vertRow = Math.floor(Math.random()*22);
        testY = vertRow*16;
        testX -= vertRow * 13; // offsetting to roughly match angle of floor tiles
		safetyLimit--;
		if(safetyLimit < 0){
			console.log("pointNotTooCloseToPlayer exhausted attempts, was min dist too high? "+minDist);
			return {x: 5, y: 5};
		}
	} while(dist(testX,testY, player.x,player.y) < minDist);
			
	return {x: testX, y: testY};
}

function Player(positionX, positionY) {
    this.x = positionX;
    this.y = positionY;
    this.speed = 1;
    this.playerHeight = 48;
    this.playerWidth = 30;
	
	this.gunMuzzleX = 0.0;
	this.gunMuzzleY = 0.0;

    this.fireRate = 4; //In frames
    this.nextFire = 0;
    this.gunRotation = 0;
    this.muzzleFlashFrames = 0;
    this.isWalking = false; // for animation
    this.animCycleCounter = 0; // lazy frame rate controller

    this.maxHealth = 3;
    this.health = this.maxHealth;
	this.invulFrames = 0;
	
    this.drawMask = false;
    this.spriteHeight = 41; // used to find ground for sorting

    // temporary mask for collision made to work the current sprite
    this.mask = {
        width: 10,
        height: 23
    };
    this.mask.heightOffset = Math.floor(this.mask.height / 2) - this.mask.height % 2;

    this.move = function playerMove() {
        this.animCycleCounter++;
		var speedNow;
		if(this.invulFrames > 0){
			this.invulFrames--;
		}
		if(misfortunes.fastMode.isActive){
			speedNow = 2.5 * this.speed;
		}
		else{
			speedNow = this.speed;
		}
        this.isWalking = false; // unless key held...
        if (key_Move_Left) {
            this.x -= speedNow;
            this.isWalking = true;
        }
        if (key_Move_Right) {
            this.x += speedNow;
            this.isWalking = true;
        }
        if (key_Move_Up) {
            this.y -= speedNow;
            this.isWalking = true;
        }
        if (key_Move_Down) {
            this.y += speedNow;
            this.isWalking = true;
        }
		
		for(var i = 0; i < enemyList.length; i++){
			var distToBadGuy = sqrDist(enemyList[i].x, enemyList[i].y, this.x, this.y);
			var minDist = PLAYER_BUMP_RADIUS + enemyList[i].size;
			if(distToBadGuy < square(minDist)){
				//console.log("Too close to bad guy");
				var angToBadGuy = Math.atan2(this.y - enemyList[i].y, this.x - enemyList[i].x);
				this.x = enemyList[i].x + Math.cos(angToBadGuy) * minDist;
				this.y = enemyList[i].y + Math.sin(angToBadGuy) * minDist;
				
				if(enemyList[i].isDangerous){
					this.takeDamage(1);
				}//bumped bad guy
			}//seeing if too close to bad guy or crate
		}//checking every bad guy and crate
		
        if (this.x < this.playerWidth / 2) {
            this.x = this.playerWidth / 2;
        }
        if (this.x > canvas.width - this.playerWidth / 2) {
            this.x = canvas.width - this.playerWidth / 2;
        }
        if (this.y < this.playerHeight / 2) {
            this.y = this.playerHeight / 2;
        }
        if (this.y > canvas.height - this.playerHeight / 2) {
            this.y = canvas.height - this.playerHeight / 2;
        }

        if (this.nextFire > 0) {
            this.nextFire--;
        }

        this.gunRotation = Math.atan2(mouseY - this.y, mouseX - this.x);
    
		this.gunMuzzleX = this.x + Math.cos(this.gunRotation) * playerWeapon.width/2;
		this.gunMuzzleY = this.y + Math.sin(this.gunRotation) * playerWeapon.width/2;

	}; //end of playerMove

    this.draw = function() {
		if(this.invulFrames > 0 && this.invulFrames%4 < 2){
			return;//skip drawing so player flashes when hurt
		}
        var frameNow;
        if(this.isWalking) {
            frameNow = Math.floor(this.animCycleCounter/6)%3;
        } else {
            frameNow = 0; // stand
        }
        drawFacingLeftOption(playerSpritePics[playerKind],
                this.x, this.y, this.gunMuzzleX < this.x,
                frameNow);

        // muzzle flashes oriented to gun
        if (this.muzzleFlashFrames>0)
        {
            this.muzzleFlashFrames--;
            drawBitmapCenteredAtLocationWithRotation(
            muzzleFlashPic,
            this.gunMuzzleX,
            this.gunMuzzleY,
            this.gunRotation
            );
        }
		if(playerKind != PLAYER_KIND_NINJA){
        // mirror image the gun sprite if it is pointing left
			var flipGunSprite = (this.gunRotation > Math.PI/2 || this.gunRotation < -Math.PI/2);
			if (currentWeapon === 'Gun') {
				drawBitmapCenteredAtLocationWithRotation(
					playerWeapon,
					this.x,
					this.y,
					flipGunSprite?this.gunRotation-Math.PI:this.gunRotation, // if sprite is flipped we need to face "backwards"
					flipGunSprite
				);
			}
			else if (currentWeapon === 'Sword') {
				drawSword();
			}
		}

        if (this.drawMask) {
            canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
            canvasContext.fillRect(player.x - player.mask.width / 2, player.y - player.mask.heightOffset, player.mask.width, player.mask.height);
        }
    };

    this.shoot = function() {
        if (currentWeapon === 'Sword') {
            swingSword();
        }
        if (currentWeapon !== 'Gun') {
            return;
        }
        if (this.nextFire === 0) {
            this.nextFire = this.fireRate;
            var direction = Math.atan2(mouseY - this.y, mouseX - this.x);
            shotList.push(new shotClass(this.gunMuzzleX, this.gunMuzzleY, direction, false));
			if(playerKind != PLAYER_KIND_NINJA){
				this.muzzleFlashFrames = 3;
				sounds.bullet.play();
			}


        }
    };

    this.takeDamage = function(damage) {
		if(this.invulFrames > 0){
			return;
		}
        this.health -= damage;
		this.invulFrames = FRAMES_BETWEEN_PLAYER_DAMAGE;
        console.log("Current player health", this.health);
        if (this.health == 0) {
            console.log("You died, but what the heck -- keep going!")
            this.health = this.maxHealth;
            console.log("Player health restored back to", this.health);
        }
    };
}
//player = new Player(400, 400);
