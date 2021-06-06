let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

class Shot {
	constructor(x, y, char) {
		this.x = x;
		this.y = y;
		this.char = char;	// "h" - hero // "e" - enemy // "b" - boss
	}	// "char" means character
}


//-----------------------------------ПАРАМЕТРЫ ГЕРОЯ-------------------------------------------
class Hero {
	constructor(hp) {
		this.hp = hp;
		this.x = 100;
		this.y = canvas.height / 2;
	}
}

const hero = new Hero(3);
const heroSize = 120;
const hengineSize = 40;
const heroSpeed = 6;
let engineMover = 1;
const heroShotHei = 10;
const heroShotWid = 20;
const heroShotSpeed = 10;
const heroRateOfFire = 30;
let heroShotTimeout = heroRateOfFire;
const shots = [];
const shotsImg = [];

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
	constructor(hp, x, y, dy) {
		this.hp = hp;
		this.x = x;
		this.y = y;
		this.dy = dy;
		this.shoot = 0;
	}
}
const enemyRateOfFire = 30;
const dxEnemy = -1;
const dyEnemy = -2;
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
	let dir;	// начальное направление врагов(вверх или вниз)
	getRandomInt(4) < 2 ? dir = dyEnemy : dir = - dyEnemy;	// равновероятный шанс
	enemy.push(new Enemy(3, canvas.width, getRandomInt(canvas.height - enemyHei), dir)); //! поменять спавн посел теста
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
	shots.push(new Shot(hero.x + 75, hero.y + 25, "h"));
	shots.push(new Shot(hero.x + 75, hero.y + 85, "h"));
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg[shotsImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(shotsImg[shotsImg.length - 2], hero.x + 75, hero.y + 25, heroShotWid, heroShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 1], hero.x + 75, hero.y + 85, heroShotWid, heroShotHei);
		}, false);
	shotsImg[shotsImg.length - 2].src = "src/hero_shot.png";
	shotsImg[shotsImg.length - 1].src = "src/hero_shot.png";
}


//----------------------------------АНИМАЦИЯ СМЕРТИ---------------------------------------
class DeathPlace {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.stage = 0;
	}
}
const deathTimeout = 10;
let deathTimer = deathTimeout;
const deathPlace = [];
const deathPlaceImg = [];
function enemyDeath(i) {	// добавление взрыва и удаление корабля
	// добавление взрыва
	deathPlace.push(new DeathPlace(enemy[i].x + enemyWid / 2 - enemyHei / 2, enemy[i].y, enemyHei)); 
	deathPlaceImg.push(new Image());
	deathPlaceImg[deathPlaceImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(deathPlaceImg[deathPlaceImg.length - 1], deathPlace[deathPlace.length - 1].x, deathPlace[deathPlace.length - 1].y, 
		deathPlace[deathPlace.length - 1].size, deathPlace[deathPlace.length - 1].size);
	}, false);
	deathPlaceImg[deathPlaceImg.length - 1].src = `src/explosion${deathPlace[deathPlace.length - 1].stage}.png`;
	// удаление корабля
	enemy.splice(i, 1);
	enemyImg.splice(i, 1);
	enemyEngineImg.splice(i, 1);
}


//------------------------------------ГЛАВНЫЙ ЦИКЛ-----------------------------------------
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// отчистка холст
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);  // отрисовка героя
	ctx.drawImage(hengineImg, hero.x - 40, hero.y + 38 + engineMover, 40, 40);	// отрисовка двигателя героя
	for (let i = 0; i < enemy.length; ++i) {	// отрисовка противников и их двигателей
		ctx.drawImage(enemyImg[i], enemy[i].x, enemy[i].y, enemyWid, enemyHei);
		ctx.drawImage(enemyEngineImg[i], enemy[i].x + 113 + engineMover, enemy[i].y + 10, enemyEngWid, enemyEngHei);
	}
	engineMover = -engineMover;	// движение огня у кораблей
	for (let i = 0; i < shotsImg.length; ++i) {		// отрисовка всех снарядов
		ctx.drawImage(shotsImg[i], shots[i].x, shots[i].y, heroShotWid, heroShotHei);
	}
	++deathTimer;
	for (let i = 0; i < deathPlaceImg.length; ++i) { 	// отрисовка анимации взрыва
		if (deathTimer >= deathTimeout) {
			deathTimer = 0;
			if (++deathPlace[i].stage > 6) {	// если была показана последняя анимация - удаляем взрыв
				deathPlace.splice(i, 1);;
				deathPlaceImg.splice(i, 1);
				--i;
				continue;
			}
			deathPlaceImg[i].src = `src/explosion${deathPlace[i].stage}.png`;
		}
		ctx.drawImage(deathPlaceImg[deathPlaceImg.length - 1], deathPlace[deathPlace.length - 1].x, deathPlace[deathPlace.length - 1].y, 
		deathPlace[deathPlace.length - 1].size, deathPlace[deathPlace.length - 1].size);
	}
	
	// обработка движения героя
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

	//	обработка стрельбы героя
	if (shoot) {
		++heroShotTimeout;
		if (heroShotTimeout >= heroRateOfFire) {
			heroShotTimeout = 0;
			herosShoot();
		}
	}	

	// движение врагов
	for (let i = 0; i < enemy.length; ++i) {
		enemy[i].x += dxEnemy;
		if (enemy[i].y + enemy[i].dy < 0 || enemy[i].y + enemy[i].dy > canvas.height - enemyHei)
			enemy[i].dy = -enemy[i].dy;
		enemy[i].y += enemy[i].dy;
		// проверка на столкновение
		if ((hero.x + heroSize < enemy[i].x + enemyWid && hero.x + heroSize > enemy[i].x || hero.x < enemy[i].x + enemyWid && hero.x > enemy[i].x) 
		&& (hero.y > enemy[i].y && hero.y < enemy[i].y + enemyHei || hero.y + heroSize > enemy[i].y && hero.y + heroSize < enemy[i].y + enemyHei)) 
		{
			enemyDeath(i);
			if (hero.hp != -1 && --hero.hp == 0)
				console.log("умер");	
		}
	}	

	// обработка спавна врагов
	// ++enemySpawnTimeout;		// 1) вариант с определённым временем спавна
	// if (enemySpawnTimeout >= enemySpawnTime) {
	if (getRandomInt(200) < 1) {	// 2) вариант с раномом
		enemySpawnTimeout = 0;
		spawnEnemy();
	}
	// обработка движения и столкновения снарядов
	for (let i = 0; i < shots.length; ++i) {
		if (shots[i].char == "h") {
			shots[i].x += heroShotSpeed;	// движение
			for (let j = 0; j < enemy.length; ++j) { 	// столкновение
				if (shots[i].x + heroShotWid * 3 / 4 >= enemy[j].x && shots[i].x + heroShotWid * 3 / 4 <= enemy[j].x + enemyWid &&
					shots[i].y + heroShotHei / 2 >= enemy[j].y && shots[i].y + heroShotHei / 2 <= enemy[j].y + enemyHei) {
					shots.splice(i, 1);		// удаление снаряда
					shotsImg.splice(i, 1);	//? декремент i ?
					if (--enemy[j].hp == 0) 	// проверка здоровья
						enemyDeath(j);
					// else			// TODO: сделать функцию попадания
					// 	hit();
				}
			}
		}
	}
}
setInterval(draw, 10);