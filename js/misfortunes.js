const misfortunes = {
    'vanilla': {
        'displayName': 'Vanilla',
        'isActive': false,
        'description': 'Normal gameplay',
        'updateFunction': null
    },
    'meleeOnly': {
        'displayName': 'Melee Only',
        'isActive': false,
        'description': 'No guns, melee attacks only!',
        'updateFunction': null
    },
    'friendlyFire': {
        'displayName': 'Friendly Fire',
        'isActive': false,
        'description': 'Shots hurt other players -- watch out!',
        'updateFunction': null
    },
    'eternalBullet': {
        'displayName': 'Eternal Bullets',
        'isActive': false,
        'description': 'Bullets richocet forever until hitting an enemy or player',
        'updateFunction': handleEternalBullets
    }
};

const misfortunesTypes = Object.keys(misfortunes);
var activeMisfortunes = [];

function updateActiveMisfortunes() {
    for (var i = 0; i < activeMisfortunes.length; i++) {
        if (activeMisfortunes[i].updateFunction) {
            activeMisfortunes[i]['updateFunction']();
        }
    }
}

function activateMisfortune(misfortuneType) {
    // deactivate all types
    activeMisfortunes = [];
    for (type in misfortunes) {
        misfortunes[type].isActive = false;
    }

    // activate the passed misfortune
    misfortunes[misfortuneType].isActive = true;
    activeMisfortunes.push(misfortunes[misfortuneType]);
}

function deactivateMisfortune(misfortuneType) {
    activeMisfortunes = [];
    misfortunes[misfortuneType].isActive = false;
}

function handleEternalBullets() {
	keepBulletsActive();

	function keepBulletsActive(){		
	    for (var i = 0; i < shotList.length; i++) {
	        shotList[i].lifeLeft = 100;
	    }
	}
}