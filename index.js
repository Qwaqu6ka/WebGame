let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;


class Hero {
	constructor(hp){
		this.hp = hp;
	}
}
let hero = new Hero(3);

let heroImg = document.getElementById("hero");

ctx.drawImage(heroImg, 10, 10)
setInterval(draw, 5);