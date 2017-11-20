//key bools
var key_Move_Up = false;
var key_Move_Left = false;
var key_Move_Right = false;
var key_Move_Down = false;
var key_Space = false;
//key cases
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SPACE = 32;

var mouse_Left = false;
var mouse_Right = false;

var mouseX = 0;
var mouseY = 0;

function keyPressed(evt) {
	switch (evt.keyCode) {
		case KEY_W:
			key_Move_Up = true;
			break;
		case KEY_A:
			key_Move_Left = true;
			break;
		case KEY_S:
			key_Move_Down = true;
			break;
		case KEY_D:
			key_Move_Right = true;
			break;
		case KEY_SPACE:
			key_Space = true;
			break;

		default:
			console.log("Unused KeyCode: " + evt.keyCode);
			break;
	}
}

function keyReleased(evt) {
	switch (evt.keyCode) {
		case KEY_W:
			key_Move_Up = false;
			break;
		case KEY_A:
			key_Move_Left = false;
			break;
		case KEY_S:
			key_Move_Down = false;
			break;
		case KEY_D:
			key_Move_Right = false;
			break;
		case KEY_SPACE:
			key_Space = false;
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
			console.log("Unused MouseCode: " + evt.button);
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
