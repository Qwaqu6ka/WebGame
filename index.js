let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let pause = true;
let control = undefined;
let difficulty = undefined;

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;

class Shot {
	constructor(x, y, char) {
		this.x = x;
		this.y = y;
		this.char = char;	// "h" - hero // "e" - enemy // "b" - boss
	}	// "char" means character
}

let bestScore = 0;
let score = 0;
function scoreDraw() {
	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(`Score: ${score}`, canvas.width / 2, 40);
	ctx.fillText(`Press q to quit`, canvas.width / 3 * 2, 40);
}

const background = new Image();
background.addEventListener("load", function() {
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	}, false);
background.src = "src/background.jpg";

function cleanArrays() {
	shots.splice(0, shots.length);
	shotsImg.splice(0, shotsImg.length);
	enemy.splice(0, enemy.length);
	enemyImg.splice(0, enemyImg.length);
	enemyEngineImg.splice(0, enemyEngineImg.length);
	heartImg.splice(0, heartImg.length);
}

function startGame() {
	pause = false;
	setHealth();
	spawnSeed = mySpawnSeed;
	score = 0;
}

function endGame() {
	cleanArrays();
	pause = true;
	control = undefined;
	difficulty = undefined;
	spawnSeed = 0;
	if (score > bestScore)
		bestScore = score;
}

//-----------------------------------ПАРАМЕТРЫ ГЕРОЯ-------------------------------------------
class Hero {
	constructor(hp) {
		this.hp = hp;
		this.x = 100;
		this.y = canvas.height / 2;
	}
}

let hero = new Hero(3);
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

function heroDraw() {
	ctx.drawImage(heroImg, hero.x, hero.y, heroSize, heroSize);  // отрисовка героя
	ctx.drawImage(hengineImg, hero.x - 40, hero.y + 38 + engineMover, 40, 40);	// отрисовка двигателя героя
}

//---------------------------------УПРАВЛЕНИЕ--------------------------------------
let upPressed = false;
let rightPressed = false;
let downPressed = false;
let leftPressed = false;
let shoot = false;
let c_key = false;
let g_key = false;
let k_key = false;
let m_key = false;
let q_key = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) 	
        rightPressed = true;
    else if(e.keyCode == 37)
        leftPressed = true;
	if (e.keyCode == 38)
		upPressed = true;
	else if (e.keyCode == 40)
		downPressed = true;
	if(e.keyCode == 32) 	
        shoot = true;
	if(e.keyCode == 67) 	
        c_key = true;
	if(e.keyCode == 71) 	
        g_key = true;
	if(e.keyCode == 75) 	
        k_key = true;
	if(e.keyCode == 77) 	
        m_key = true;
	if(e.keyCode == 81) 	
        q_key = true;
}

function keyUpHandler(e) {
    if (e.keyCode == 39)
        rightPressed = false;
    else if (e.keyCode == 37)
        leftPressed = false;
	if (e.keyCode == 38)
        upPressed = false;
    else if (e.keyCode == 40)
        downPressed = false;
	if(e.keyCode == 32) 	
        shoot = false;
	if(e.keyCode == 67) 	
        c_key = false;
	if(e.keyCode == 71) 	
        g_key = false;
	if(e.keyCode == 75) 	
        k_key = false;
	if(e.keyCode == 77) 	
        m_key = false;
	if(e.keyCode == 81) 	
        q_key = false;
}

//------------------------------------СПАВН ПРОТИВНИКОВ--------------------------------------
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}
class Enemy {
	constructor(hp, x, y, dy, char) {
		this.hp = hp;
		this.x = x;
		this.y = y;
		this.dx = dxBoss;
		this.dy = dy;
		this.char = char; 	// "e" - enemy, "b" - boss
		this.shootTimer = 0;
	}
}
const enemyShotWid = 20;	// параметры рядовых противников
const enemyShotHei = 10;
const enemyRateOfFire = 200;
const enemyShotSpeed = -3;
const dxEnemy = -2;
const dyEnemy = -2;
const enemyWid = 130;
const enemyHei = 80;
const enemyEngWid = 60;
const enemyEngHei = 60;
let spawnSeed = 0;
const mySpawnSeed = 150;

