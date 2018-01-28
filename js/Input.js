//key bools
var key_Move_Up = false;
var key_Move_Left = false;
var key_Move_Right = false;
var key_Move_Down = false;
var key_Space = false;
var key_Menu_Select = false;

//key cases
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SPACE = 32;
const KEY_ENTER = 13;
const KEY_M = 77;
const KEY_BACKSLASH = 220;
const KEY_E = 69;
const KEY_B = 66;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

var mouse_Left = false;
var mouse_Right = false;

var mouseX = 0;
var mouseY = 0;
var clickLock = false;

function keyPressed(evt) {
	// console.log(evt.keyCode);
	switch (evt.keyCode) {

		case KEY_W:
		case KEY_UP:
			key_Move_Up = true;
			break;

		case KEY_A:
		case KEY_LEFT:
			key_Move_Left = true;
			break;

		case KEY_S:
		case KEY_DOWN:
			key_Move_Down = true;
			break;

		case KEY_D:
		case KEY_RIGHT:
			key_Move_Right = true;
			break;

		case KEY_SPACE:
			key_Space = true;
			//no break, following through
		case KEY_ENTER:
			key_Menu_Select = true;
			break;
			
		case KEY_M:
			wheelShowing = !wheelShowing;
			break;
			
		case KEY_BACKSLASH:
			frameCounter.active = !frameCounter.active;
			break;

		case KEY_B:
			startBossFight();
			break;

		/*case KEY_E:
			swapWeaponThisFrame = true;
			break;
		*/

		default:
			// console.log("Unused KeyCode: " + evt.keyCode);
			break;
	}
}

function keyReleased(evt) {
	switch (evt.keyCode) {
		case KEY_W:
		case KEY_UP:
			key_Move_Up = false;
			break;
		case KEY_A:
		case KEY_LEFT:
			key_Move_Left = false;
			break;
		case KEY_S:
		case KEY_DOWN:
			key_Move_Down = false;
			break;
		case KEY_D:
		case KEY_RIGHT:
			key_Move_Right = false;
			break;
		case KEY_SPACE:
			key_Space = false;
			console.log(wheelSpinSpeed);
		case KEY_ENTER:
			key_Menu_Select = false;
			break;
	}
}

function mousePressed(evt) {
	switch (evt.button) {
		case 0:
			mouse_Left = true;
			break;
		case 2:
			mouse_Right = true;
			break;

		default:
			// console.log("Unused MouseCode: " + evt.button);
			break;
	}
}

function mouseReleased(evt) {
	switch (evt.button) {
		case 0:
			mouse_Left = false;
			break;
		case 2:
			mouse_Right = false;
			break;
	}
}

function mouseInside(x, y, width, height) {
	return mouseX > x && mouseX < x + width && mouseY > y	&& mouseY < y + height;
}

