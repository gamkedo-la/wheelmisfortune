const PLAYER_BUMP_RADIUS = 6;
const FRAMES_BETWEEN_PLAYER_DAMAGE = 60;
const PLAYER_SPRITE_FRAME_WIDTH = 32;

function applyPlayerKind() {
    player.x = player.startX;
    player.y = player.startY;
    if (playerKind === PLAYER_KIND_KNIGHT ||
        playerKind === PLAYER_KIND_BARBARIAN) {
        selectSpecificWeapon('Sword');
    } else {
        selectSpecificWeapon('Gun');
    }
    switch(playerKind) {
        case PLAYER_KIND_NINJA:
            player.maxHealth = 3;
            break;
        case PLAYER_KIND_COWBOY:
            player.maxHealth = 3;
            break;
        case PLAYER_KIND_KNIGHT:
            player.maxHealth = 5;
            break;
        case PLAYER_KIND_WIZARD:
            player.maxHealth = 1;
            break;
        case PLAYER_KIND_BARBARIAN:
            player.maxHealth = 2;
            break;
    }
    player.health = player.maxHealth;
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
    this.startX = positionX;
    this.startY = positionY;
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

    this.maxHealth = 3; // gets overriden by player class selection
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
        if(playerKind == PLAYER_KIND_WIZARD ||
            playerKind == PLAYER_KIND_NINJA) { // spells/stars closer to body
            this.gunMuzzleX = (this.x + this.gunMuzzleX)*0.5;
            this.gunMuzzleY = (this.y + this.gunMuzzleY)*0.5;
        }

	}; //end of playerMove

    this.drawGun = function() {
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
    }

    this.draw = function() {
		if(this.invulFrames > 0 && this.invulFrames%4 < 2){
			return;//skip drawing so player flashes when hurt
		}
        var frameNow;
        if(this.isWalking) {
            frameNow = Math.floor(this.animCycleCounter/6)%4;
        } else {
            frameNow = 0; // stand
        }

        if(playerKind != PLAYER_KIND_NINJA && playerKind != PLAYER_KIND_WIZARD){
            if(this.gunRotation <= 0) {
                if (currentWeapon === 'Sword') {
                    drawSword(); // draw behind player
                } else {
                    this.drawGun();
                }
            }
        }

        drawFacingLeftOption(playerSpritePics[playerKind],
                this.x, this.y, this.gunMuzzleX < this.x,
                frameNow, PLAYER_SPRITE_FRAME_WIDTH);

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
		if(playerKind != PLAYER_KIND_NINJA && playerKind != PLAYER_KIND_WIZARD){
            if(this.gunRotation > 0) { // draw in front of player
                if (currentWeapon === 'Sword') {
                    drawSword();
                } else {
                    this.drawGun();
                }
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

            if(playerKind == PLAYER_KIND_WIZARD) {
                var forkAngle = 0.2;
                shotList.push(new shotClass(this.gunMuzzleX, this.gunMuzzleY, direction-forkAngle, false));
                shotList.push(new shotClass(this.gunMuzzleX, this.gunMuzzleY, direction+forkAngle, false));
            }

			if(playerKind != PLAYER_KIND_NINJA && playerKind != PLAYER_KIND_WIZARD){
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

        if (this.health == 0) {
            console.log("You died");
            inGamePaused = true;
            secondsOnThisMisfortune = 0;
            gameController.changeState(GameOverState); // return to main menu
        }
    };
}
//player = new Player(400, 400);