const bossWid = 500;	// параметры босса
const bossHei = 500;
const bossEngWid = 80;
const bossEngHei = 30;
const bossShotHei = 20;
const bossShotWid = 40;
const bossShotSpeed = -4;
const bossRateOfFire = 250;
const dxBoss = -1;
const dyBoss = -1;
let bossAlive = false;

const enemy = [];
const enemyImg = [];
const enemyEngineImg = [];

function spawnEnemy(char = "e") {
	let dir;	// начальное направление врагов(вверх или вниз)
	getRandomInt(4) < 2 ? dir = dyEnemy : dir = - dyEnemy;	// равновероятный шанс
	if (char == "e") {
		enemy.push(new Enemy(3, canvas.width, getRandomInt(canvas.height - enemyHei), dir, char)); 
		enemyImg.push(new Image());
		enemyEngineImg.push(new Image());
		enemyEngineImg[enemyEngineImg.length - 1].addEventListener("load", function() {
			ctx.drawImage(enemyImg[enemyImg.length - 1], enemy[enemy.length - 1].x, enemy[enemy.length - 1].y, enemyWid, enemyHei);
			ctx.drawImage(enemyEngineImg[enemyEngineImg.length - 1], enemy[enemy.length - 1].x + 113 + engineMover, enemy[enemy.length - 1].y + 10, enemyEngWid, enemyEngHei);
			}, false);
		enemyImg[enemyImg.length - 1].src = "src/enemy1.png";
		enemyEngineImg[enemyEngineImg.length - 1].src = "src/enemy1_engine.png";
	}
	else {
		enemy.push(new Enemy(75, canvas.width, getRandomInt(canvas.height - bossHei), dir, char));
		enemyImg.push(new Image());
		enemyEngineImg.push(new Image());
		enemyEngineImg[enemyEngineImg.length - 1].addEventListener("load", function() {
			ctx.drawImage(enemyImg[enemyImg.length - 1], enemy[enemy.length - 1].x, enemy[enemy.length - 1].y, bossWid, bossHei);
			ctx.drawImage(enemyEngineImg[enemyEngineImg.length - 1], enemy[enemy.length - 1].x + 460 + engineMover, enemy[enemy.length - 1].y + 235 + engineMover, bossEngWid, bossEngHei);
			}, false);
		enemyImg[enemyImg.length - 1].src = "src/boss.png";
		enemyEngineImg[enemyEngineImg.length - 1].src = "src/boss_engine.png";
	}
}

function enemyDraw() {
	for (let i = 0; i < enemy.length; ++i) {	// отрисовка противников и их двигателей
		if (enemy[i].char == "e") {
			ctx.drawImage(enemyImg[i], enemy[i].x, enemy[i].y, enemyWid, enemyHei);
			ctx.drawImage(enemyEngineImg[i], enemy[i].x + 113 + engineMover, enemy[i].y + 10, enemyEngWid, enemyEngHei);
		}
		else {
			ctx.drawImage(enemyImg[i], enemy[i].x, enemy[i].y, bossWid, bossHei);
			ctx.drawImage(enemyEngineImg[i], enemy[i].x + 460 + engineMover, enemy[i].y + 235 + engineMover, bossEngWid, bossEngHei);
		}
	}
}

//-------------------------------------------СТРЕЛЬБА ГЕРОЯ-------------------------------------------------
function herosShoot() {
	shots.push(new Shot(hero.x + 75, hero.y + 25, "h"));
	shots.push(new Shot(hero.x + 75, hero.y + 85, "h"));
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg[shotsImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(shotsImg[shotsImg.length - 2], shots[shots.length - 2].x, shots[shots.length - 2].y, heroShotWid, heroShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 1], shots[shots.length - 1].x, shots[shots.length - 1].y, heroShotWid, heroShotHei);
		}, false);
	shotsImg[shotsImg.length - 2].src = "src/hero_shot.png";
	shotsImg[shotsImg.length - 1].src = "src/hero_shot.png";
}

function shotsDraw() {
	for (let i = 0; i < shotsImg.length; ++i) {		// отрисовка всех снарядов
		if (shots[i].char == "h")
			ctx.drawImage(shotsImg[i], shots[i].x, shots[i].y, heroShotWid, heroShotHei);
		else if (shots[i].char == "e")
			ctx.drawImage(shotsImg[i], shots[i].x, shots[i].y, enemyShotWid, enemyShotHei);
		else 
			ctx.drawImage(shotsImg[i], shots[i].x, shots[i].y, bossShotWid, bossShotHei);
	}
}

