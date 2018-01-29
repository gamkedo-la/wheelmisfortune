Slime.prototype = new Enemy();
Slime.prototype.constructor = Slime;
const Slime_THINK_DELAY = 300;

function Slime(startX, startY) {

    this.spriteSheet = slimeMainSheet; //bit hacky to rely on ordering like this, but works for now
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.spriteFrames = 4;
    this.spriteSpeed = 4;

    Enemy.call(this, startX, startY);



    this.velocity = .3;
    this.parentMove = this.move;
    this.targetDirection;
    this.framesUntilDirectionUpdate = 0;
    this.turnRate = 0.025;
    this.shotRate = 300;
    this.nextShot = this.shotRate;
    //this.useSpecularShineEffect = false;

    this.life = 3; //low because it only reduces for back hits or when shield is broken
    this.shieldHP = 10;
    this.shieldBroken = false;

    // reflect player shot dynamic light? NO: the effect only works with circles
    this.useSpecularShineEffect = false;

    this.move = function() {
        if(this.state == "normal" && Math.floor(Math.random() * 10) < 2 && this.nextShot < 0){
            this.state = "doubling"
            this.nextShot = 200; //time till end of doubling state
            this.sprite.setSprite(slimeMultiSheet, //note these values must be defined from the deriving class
                this.spriteWidth, this.spriteHeight,
                this.spriteFrames, 8, true);
        }
        if(this.state == "doubling" && this.nextShot < 0){
            this.state = "normal"
            this.nextShot = this.shotRate;
            this.sprite.setSprite(slimeMainSheet, //note these values must be defined from the deriving class
                this.spriteWidth, this.spriteHeight,
                this.spriteFrames, 4, true);
            enemyList.push(new LilSlime(this.x, this.y - 20));
            
        }

        this.nextShot--;
        if(this.state != "normal"){
            return;
        }

        
        this.framesUntilDirectionUpdate--;
        if (this.framesUntilDirectionUpdate <= 0) {
            this.framesUntilDirectionUpdate = Slime_THINK_DELAY;
            var targetX = player.x - this.x;
            var targetY = player.y - this.y;
            this.targetDirection = Math.atan2(targetY, targetX);

            this.normalizeHeading();
        }
        // If the target is clockwise, rotate clockwise, unless the target is greater than PI in that direction
        if ((this.targetDirection - this.heading > 0) != (Math.abs(this.targetDirection - this.heading) < Math.PI)) {
            this.heading -= this.turnRate;
        } else {
            this.heading += this.turnRate;
        }

        this.normalizeHeading();

        this.parentMove();
    };

    this.gotHit = function(damage, back) {
        var backHit = back || false; //defaults to false

        Slime.prototype.gotHit.call(this, damage); //redirects to the normal parent function
    }
} // Slime enemy end

function LilSlime(startX, startY) {

    this.spriteSheet = slimeBabySheet; //bit hacky to rely on ordering like this, but works for now
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.spriteFrames = 4;
    this.spriteSpeed = 4;

    Enemy.call(this, startX, startY);



    this.velocity = .6;
    this.parentMove = this.move;
    this.targetDirection;
    this.framesUntilDirectionUpdate = 0;
    this.turnRate = 0.025;
    this.shotRate = 300;
    this.nextShot = this.shotRate;
    this.lifeTime = 0
    //this.useSpecularShineEffect = false;

    this.life = 3; //low because it only reduces for back hits or when shield is broken
    this.shieldHP = 10;
    this.shieldBroken = false;

    // reflect player shot dynamic light? NO: the effect only works with circles
    this.useSpecularShineEffect = false;

    this.move = function() {
        if(this.lifeTime > 400){
            this.life = 0
            enemyList.push(new Slime(this.x, this.y - 20));
        }
        this.lifeTime++;
        
        this.framesUntilDirectionUpdate--;
        if (this.framesUntilDirectionUpdate <= 0) {
            this.framesUntilDirectionUpdate = 10;
            var targetX = player.x - this.x;
            var targetY = player.y - this.y;
            this.targetDirection = Math.atan2(targetY, targetX);

            this.normalizeHeading();
        }
        // If the target is clockwise, rotate clockwise, unless the target is greater than PI in that direction
        if ((this.targetDirection - this.heading > 0) != (Math.abs(this.targetDirection - this.heading) < Math.PI)) {
            this.heading -= this.turnRate;
        } else {
            this.heading += this.turnRate;
        }

        this.normalizeHeading();

        this.parentMove();
    };

    this.gotHit = function(damage, back) {
        var backHit = back || false; //defaults to false

        Slime.prototype.gotHit.call(this, damage); //redirects to the normal parent function
    }
} // Slime enemy end

function BossSlime(startX, startY) {

    this.spriteSheet = slimeBossSheet1; //bit hacky to rely on ordering like this, but works for now
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.spriteFrames = 4;
    this.spriteSpeed = 4;

    Enemy.call(this, startX, startY);
	
	this.size = 60;
    this.velocity = .6;
    this.parentMove = this.move;
    this.targetDirection;
    this.framesUntilDirectionUpdate = 0;
    this.turnRate = 0.025;
    this.shotRate = 300;
    this.nextShot = this.shotRate;
    this.lifeTime = 0
    //this.useSpecularShineEffect = false;

    this.life = 60; // very high (is literally the boss)
    this.shieldHP = 10;
    this.shieldBroken = false;

    this.hitKnockback = -1.0;

    // reflect player shot dynamic light? NO: the effect only works with circles
    this.useSpecularShineEffect = false;

    this.move = function() {
        /*if(this.lifeTime > 400){
            this.life = 0
            enemyList.push(new Slime(this.x, this.y - 20));
        }
        this.lifeTime++;*/
        
        this.framesUntilDirectionUpdate--;
        if (this.framesUntilDirectionUpdate <= 0) {
            this.framesUntilDirectionUpdate = 10;
            var targetX = player.x - this.x;
            var targetY = player.y - this.y;
            this.targetDirection = Math.atan2(targetY, targetX);

            this.normalizeHeading();
        }
        // If the target is clockwise, rotate clockwise, unless the target is greater than PI in that direction
        if ((this.targetDirection - this.heading > 0) != (Math.abs(this.targetDirection - this.heading) < Math.PI)) {
            this.heading -= this.turnRate;
        } else {
            this.heading += this.turnRate;
        }

        this.normalizeHeading();

        this.parentMove();
    };

    this.gotHit = function(damage, back) {
        var backHit = back || false; //defaults to false

        Slime.prototype.gotHit.call(this, damage); //redirects to the normal parent function
    }
} // Slime enemy end