var shotList = [];

function shotClass(startX, startY, shotAng, shotSpeed) {
    this.x = startX;
    this.y = startY;
    this.xv = Math.cos(shotAng) * shotSpeed;
    this.yv = Math.sin(shotAng) * shotSpeed;
    this.lifeLeft = 100;
		this.damage = 10;
    this.removeMe = false;

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

        this.checkForCollisionWithPlayer(this);
        this.checkForCollisionWithEnemies(this);
    };

    this.draw = function() {
        colorRect(this.x - 2, this.y - 2, 5, 5, "yellow");
    };

    this.checkForCollisionWithPlayer = function(shot) {
        var isCollidingWithPlayer = this.x > (playerX - playerWidth) &&
            this.y > playerY &&
            this.x < (playerX + playerWidth) &&
            this.y < (playerY + playerHeight);

        if(isCollidingWithPlayer) {
            this.removeMe = true;
        }
    };

    this.checkForCollisionWithEnemies = function(shot) {

    };
}

function fireShot() {
    shotList.push(
        new shotClass(
            player.x,
            player.y,
            Math.atan2(mouseY - player.y, mouseX - player.x),
            5.0
        )
    );
}