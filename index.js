let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

class Hero {
	constructor(hp) {
		this.hp = hp;
		this.x = 100;
		this.y = canvas.height / 2;
	}
}
class HeroShot {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

const hero = new Hero(3);
const heroSize = 120;
const hengineSize = 40;
const heroSpeed = 6;
let engineMover = 1;
const HeroShotLen = 10;
const HeroShotWid = 20;
const heroShotSpeed = 10;
const heroRateOfFire = 30;
let heroShotTimeout = 0;
let heroShots = [];
let heroShotsImg = [];

const heroImg = new Image();
const hengineImg = new Image();
// let enemy1Img = new Image();
// let enemy1_engine = new Image();
heroImg.addEventListener("load", function() {
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);
	ctx.drawImage(hengineImg, hero.x - hengineSize, hero.y + hengineSize, hengineSize, hengineSize);
}, false);
heroImg.src = "src/hero.png";
hengineImg.src = "src/hero_engine.png";



//-------------------------------УПРАВЛЕНИЕ--------------------------------------

let upPressed = false;
let rightPressed = false;
let downPressed = false;
let leftPressed = false;
let shoot = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) { 	
        rightPressed = true;
	}
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
	if (e.keyCode == 38) {
		upPressed = true;
	}
	else if (e.keyCode == 40) {
		downPressed = true;
	}
	if(e.keyCode == 32) { 	
        shoot = true;
	}
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
	if (e.keyCode == 38) {
        upPressed = false;
    }
    else if (e.keyCode == 40) {
        downPressed = false;
    }
	if(e.keyCode == 32) { 	
        shoot = false;
	}
}


//----------------------------------ГЛАВНЫЙ ЦИКЛ-----------------------------------------
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);
	ctx.drawImage(hengineImg, hero.x - 40, hero.y + 38 + engineMover, 40, 40);
	for (let i = 0; i < heroShotsImg.length; ++i) {
		ctx.drawImage(heroShotsImg[i], heroShots[i].x, heroShots[i].y, HeroShotWid, HeroShotLen);
	}
	engineMover = - engineMover;
	
	if (upPressed && hero.y > 0) {
		hero.y -= heroSpeed;
	}
	if (leftPressed && hero.x > hengineSize) {
		hero.x -= heroSpeed;
	}
	if (downPressed && hero.y < canvas.height - heroSize) {
		hero.y += heroSpeed;
	}
	if (rightPressed && hero.x < canvas.width - heroSize) {
		hero.x += heroSpeed;
	}
	if (shoot) {
		++heroShotTimeout;
		if (heroShotTimeout == heroRateOfFire) {
			heroShotTimeout = 0;
			heroShots.push(new HeroShot(hero.x + 75, hero.y + 25));
			heroShots.push(new HeroShot(hero.x + 75, hero.y + 85));
			heroShotsImg.push(new Image());
			heroShotsImg.push(new Image());
			heroShotsImg[heroShotsImg.length - 1].addEventListener("load", function() {
				ctx.drawImage(heroShotsImg[heroShotsImg.length - 2], hero.x + 75, hero.y + 25, HeroShotWid, HeroShotLen);
				ctx.drawImage(heroShotsImg[heroShotsImg.length - 1], hero.x + 75, hero.y + 85, HeroShotWid, HeroShotLen);
				}, false);
			heroShotsImg[heroShotsImg.length - 2].src = "src/hero_shot.png";
			heroShotsImg[heroShotsImg.length - 1].src = "src/hero_shot.png";
		}

	}
	for (let i = 0; i < heroShots.length; ++i) {
		heroShots[i].x += heroShotSpeed;
	}

}
setInterval(draw, 10);