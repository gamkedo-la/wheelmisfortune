var shotList = [];
const SHOT_SPEED = 2; 

function shotClass(startX, startY, shotAng, shotSpeed = SHOT_SPEED) {
    this.x = startX;
    this.y = startY;
    this.xv = Math.cos(shotAng) * shotSpeed;
    this.yv = Math.sin(shotAng) * shotSpeed;
    this.lifeLeft = 100;
    this.damage = 10;
    this.removeMe = false;
    this.bulletWidth = 2;
    this.bulletHeight = 2;

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
        drawBitmapCenteredAtLocationWithRotation(bulletPic, this.x, this.y,0);

        //colorRect(this.x - 2  , this.y - 2, this.bulletWidth, this.bulletHeight, "yellow");
    };
}

var shotController = (function() {
    var fireRate = 4;
    var nextFire = 0;
    
    var moveShots = function() {
        if(nextFire > 0) {
            nextFire--;
        }
        
        for (var i = shotList.length - 1; i >= 0; i--) {
            shotList[i].move();
            if (shotList[i].removeMe) {
                shotList.splice(i, 1);
            }
        }
    };
    
    var fireShot = function() {
        if(nextFire === 0) {
            nextFire = fireRate;
            var direction = Math.atan2(mouseY - player.y, mouseX - player.x);
            shotList.push(new shotClass(player.x, player.y, direction));
        }
    };
    
    return {
    	moveShots: moveShots,
			fireShot: fireShot
    };
})();
