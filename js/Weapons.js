// Everything is global for now
var currentWeapon = 'Gun';
var swapWeaponThisFrame = false;

// In the end we probably want to change weapons based on the character you've selected,
// but right now this will be useful for debugging different weapons.
function swapWeapon() {
	if (currentWeapon === 'Gun') {
		currentWeapon = 'Sword';
	}
	else if (currentWeapon === 'Sword') {
		currentWeapon = 'Nothing';
	}
	else {
		currentWeapon = 'Gun';
	}
}

var swordHitboxMidX = 0;
var swordHitboxMidY = 0;
var swordHitboxWidth = 20;
var swordHitboxHeight = 20;
var swordSwingTimer = 0;
var swordDamage = 2;

function moveWeapons() {
	// TODO: this should be kept next to the player
    swordHitboxMidX = mouseX;
    swordHitboxMidY = mouseY;
    if (swordSwingTimer > 0) {
    	swordSwingTimer--;
    }
}

function swingSword() {
	// Don't swing if already swinging
	if (swordSwingTimer === 0) {
    	swordSwingTimer = 10;
    }
}

function checkSwordCollisions() {
	if (currentWeapon !== 'Sword') {
		return;
	}
	else if (swordSwingTimer === 0) {
		return;
	}

	for (var i = 0; i < enemyList.length; i++) {
        var currentEnemy = enemyList[i];

        if (currentEnemy.remove) continue;

        //Hacky collision code, replace at some point
        distX = swordHitboxMidX - currentEnemy.x;
        distY = swordHitboxMidY - currentEnemy.y;
        if ((distX * distX + distY * distY) <= currentEnemy.size) {

            //check for back hits
            var back;
            if ((swordHitboxMidX > currentEnemy.x && currentEnemy.faceLeft) ||
                    swordHitboxMidY < currentEnemy.x && !currentEnemy.faceLeft){
                back = true;
            }
            else back = false;
            currentEnemy.gotHit(swordDamage, back);
        }
    }
}

function drawSword() {
	var topLeftX = swordHitboxMidX - swordHitboxWidth / 2;
    var topLeftY = swordHitboxMidY - swordHitboxHeight / 2;
    var boxWidth = swordHitboxWidth;
    var boxHeight = swordHitboxHeight;
    var fillColor = 'blue';
    canvasContext.save();
    if (swordSwingTimer > 0) {
    	canvasContext.globalAlpha = 0.5;
    	colorRect(topLeftX, topLeftY, boxWidth, boxHeight, 'red');
    }
    else {
    	canvasContext.globalAlpha = 0.1;
    	colorRect(topLeftX, topLeftY, boxWidth, boxHeight, 'blue');
    }
    canvasContext.restore();
}