//-----------------------------------------СТРЕЛЬБА ВРАГОВ--------------------------------------------
function enemyShoots(i) {
	shots.push(new Shot(enemy[i].x + 15, enemy[i].y + 8, "e"));
	shots.push(new Shot(enemy[i].x + 15, enemy[i].y + 61, "e"));
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg[shotsImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(shotsImg[shotsImg.length - 2], shots[shots.length - 2].x, shots[shots.length - 2].y, enemyShotWid, enemyShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 1], shots[shots.length - 1].x, shots[shots.length - 1].y, enemyShotWid, enemyShotHei);
		}, false);
	shotsImg[shotsImg.length - 2].src = "src/enemy_shot.png";
	shotsImg[shotsImg.length - 1].src = "src/enemy_shot.png";
}

function bossShoots(i) {
	shots.push(new Shot(enemy[i].x + 110, enemy[i].y + 83, "b"));
	shots.push(new Shot(enemy[i].x + 65, enemy[i].y + 160, "b"));
	shots.push(new Shot(enemy[i].x + 65, enemy[i].y + 320, "b"));
	shots.push(new Shot(enemy[i].x + 110, enemy[i].y + 397, "b"));
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg.push(new Image());
	shotsImg[shotsImg.length - 1].addEventListener("load", function() {
		ctx.drawImage(shotsImg[shotsImg.length - 4], shots[shots.length - 4].x, shots[shots.length - 4].y, bossShotWid, bossShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 3], shots[shots.length - 3].x, shots[shots.length - 3].y, bossShotWid, bossShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 2], shots[shots.length - 2].x, shots[shots.length - 2].y, bossShotWid, bossShotHei);
		ctx.drawImage(shotsImg[shotsImg.length - 1], shots[shots.length - 1].x, shots[shots.length - 1].y, bossShotWid, bossShotHei);
		}, false);
	shotsImg[shotsImg.length - 4].src = "src/boss_shot.png";
	shotsImg[shotsImg.length - 3].src = "src/boss_shot.png";
	shotsImg[shotsImg.length - 2].src = "src/boss_shot.png";
	shotsImg[shotsImg.length - 1].src = "src/boss_shot.png";
}



//------------------------------------------АНИМАЦИЯ СМЕРТИ-----------------------------------------------
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
	if (enemy[i].char == "e")
		deathPlace.push(new DeathPlace(enemy[i].x + enemyWid / 2 - enemyHei / 2, enemy[i].y, enemyHei));
	else 
		deathPlace.push(new DeathPlace(enemy[i].x + bossWid / 2 - enemyHei / 2, enemy[i].y, bossHei));
		 
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

