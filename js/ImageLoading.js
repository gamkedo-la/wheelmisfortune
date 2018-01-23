var ninjaPic = document.createElement("img");
var cowboyPic = document.createElement("img");
var knightPic = document.createElement("img");
var playerSpritePics = [ninjaPic,cowboyPic,knightPic];
const PLAYER_KIND_NINJA = 0;
const PLAYER_KIND_COWBOY = 1;
const PLAYER_KIND_KNIGHT = 2;

var playerKind = 0; // will randomize/set at top of Player.js

var bulletPic = document.createElement("img");
var badguyPic = document.createElement("img");
var slugShieldPic = document.createElement("img");
var slugNoShieldPic = document.createElement("img");
var backGroundPic = document.createElement("img");
var playerWeapon = document.createElement("img");
var wheelMisfortune = document.createElement("img");
var muzzleFlashPic = document.createElement("img");
var specularShinePic = document.createElement("img");
var smokeTrailPic = document.createElement("img");
var ninjaStarPic = document.createElement("img");

var crateShortPic = document.createElement("img");
var crateTallPic = document.createElement("img");

var swordPic = document.createElement("img");

var picsToLoad = 0; //// one less thing to manually keep in sync

function countLoadedImageAndLaunchIfReady() {
	picsToLoad--;
	if (picsToLoad == 0) {
		// last image loaded?
		loadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	////
	// picsToLoad++; // led to race condition, don’t want to do it that way, after all! ////
	imgVar.onload = countLoadedImageAndLaunchIfReady; ////
	imgVar.src = "images/" + fileName; ////
} ////

function loadImages() {
	var imageList = [
		////
		{ varName: ninjaPic, theFile: "ninjaPlayer.png"}, ////
		{ varName: cowboyPic, theFile: "cowboyPlayer.png"}, ////
		{ varName: knightPic, theFile: "knightPlayer.png"}, ////
		{ varName: bulletPic, theFile: "bullet.png" }, ////
		{ varName: badguyPic, theFile: "testEnemy00.png" }, ////
		{ varName: slugShieldPic, theFile: "slugMoveShield.png" },
		{ varName: slugNoShieldPic, theFile: "slugMoveBreak.png" }, 
		{ varName: backGroundPic, theFile: "arena01.png" }, ////
		{ varName: playerWeapon, theFile: "gunRotateTest.png" },
		{ varName: wheelMisfortune, theFile: "wheeloffortune.png"},
		{ varName: muzzleFlashPic, theFile: "muzzleFlash.png"},
		{ varName: specularShinePic, theFile: "sphereSpecularShine.png"},
		{ varName: smokeTrailPic, theFile: "smokeTrail.png"},
		{ varName: crateShortPic, theFile: "Crate.png"},
		{ varName: crateTallPic, theFile: "CrateLarge.png"},
		{ varName: swordPic, theFile: "swordRotateTest.png"},
		{ varName: ninjaStarPic, theFile: "ninjastar.png"}
	]; ////

	picsToLoad = imageList.length; ////

	for (var i = 0; i < imageList.length; i++) {
		////
		beginLoadingImage(imageList[i].varName, imageList[i].theFile); ////
	} ////
}
