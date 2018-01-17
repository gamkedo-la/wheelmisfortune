function randomPlayerArt() {
    playerKind = Math.floor(Math.random()*playerSpritePics.length);
}

function pointNotTooCloseToPlayer(minDist){
	var testX, testY;
	var safetyLimit = 300; //if it takes more than 300 checks something is wrong, BAIL
	do {
		testX = Math.random() * canvas.width;
		testY = Math.random() * canvas.height;
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

    this.drawMask = false;

    // temporary mask for collision made to work the current sprite
    this.mask = {
        width: 10,
        height: 23
    };
    this.mask.heightOffset = Math.floor(this.mask.height / 2) - this.mask.height % 2;

    this.move = function playerMove() {
        this.animCycleCounter++;

        this.isWalking = false; // unless key held...
        if (key_Move_Left) {
            this.x -= this.speed;
            this.isWalking = true;
        }
        if (key_Move_Right) {
            this.x += this.speed;
            this.isWalking = true;
        }
        if (key_Move_Up) {
            this.y -= this.speed;
            this.isWalking = true;
        }
        if (key_Move_Down) {
            this.y += this.speed;
            this.isWalking = true;
        }

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
    
		this.gunMuzzleX = this.x + Math.cos(this.gunRotation) * playerWeapon.width/2;
		this.gunMuzzleY = this.y + Math.sin(this.gunRotation) * playerWeapon.width/2;

	}; //end of playerMove

    this.draw = function() {
        var frameNow;
        if(this.isWalking) {
            frameNow = Math.floor(this.animCycleCounter/6)%3;
        } else {
            frameNow = 0; // stand
        }
        drawFacingLeftOption(playerSpritePics[playerKind],
                this.x, this.y, mouseX < this.x,
                frameNow);
        this.gunRotation = Math.atan2(mouseY - this.y, mouseX - this.x);

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
            this.muzzleFlashFrames = 3;
            sounds.bullet.play();
        }
    };

    this.takeDamage = function(damage) {
        this.health -= damage;
        console.log("Current player health", this.health);
        if (this.health == 0) {
            console.log("You died, but what the heck -- keep going!")
            this.health = this.maxHealth;
            console.log("Player health restored back to", this.health);
        }
    };
}
//player = new Player(400, 400);