function explosionDraw() {
	for (let i = 0; i < deathPlaceImg.length; ++i) { 	
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
}

//--------------------------------------ЗДОРОВЬЕ-------------------------------------------
const heartStepX = 50;
const heartY = 20;
const heartHei = 35;
const heartWid = 40;
let immortalTimer = 0;
const immortalTimeout = 300;
const heartX = [hero.hp];
const heartImg = [];

function setHealth() {
	for (let i = 0; i < hero.hp; ++i) {
		if (i == 0) {
			heartX[i] = 20;
			continue;
		}
		heartX[i] = heartX[i - 1] + heartStepX;
	}
	for (let i = 0; i < hero.hp; ++i) {
		heartImg.push(new Image());
		heartImg[heartImg.length - 1].addEventListener("load", function() {
			ctx.drawImage(heartImg[heartImg.length - 1], heartX[i], heartY, heartWid, heartHei);
			}, false);
		heartImg[heartImg.length - 1].src = "src/hp.png";
	}
}

function healthDraw() {
	if (hero.hp == -1) {
		ctx.font = "30px Comic Sans MS";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText("god", 50, 40);
	}
	else {
		for (let i = 0; i < hero.hp; ++i) {
			ctx.drawImage(heartImg[i], heartX[i], heartY, heartWid, heartHei);
		}
	}
}

//-----------------------------------ДВИЖЕНИЕ И СТРЕЛЬБА ВРАГОВ--------------------------------------

function enemyMovement(i) {
	enemy[i].x += dxEnemy;	// движение
	if (enemy[i].y + enemy[i].dy < 0 || enemy[i].y + enemy[i].dy > canvas.height - enemyHei)
		enemy[i].dy = -enemy[i].dy;
	enemy[i].y += enemy[i].dy;
	// проверка на столкновение
	if ((hero.x + heroSize < enemy[i].x + enemyWid && hero.x + heroSize > enemy[i].x || hero.x < enemy[i].x + enemyWid && hero.x > enemy[i].x) 
	&& (hero.y > enemy[i].y && hero.y < enemy[i].y + enemyHei || hero.y + heroSize > enemy[i].y && hero.y + heroSize < enemy[i].y + enemyHei)) 
	{
		if (hero.hp == -1) {
			enemyDeath(i);
			score += 5;
		}
		else {
			if (immortalTimer > immortalTimeout) {		// чек на временное бессмертие
				immortalTimer = 0;
				enemyDeath(i);
				score += 5;
				if (hero.hp != -1 && --hero.hp == 0)
					endGame();
			}
		}
	}
	else if (++enemy[i].shootTimer >= enemyRateOfFire) {	// если не столкнулись то стреляет
		enemy[i].shootTimer = 0;
		enemyShoots(i);
	}
}

function bossMovement(i) {
	if (enemy[i].x  <= canvas.width - bossWid - bossEngWid)
		enemy[i].dx = 0;
	if (enemy[i].y + enemy[i].dy < 0 || enemy[i].y + enemy[i].dy > canvas.height - bossHei)
		enemy[i].dy = -enemy[i].dy;
	enemy[i].x += enemy[i].dx;
	enemy[i].y += enemy[i].dy;
	// проверка на столкновение
	if ((hero.x + heroSize < enemy[i].x + bossWid && hero.x + heroSize > enemy[i].x || hero.x < enemy[i].x + bossWid && hero.x > enemy[i].x) 
	&& (hero.y > enemy[i].y && hero.y < enemy[i].y + bossHei || hero.y + heroSize > enemy[i].y && hero.y + heroSize < enemy[i].y + bossHei)) 
	{
		if (hero.hp == -1) {
			enemyDeath(i);
			score += 15;
			bossAlive = false;
		}
		else {
			if (immortalTimer > immortalTimeout) {		// чек на временное бессмертие
				immortalTimer = 0;
				enemyDeath(i);
				score += 15;
				bossAlive = false;
				if (hero.hp != -1 && --hero.hp == 0)
					endGame();
			}
		}
	}
	else if (++enemy[i].shootTimer >= bossRateOfFire) {		// если не столкнулись то стреляет
		enemy[i].shootTimer = 0;
		bossShoots(i);
	}
}

//-------------------------------------ОБРАБОТКА ДВИЖЕНИЯ И СТОЛКНОВЕНИЯ СНАРЯДОВ------------------------------------------------
function shotsProcessing() {
	for (let i = 0; i < shots.length; ++i) {
		if (shots[i].char == "h") {
			shots[i].x += heroShotSpeed;	// движение
			for (let j = 0; j < enemy.length; ++j) { 	// столкновение
				if (enemy[j].char == "e") {	
					if (shots[i].x + heroShotWid * 3 / 4 >= enemy[j].x && shots[i].x + heroShotWid * 3 / 4 <= enemy[j].x + enemyWid &&
						shots[i].y + heroShotHei / 2 >= enemy[j].y && shots[i].y + heroShotHei / 2 <= enemy[j].y + enemyHei) {
						shots.splice(i, 1);		// удаление снаряда
						shotsImg.splice(i, 1);
						if (--enemy[j].hp == 0) {	// проверка здоровья
							enemyDeath(j);
							score += 5;
						}
						// else			
						// 	hit();
					}
				}
				else {
					if (shots[i].x + heroShotWid * 3 / 4 >= enemy[j].x + bossWid/ 5 && shots[i].x + heroShotWid * 3 / 4 <= enemy[j].x + bossWid &&
					shots[i].y + heroShotHei / 2 >= enemy[j].y && shots[i].y + heroShotHei / 2 <= enemy[j].y + bossHei) {
						shots.splice(i, 1);		// удаление снаряда
						shotsImg.splice(i, 1);
						if (--enemy[j].hp == 0) {	// проверка здоровья
							enemyDeath(j);
							score += 15;
							bossAlive = false;
						}
					}
				}
			}
		}
		else if (shots[i].char == "e") {
			shots[i].x += enemyShotSpeed;	// движение
			if (shots[i].x + enemyShotWid / 2 >= hero.x && shots[i].x + enemyShotWid / 2 <= hero.x + heroSize &&
			shots[i].y + enemyShotHei / 2 >= hero.y && shots[i].y + enemyShotHei / 2 <= hero.y + heroSize) {	// столкновение
				if (immortalTimer > immortalTimeout) {	// чек на временное бессмертие
					immortalTimer = 0;
					shots.splice(i, 1);		// удаление снаряда
					shotsImg.splice(i, 1);
					if (hero.hp != -1 && --hero.hp == 0)
						endGame();
				}
			}
		}
		else {
			shots[i].x += bossShotSpeed;	// движение
			if (shots[i].x + enemyShotWid / 2 >= hero.x && shots[i].x + enemyShotWid / 2 <= hero.x + heroSize &&
			shots[i].y + enemyShotHei / 2 >= hero.y && shots[i].y + enemyShotHei / 2 <= hero.y + heroSize) {	// столкновение
				if (immortalTimer > immortalTimeout) {	// чек на временное бессмертие
					immortalTimer = 0;
					shots.splice(i, 1);		// удаление снаряда
					shotsImg.splice(i, 1);
					if (hero.hp != -1 && --hero.hp == 0)
						endGame();
				}
			}
		}
	}	
}

//------------------------------------ГЛАВНЫЙ ЦИКЛ-----------------------------------------
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	// отчистка холста
	if (pause) {
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.font = "50px Comic Sans MS";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(`Score: ${score}`, canvas.width / 3, canvas.height / 4);
		ctx.fillText(`Best score: ${bestScore}`, canvas.width / 3 * 2, canvas.height / 4);
		if (control == undefined || difficulty == undefined) {
			if (difficulty == undefined) {
				ctx.fillText(`Choose difficulty: (Push C or G)`, canvas.width / 2, canvas.height / 4 * 2);
				ctx.fillText(`С - common   G - god mode`, canvas.width / 2, canvas.height / 4 * 3);
				if (c_key) {
					difficulty = "common";
					hero = new Hero(3);
				}
				if (g_key) {
					difficulty = "god";
					hero = new Hero(-1);
				}
			}
			else {
				ctx.fillText(`Choose control: (Push K or M)`, canvas.width / 2, canvas.height / 4 * 2);
				ctx.fillText(`K - arrow keys and space   M - mouse and LBM`, canvas.width / 2, canvas.height / 4 * 3);
				if (k_key) 
					control = "keyboard";
				if (m_key) 
					control = "mouse";
			}
		}
		else
			startGame();
	}
	else {
		heroDraw();		// отрисовка героя
		enemyDraw();	// отрисовка противников
		engineMover = -engineMover;	// движение огня у кораблей
		scoreDraw();	// отрисовка очков
		++immortalTimer;
		healthDraw();	// отрисовка здоровья
		shotsDraw();	// отрисовка всех снарядов
		++deathTimer;
		explosionDraw();	// отрисовка анимации взрыва
		
		// обработка движения героя
		if (upPressed && hero.y > 0) 
			hero.y -= heroSpeed;
		if (leftPressed && hero.x > hengineSize) 
			hero.x -= heroSpeed;
		if (downPressed && hero.y < canvas.height - heroSize)
			hero.y += heroSpeed;
		if (rightPressed && hero.x < canvas.width - heroSize) 
			hero.x += heroSpeed;

		//	обработка стрельбы героя
		if (shoot) {
			++heroShotTimeout;
			if (heroShotTimeout >= heroRateOfFire) {
				heroShotTimeout = 0;
				herosShoot();
			}
		}	
		// движение и стрельба врагов
		for (let i = 0; i < enemy.length; ++i) {
			if (enemy[i].char == "b") 
				bossMovement(i);
			else 
				enemyMovement(i);
		}	
		// обработка спавна врагов
		if (getRandomInt(spawnSeed) < 1) 
			spawnEnemy();

		if (!bossAlive && score % 100 == 0 && score != 0) { 	//TODO: поменять спавн
			bossAlive = true;
			spawnEnemy("b");
		}
		shotsProcessing();	// обработка движения и столкновения снарядов
		if (q_key)
			endGame();
	}
}
setInterval(draw, 10);