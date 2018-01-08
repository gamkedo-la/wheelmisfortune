// Everything is global for now
var currentWeapon = 'Gun';
var swapWeaponThisFrame = false;

// In the end we probably want to change weapons based on the character you've selected,
// but right now this will be useful for debugging different weapons.
function swapWeapon() {
	if (currentWeapon === 'Gun') {
		currentWeapon = 'Nothing';
	}
	else {
		currentWeapon = 'Gun';
	}
}