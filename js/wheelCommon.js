var wheelRadians = 0.0;
var wheelSpinSpeed = 0.0;
var wheelFriction = 0.98;
var wheelKickMin = .02;
var wheelKickMax = .06;
var wheelShowing = false;

function drawWheel(){
	drawBitmapCenteredAtLocationWithRotation(wheelMisfortune,
	canvas.width / 2,canvas.height / 2,
		wheelRadians);
	colorRect(canvas.width/2, canvas.height/2 - wheelMisfortune.height/2 - 8, 4, 15, 'yellow');
}

function kickWheel(){
	wheelSpinSpeed += wheelKickMin + Math.random()* (wheelKickMax - wheelKickMin);

}