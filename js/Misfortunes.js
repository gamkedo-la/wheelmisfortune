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

const misfortuneTypes = Object.keys(misfortunes);
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
        console.log('Killed an enemy, restore player health');
        player.health += healthToReplenish;
        misfortunes.vampire.properties.canRestoreHealth = false;
    }

    function drainPlayerHealth() {
        player.takeDamage(healthToDeplete);
        misfortunes.vampire.properties.lastDrainedAt = new Date().getTime();
    }
}