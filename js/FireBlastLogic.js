


function fireBlastClass(startX, startY, shotAng, enemy, shotSpeed = SHOT_SPEED) {
    this.x = startX;
    this.y = startY;
    this.xv = Math.cos(shotAng) * shotSpeed;
    this.yv = Math.sin(shotAng) * shotSpeed;
    this.lifeLeft = 30;
    this.damage = 2;
    this.removeMe = false;
    this.bulletWidth = 2;
    this.bulletHeight = 2;
    this.spriteWidth = 12;
    this.spriteHeight = 12;
    this.enemy = enemy;
    this.rotation = 0;
    this.sprite = new spriteClass();
    this.sprite.setSprite(firebulletPic, //note these values must be defined from the deriving class
        this.spriteWidth, this.spriteHeight,
        4, 2, true);
    this.state = 0
    if (TRAILS_ON)
    {
        this.trailIndex = 0;
        this.trailx = [];
        this.traily = [];
    }

    this.move = function() {
        if(this.state == 0){
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

        if (TRAILS_ON) // remember prev positions
        {   // a circular buffer of fixed size
            this.trailIndex++;
            if (this.trailIndex > TRAIL_MAX_SIZE) this.trailIndex = 0;
            this.trailx[this.trailIndex] = this.x;
            this.traily[this.trailIndex] = this.y;
        }
        }
        
        this.lifeLeft--;
        if (this.lifeLeft < 0) {
            if(this.state == 0){
                this.state += 1;
                this.lifeLeft = 100
                this.sprite.setSprite(fireblastSheet, //note these values must be defined from the deriving class
                    48, 48,
                    8, 2, true);
                return;
            }
            if(this.state == 1){
                this.removeMe = true;
            }
        }
    };

    this.draw = function() {
        this.sprite.draw(this.x, this.y, true);
       

        if (TRAILS_ON && this.state == 0)
        {
            for (var i=0; i<TRAIL_MAX_SIZE; i++)
            {
                drawBitmapCenteredAtLocationWithRotation(smokeTrailPic, this.trailx[i], this.traily[i], Math.PI*2*this.trailx[i]*this.traily[i]);
            }
        }

  //       if (ORIENT_SPRITE_FORWARD) this.rotation = Math.atan2(this.yv,this.xv);
		// drawBitmapCenteredAtLocationWithRotation(firebulletPic, this.x, this.y, this.rotation);		
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

            //Hacky collision code, replace at some point
            distX = this.x - currentEnemy.x;
            distY = this.y - currentEnemy.y;
            if ((distX * distX + distY * distY) <= currentEnemy.size) {

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

