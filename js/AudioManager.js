var soundsLoaded = false;
var audioFormat;
var globalVolume = 1;

var sounds = {
    'bullet': {
        'src': './audio/bulletShoot',
        'volumeRange': {
            'min': 0.6,
            'max': 1
        }
    },
    'theme': {
        'src': './audio/endTheme',
        'volumeRange': {
            'min': 0.6,
            'max': 1
        }
    },
    'mainTheme': {
        'src': './audio/mainTheme',
        'loop': true
    },
    'bossTheme': {
        'src': './audio/bossTheme',
        'loop': true
    },
    'pauseTheme': {
        'src': './audio/pauseOrmenu',
        'loop': true
    }
};

function loadSounds() {
    if (soundsLoaded) return;
    setAudioFormat();
    Object.keys(sounds).forEach(function(key) {
        var newSound = new Sound(sounds[key]);
        sounds[key] = newSound;
    });
    soundsLoaded = true;
}

function Sound(sound) {
    var pathToSound = sound.src + audioFormat;
    var audio = new Audio(pathToSound);
    if (sound.loop) {
        audio.loop = sound.loop;
    }

    this.properties = sound;
    this.play = function() {
        if (this.properties.volumeRange) {
            audio.volume = getRandomVolume(this.properties.volumeRange.min, this.properties.volumeRange.max) * globalVolume;
        } else {
            audio.volume = globalVolume;
        }
        audio.play();
    };
    this.pause = function() {
        audio.pause();
    }
    
    this.changeVolume = function(volumeIn) {
        audio.volume = volumeIn;
    };
}

function setAudioFormat() {
    if (audioFormat && audioFormat.length > 0) return;

    var audio = new Audio();
    audioFormat = ".ogg";
    if (audio.canPlayType("audio/mp3")) {
        audioFormat = ".mp3";
    }
}

function getRandomVolume(minVolume, maxVolume) {
    var min = 0.5;
    var max = 1;

    if (minVolume && maxVolume) {
        min = minVolume;
        max = maxVolume;
    }
    var randomVolume = Math.random() * (max - min) + min;
    return randomVolume.toFixed(2);
}

function adjustGameVolume(volume) {
    Object.keys(sounds).forEach(function(key) {
        sounds[key].changeVolume(volume);
    });
}
