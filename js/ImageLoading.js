var ninjaPic = document.createElement("img");
var cowboyPic = document.createElement("img");
var knightPic = document.createElement("img");
var wizardPic = document.createElement("img");
var barbarianPic = document.createElement("img");
var playerSpritePics = [ninjaPic,cowboyPic,knightPic,wizardPic,barbarianPic];
const PLAYER_KIND_NINJA = 0;
const PLAYER_KIND_COWBOY = 1;
const PLAYER_KIND_KNIGHT = 2;
const PLAYER_KIND_WIZARD = 3;
const PLAYER_KIND_BARBARIAN = 4;

var playerKind = 0; // will randomize/set at top of Player.js

var bulletPic = document.createElement("img");
var firebulletPic = document.createElement("img");
var badguyPic = document.createElement("img");
var slugShieldPic = document.createElement("img");
var slugNoShieldPic = document.createElement("img");
var monarchPic = document.createElement("img");
var darkmageSheet = document.createElement("img");
var darkmageWarmupSheet = document.createElement("img");
var darkmageTurnDownSheet = document.createElement("img");
var fireblastSheet = document.createElement("img");

var slimeBossSheet1 = document.createElement("img");
var slimeBossSheet2 = document.createElement("img");
var slimeBossSheet3 = document.createElement("img");
var slimeBossSheet4 = document.createElement("img");

var backGroundPic = document.createElement("img");
var playerWeapon = document.createElement("img");
var wheelMisfortune = document.createElement("img");
var muzzleFlashPic = document.createElement("img");
var specularShinePic = document.createElement("img");
var smokeTrailPic = document.createElement("img");
var ninjaStarPic = document.createElement("img");

var crateShortPic = document.createElement("img");
var crateTallPic = document.createElement("img");
var stoneWallPic = document.createElement("img");

var swordPic = document.createElement("img");
var heartPic = document.createElement("img");
var slimeMainSheet = document.createElement("img");
var slimeBabySheet = document.createElement("img");
var slimeMultiSheet = document.createElement("img");

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
		{ varName: wizardPic, theFile: "wizardPlayer.png"}, ////
		{ varName: barbarianPic, theFile: "barbarianPlayer.png"}, ////

		{ varName: bulletPic, theFile: "bullet.png" }, ////
		{ varName: firebulletPic, theFile: "firebit.png" }, ////
		{ varName: backGroundPic, theFile: "arena01-test.png" },
		{ varName: slugShieldPic, theFile: "slugMoveShield.png" },
		{ varName: slugNoShieldPic, theFile: "slugMoveBreak.png" }, 
		{ varName: badguyPic, theFile: "testEnemy00.png" }, ////
		{ varName: monarchPic, theFile: "monocle_monarch.png" }, ////
		{ varName: playerWeapon, theFile: "gunRotateTest.png" },
		{ varName: wheelMisfortune, theFile: "wheeloffortune.png"},
		{ varName: muzzleFlashPic, theFile: "muzzleFlash.png"},
		{ varName: specularShinePic, theFile: "sphereSpecularShine.png"},
		{ varName: smokeTrailPic, theFile: "smokeTrail.png"},
		{ varName: crateShortPic, theFile: "Crate.png"},
		{ varName: crateTallPic, theFile: "CrateLarge.png"},
		{ varName: stoneWallPic, theFile: "StoneWallTile_3.png"},
		{ varName: swordPic, theFile: "swordRotateTest.png"},
		{ varName: ninjaStarPic, theFile: "ninjastar.png"},
		{ varName: heartPic, theFile: "playerHeart.png"},
		{ varName: darkmageSheet, theFile: "darkmage.png"},
		{ varName: darkmageWarmupSheet, theFile: "darkmage_Animation 3.png"},
		{ varName: darkmageTurnDownSheet, theFile: "darkmage_Animation 4.png"},
		{ varName: slimeMainSheet, theFile: "slime_Animation 1.png"},
		{ varName: slimeBabySheet, theFile: "slime_Animation 2.png"},
		{ varName: slimeMultiSheet, theFile: "slime_Animation 3.png"},
		{ varName: fireblastSheet, theFile: "fireblast.png"},
		{ varName: slimeBossSheet1, theFile: "slimeboss_anim_1.png"},
		{ varName: slimeBossSheet2, theFile: "slimeboss_anim_2.png"},
		{ varName: slimeBossSheet3, theFile: "slimeboss_anim_3.png"},
		{ varName: slimeBossSheet4, theFile: "slimeboss_anim_4.png"}		
	]; ////

	picsToLoad = imageList.length; ////

	for (var i = 0; i < imageList.length; i++) {
		////
		beginLoadingImage(imageList[i].varName, imageList[i].theFile); ////
	} ////
}
