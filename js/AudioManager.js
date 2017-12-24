var soundsLoaded = false;

var sounds = {
    'bullet': {
        'src': './audio/bulletShoot.wav',
        'volumeRange': {
            'min': 0.6,
            'max': 1
        }
    }
};

function loadSounds() {
    if (soundsLoaded) return;
    Object.keys(sounds).forEach(function(key) {
        var newSound = new Sound(sounds[key]);
        sounds[key] = newSound;
    });
    soundsLoaded = true;
}

function Sound(sound) {
    var audio = new Audio(sound.src);

    this.properties = sound;
    this.play = function() {
        if (this.properties.volumeRange) {
            audio.volume = getRandomVolume(this.properties.volumeRange.min, this.properties.volumeRange.max);
        }
        audio.play();
    };
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