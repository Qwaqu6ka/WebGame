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
class Shot {
	constructor(x, y, char) {
		this.x = x;
		this.y = y;
		this.char = char;	// "h" - hero // "e" - enemy // "b" - boss
	}	// "char" means character
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
let heroShotTimeout = heroRateOfFire;
const Shots = [];
const ShotsImg = [];

const heroImg = new Image();
const hengineImg = new Image();
heroImg.addEventListener("load", function() {
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);
	ctx.drawImage(hengineImg, hero.x - hengineSize, hero.y + hengineSize, hengineSize, hengineSize);
}, false);
heroImg.src = "src/hero.png";
hengineImg.src = "src/hero_engine.png";



//---------------------------------УПРАВЛЕНИЕ--------------------------------------
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

//------------------------------------СПАВН ПРОТИВНИКОВ--------------------------------------
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
class Enemy {
	constructor(hp, x, y) {
		this.hp = hp;
		this.x = x;
		this.y = y;
	}
}
const enemyWid = 130;
const enemyHei = 80;
const enemyEngWid = 60;
const enemyEngHei = 60;
const enemySpawnTime = 200;
let enemySpawnTimeout = enemySpawnTime;
const enemy = [];
const enemyImg = [];
const enemyEngineImg = [];

function spawnEnemy() {
	enemy.push(new Enemy(2, canvas.width / 2, getRandomInt(canvas.height - enemyHei))); //! поменять спавн после теста
	enemyImg.push(new Image());
	enemyEngineImg.push(new Image());
	enemyEngineImg[enemyEngineImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(enemyImg[enemyImg.length - 1], enemy[enemy.length - 1].x, enemy[enemy.length - 1].y, enemyWid, enemyHei);
		ctx.drawImage(enemyEngineImg[enemyEngineImg.length - 1], enemy[enemy.length - 1].x + 113 + engineMover, enemy[enemy.length - 1].y + 10, enemyEngWid, enemyEngHei);
		}, false);
	enemyImg[enemyImg.length - 1].src = "src/enemy1.png";
	enemyEngineImg[enemyEngineImg.length - 1].src = "src/enemy1_engine.png";
}

//---------------------------------СТРЕЛЬБА ГЕРОЯ------------------------------------------
function herosShoot() {
	Shots.push(new Shot(hero.x + 75, hero.y + 25, "h"));
	Shots.push(new Shot(hero.x + 75, hero.y + 85, "h"));
	ShotsImg.push(new Image());
	ShotsImg.push(new Image());
	ShotsImg[ShotsImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(ShotsImg[ShotsImg.length - 2], hero.x + 75, hero.y + 25, HeroShotWid, HeroShotLen);
		ctx.drawImage(ShotsImg[ShotsImg.length - 1], hero.x + 75, hero.y + 85, HeroShotWid, HeroShotLen);
		}, false);
	ShotsImg[ShotsImg.length - 2].src = "src/hero_shot.png";
	ShotsImg[ShotsImg.length - 1].src = "src/hero_shot.png";
}

//------------------------------------ГЛАВНЫЙ ЦИКЛ-----------------------------------------
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);
	ctx.drawImage(hengineImg, hero.x - 40, hero.y + 38 + engineMover, 40, 40);
	for (let i = 0; i < enemy.length; ++i) {
		ctx.drawImage(enemyImg[i], enemy[i].x, enemy[i].y, enemyWid, enemyHei);
		ctx.drawImage(enemyEngineImg[i], enemy[i].x + 113 + engineMover, enemy[i].y + 10, enemyEngWid, enemyEngHei);
	}
	engineMover = - engineMover;
	for (let i = 0; i < ShotsImg.length; ++i) {
		ctx.drawImage(ShotsImg[i], Shots[i].x, Shots[i].y, HeroShotWid, HeroShotLen);
	}
	
	
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
		if (heroShotTimeout >= heroRateOfFire) {
			heroShotTimeout = 0;
			herosShoot();
		}
	}	
	// ++enemySpawnTimeout;
	if (enemySpawnTimeout == enemySpawnTime) {
		enemySpawnTimeout = 0;
		spawnEnemy();
	}

	for (let i = 0; i < Shots.length; ++i) {
		if (Shots[i].char == "h")
			Shots[i].x += heroShotSpeed;
	}
}
setInterval(draw, 10);