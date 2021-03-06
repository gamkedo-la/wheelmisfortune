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

function selectSpecificWeapon(weapon) {
    currentWeapon = weapon;
}

var swordAngle = 0;
var swordHitboxMidX = 0;
var swordHitboxMidY = 0;
var swordHitboxWidth = 30;
var swordHitboxHeight = 30;
var swordHandleX = 0;
var swordHandleY = 0;
var swordSwingTimer = 0;
var swordSwingMaxTimer = 10;
var swordDamageBarbarian = 10;
var swordDamageKnight = 2;

function moveWeapons() {
    var angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    swordAngle = angle;
    swordHitboxMidX = player.x + 20 * Math.cos(angle);
    swordHitboxMidY = player.y + 20 * Math.sin(angle);
    swordHandleX = player.x + 8 * Math.cos(angle);
    swordHandleY = player.y + 8 * Math.sin(angle);

    if (swordSwingTimer > 0) {
        swordSwingTimer--;
    }
}

function swingSword() {
    // Don't swing if already swinging
    if (swordSwingTimer === 0) {
        swordSwingTimer = swordSwingMaxTimer;
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

        var enenmyLeftX = currentEnemy.x - currentEnemy.spriteWidth / 2;
        var enemyRightX = currentEnemy.x + currentEnemy.spriteWidth / 2;
        var enemyTopY = currentEnemy.y - currentEnemy.spriteHeight / 2;
        var enemyBottomY = currentEnemy.y - currentEnemy.spriteHeight / 2;

        var swordLeftX = swordHitboxMidX - swordHitboxWidth / 2;
        var swordRightX = swordHitboxMidX + swordHitboxWidth / 2;
        var swordTopY = swordHitboxMidY - swordHitboxHeight / 2;
        var swordBottomY = swordHitboxMidY + swordHitboxHeight / 2;

        if (enenmyLeftX < swordRightX
            && enemyRightX > swordLeftX
            && enemyTopY < swordBottomY
            && enemyBottomY > swordTopY) {

            //check for back hits
            var back;
            if ((swordHitboxMidX > currentEnemy.x && currentEnemy.faceLeft) ||
                    swordHitboxMidY < currentEnemy.x && !currentEnemy.faceLeft){
                back = true;
            }
            else back = false;
            currentEnemy.gotHit(
                    (player.playerKind == PLAYER_KIND_BARBARIAN ?
                         swordDamageBarbarian : swordDamageKnight), back);
        }
    }
}

function drawSword() {

    // For debugging
    var showSwordHitbox = false;
    if (showSwordHitbox) {
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

    // Sword sprite draw / swing animation

    var flipSwordSprite = (swordAngle > Math.PI/2 || swordAngle < -Math.PI/2);
    var swordSwingProgress = (swordSwingMaxTimer - swordSwingTimer) / swordSwingMaxTimer;
    if (swordSwingTimer === 0) {
        swordSwingProgress = swordSwingMaxTimer;
    }

    var startSwingAngle = -Math.PI / 2;
    var endSwingAngle = Math.PI / 2;
    var currentSwingAngle = startSwingAngle + swordSwingProgress * (endSwingAngle - startSwingAngle);

    canvasContext.save();
    canvasContext.translate(swordHandleX, swordHandleY);
    if (flipSwordSprite) { 
        canvasContext.scale(-1.0, 1.0);
    }
    drawBitmapCenteredAtLocationWithRotation(
        swordPic,
        0,
        0,
        currentSwingAngle,
        false,
    );
    canvasContext.restore();
}
