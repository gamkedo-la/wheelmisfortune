const misfortunes = {
    'vanilla': {
        'displayName': 'Vanilla',
        'isActive': false,
        'description': 'Normal gameplay',
        'updateFunction': null
    },
    'fastMode': {
        'displayName': 'Caffeine Mode',
        'isActive': false,
        'description': 'Fast Movement!',
        'updateFunction': null
    },
    'doubleEnemy': {
        'displayName': 'Double enemies',
        'isActive': false,
        'description': 'more enemies!',
        'updateFunction': null
    },
    'eternalBullet': {
        'displayName': 'Eternal Bullets',
        'isActive': false,
        'description': 'Bullets richocet forever until hitting an enemy or player',
        'updateFunction': handleEternalBullets
    },
    'vampire': {
        'displayName': 'Vampire',
        'isActive': false,
        'description': 'Health auto-depletes, kill to heal!',
        'updateFunction': handleVampireMode,
        'properties': {
            'lastDrainedAt': 0,
            'canRestoreHealth': false
        }
    }
};
var secondsOnThisMisfortune = 0;

const misfortuneTypes = Object.keys(misfortunes);
var activeMisfortunes = [];

function countMisfortuneSecond(){
	if(wheelShowing == false && inGamePaused == false){
		secondsOnThisMisfortune++;
	}
}

function setUpMisfortuneTimer(){
	setInterval(countMisfortuneSecond, 1000);
}

function updateActiveMisfortunes() {
    if (wheelShowing){return;}
    for (var i = 0; i < activeMisfortunes.length; i++) {
        if (activeMisfortunes[i].updateFunction) {
            activeMisfortunes[i]['updateFunction']();
        }
    }
}

function displayMisfortuneTimer(){
	canvasContext.fillStyle = "white";
	canvasContext.textAlign = 'center';
	canvasContext.fillText(secondsOnThisMisfortune, canvas.width/2, canvas.height - 15);
}

function activateMisfortune(misfortuneType) {
    // deactivate all types
    activeMisfortunes = [];
    for (type in misfortunes) {
        misfortunes[type].isActive = false;
    }
	secondsOnThisMisfortune = 0;
    // activate the passed misfortune
	if(misfortunes[misfortuneType] != undefined){
		misfortunes[misfortuneType].isActive = true;
		activeMisfortunes.push(misfortunes[misfortuneType]);
	}else{
		console.log("undefined misfortune: " + misfortuneType);
	}
}

function deactivateMisfortune(misfortuneType) {
    activeMisfortunes = [];
    misfortunes[misfortuneType].isActive = false;
}

function handleEternalBullets() {
    keepBulletsActive();

    function keepBulletsActive() {
        for (var i = 0; i < shotList.length; i++) {
            shotList[i].lifeLeft = 100;
        }
    }
}

function handleVampireMode() {
    var healthToReplenish = 1;
    var healthToDeplete = 1;
    var depletionRate = 4000; // 4 seconds

    var now = new Date().getTime();
    var lastDrainedAt = misfortunes.vampire.properties.lastDrainedAt;
    var differenceInTime = now - lastDrainedAt;

    if (differenceInTime >= depletionRate && player.health > 0) {
        drainPlayerHealth();
    }

    var canRestoreHealth = (
       misfortunes.vampire.properties.canRestoreHealth &&
       player.health < player.maxHealth 
    );

    if(canRestoreHealth) {
        player.health += healthToReplenish;
        misfortunes.vampire.properties.canRestoreHealth = false;
    }

    function drainPlayerHealth() {
        player.takeDamage(healthToDeplete);
        misfortunes.vampire.properties.lastDrainedAt = new Date().getTime();
    }
}