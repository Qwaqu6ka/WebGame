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

const hero = new Hero(3);
const heroSize = 120;
const hengineSize = 40;
const heroSpeed = 6;
let engineMover = 1;

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
	if (shoot)
		console.log("shoot");
}

setInterval(draw, 10);