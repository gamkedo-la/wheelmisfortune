var shotList = [];
const SHOT_SPEED = 2;
const ORIENT_SPRITE_FORWARD = false; // rotate bullet sprites to face forward? (good for rockets and laser bolts)
const TRAILS_ON = true;
const TRAIL_MAX_SIZE = 16; // how many previous xy to remember

function moveShots() {
    for (var i = shotList.length - 1; i >= 0; i--) {
        shotList[i].move();
        if (shotList[i].removeMe) {
            shotList.splice(i, 1);
        }
    }
}

function ParticleCanvasManager(){
    this.canvasIndex = 0;
    this.canvasList = [];
    this.canvasContextList = [];
    
    for(var i = 0; i < TRAIL_MAX_SIZE; i++){
        this.canvasList.push(document.createElement("canvas"));
        this.canvasContextList.push(this.canvasList[i].getContext("2d"));
        this.canvasList[i].width = canvas.width;
        this.canvasList[i].height = canvas.height;
    }
    
		// TODO consider moving some of this code outside of ShootingLogic.js
    this.drawToCanvas = function(graphic, atX, atY, withAngle){
        var context = this.canvasContextList[this.canvasIndex];
				
        context.save();
        context.translate(atX, atY);
        context.rotate(withAngle);
        context.drawImage(graphic, -graphic.width / 2, -graphic.height / 2);
        context.restore();
    }
    
    this.draw = function(){
				this.canvasIndex = (++this.canvasIndex) % TRAIL_MAX_SIZE;
        this.canvasContextList[this.canvasIndex].clearRect(0, 0, this.canvasList[this.canvasIndex].width, this.canvasList[this.canvasIndex].height);
				
        for(var i = 0; i < TRAIL_MAX_SIZE; i++) {
            canvasContext.drawImage(this.canvasList[i], 0, 0);
        }
    }
}

function shotClass(startX, startY, shotAng, enemy, shotSpeed = SHOT_SPEED) {
    this.x = startX;
    this.y = startY;
    this.xv = Math.cos(shotAng) * shotSpeed;
    this.yv = Math.sin(shotAng) * shotSpeed;
    this.lifeLeft = 100;
    this.damage = 1;
    this.removeMe = false;
    this.bulletWidth = 2;
    this.bulletHeight = 2;
    this.enemy = enemy;
    this.rotation = 0;
    this.spriteHeight = 20; // used to find ground for sorting

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

        this.lifeLeft--;
        if (this.lifeLeft < 0) {
            this.removeMe = true;
        }
    };

    this.draw = function() {
        
        if (TRAILS_ON)
        {
            particleCanvasManager.drawToCanvas(smokeTrailPic, this.x, this.y, Math.PI*2*this.x*this.y);
        }

        if (ORIENT_SPRITE_FORWARD) this.rotation = Math.atan2(this.yv,this.xv);
		if(this.enemy == false && playerKind == PLAYER_KIND_NINJA){
			drawBitmapCenteredAtLocationWithRotation(ninjaStarPic, this.x, this.y, this.rotation);
			this.rotation += 0.15;
		} else{
			drawBitmapCenteredAtLocationWithRotation(bulletPic, this.x, this.y, this.rotation);
		}
    };

    this.checkForCollisionWithPlayer = function() {
        if (!this.enemy || this.removeMe) return;
        var isCollidingWithPlayer = this.x > (player.x - player.mask.width/2) &&
            this.y > (player.y - player.mask.heightOffset) &&
            this.x < (player.x + player.mask.width) &&
            this.y < (player.y + player.mask.heightOffset);

        if (isCollidingWithPlayer) {
            player.takeDamage(this.damage);
            this.removeMe = true;
        }
    };

    this.checkForCollisionWithEnemies = function() {
        if (this.enemy || this.removeMe) return;
        var distX = 0;
        var distY = 0;

        for (var i = 0; i < enemyList.length; i++) {
            var currentEnemy = enemyList[i];

            if (currentEnemy.remove) continue;

            if (sqrDist(this.x, this.y, currentEnemy.x, currentEnemy.y) <= square(currentEnemy.size)) {

                //check for back hits
                var back;
                if ((this.xv < 0 && currentEnemy.faceLeft) ||
                    this.xv > 0 && !currentEnemy.faceLeft){
                back = true;
                }
                else back = false;
                
                this.removeMe = true;
                currentEnemy.gotHit(this.damage, back);
            }
        }
    };
}

function checkBulletCollisions() {
    for (var i = 0; i < shotList.length; i++) {
        shotList[i].checkForCollisionWithPlayer();
        shotList[i].checkForCollisionWithEnemies();
    }
}
