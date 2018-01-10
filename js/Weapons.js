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

function moveWeapons() {
	// TODO: this should be kept next to the player
    swordHitboxMidX = mouseX;
    swordHitboxMidY = mouseY;
}

function drawSword() {
	var topLeftX = swordHitboxMidX - swordHitboxWidth / 2;
    var topLeftY = swordHitboxMidY - swordHitboxHeight / 2;
    var boxWidth = swordHitboxWidth;
    var boxHeight = swordHitboxHeight;
    var fillColor = 'blue';
    canvasContext.save();
    canvasContext.globalAlpha = 0.1;
    colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor);
    canvasContext.restore();
}
