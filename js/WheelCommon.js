
var wheelRadians = 0.0;
var wheelSpinSpeed = 0.0;
var wheelFriction = 0.98;
var wheelKickMin = .02;
var wheelKickMax = .06;
var wheelShowing = false;
var wheelNow = 0;
var wheelSpinning = false;
const wheelSpeedCountAsStopped = .0011; //Make number smaller to make wheel show longer before it finishes.

function wheelMove(){
	wheelRadians += wheelSpinSpeed;
	wheelSpinSpeed *= wheelFriction;
	if(wheelRadians >= Math.PI * 2.0){
		wheelRadians -= Math.PI * 2.0;
	}
	wheelNow = Math.floor(misfortuneTypes.length * (wheelRadians/(2.0 * Math.PI)));
	activateMisfortune(misfortuneTypes[wheelNow]);
	if(wheelSpinning == true && wheelSpinSpeed <= wheelSpeedCountAsStopped){
		hideMisfortuneWheel();
	}
}

function drawWheel(){
	drawBitmapCenteredAtLocationWithRotation(wheelMisfortune,
	canvas.width / 2,canvas.height / 2,
		wheelRadians);
	colorRect(canvas.width/2, canvas.height/2 - wheelMisfortune.height/2 - 8, 4, 15, 'yellow');
	canvasContext.fillStyle = "black";
	canvasContext.textAlign = 'center';
	canvasContext.fillText(misfortunes[misfortuneTypes[wheelNow]].displayName, canvas.width/2, canvas.height/2 + wheelMisfortune.height/2 + 15);
}

function kickWheel(){
	wheelSpinSpeed += wheelKickMin + Math.random()* (wheelKickMax - wheelKickMin);
	wheelSpinning = true;
}


//Clear misfortune wheel from screen once a misfortune is activated.
function hideMisfortuneWheel(){
	console.log(misfortunes[misfortuneTypes[wheelNow]].displayName);
	wheelShowing = false;
	wheelSpinning = false;
	wheelSpinSpeed = 0;
}//end misfortuneTimer function