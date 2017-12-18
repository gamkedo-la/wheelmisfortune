
var wheelRadians = 0.0;
var wheelSpinSpeed = 0.0;
var wheelFriction = 0.98;
var wheelKickMin = .02;
var wheelKickMax = .06;
var wheelShowing = false;

function wheelMove(){
	wheelRadians += wheelSpinSpeed;
	wheelSpinSpeed *= wheelFriction;
	if(wheelRadians >= Math.PI * 2.0){
		wheelRadians -= Math.PI * 2.0;
	}
}

function drawWheel(){
	drawBitmapCenteredAtLocationWithRotation(wheelMisfortune,
	canvas.width / 2,canvas.height / 2,
		wheelRadians);
	colorRect(canvas.width/2, canvas.height/2 - wheelMisfortune.height/2 - 8, 4, 15, 'yellow');
	var wheelNow = Math.floor(misfortuneTypes.length * (wheelRadians/(2.0 * Math.PI)));
	canvasContext.fillStyle = "black";
	canvasContext.textAlign = 'center';
	canvasContext.fillText(misfortunes[misfortuneTypes[wheelNow]].displayName, canvas.width/2, canvas.height/2 + wheelMisfortune.height/2 +15);
}

function kickWheel(){
	wheelSpinSpeed += wheelKickMin + Math.random()* (wheelKickMax - wheelKickMin);
}