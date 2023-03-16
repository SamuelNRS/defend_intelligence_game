class Brain {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 5;
		this.image = new Image();
		this.image.src = "brain.png";
	}

	moveTo(x, y) {
		let dx = x - this.x;
		let dy = y - this.y;
		let distance = Math.sqrt(dx*dx + dy*dy);
		let ratio = this.speed / distance;
		this.x += dx * ratio;
		this.y += dy * ratio;
	}

	draw(context) {
		context.drawImage(this.image, this.x, this.y, 50, 50);
	}
}

class Robot {
	constructor() {
		this.x = Math.random() * 700 + 50;
		this.y = Math.random() * 500 + 50;
		this.radius = 30;
		this.speed = Math.random() * 2 + 1;
		this.direction = Math.random() * 2 * Math.PI;
		this.color = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
	}

	move() {
		this.x += Math.cos(this.direction) * this.speed;
		this.y += Math.sin(this.direction) * this.speed;
		if (this.x - this.radius < 0 || this.x + this.radius > 		800) {
			this.direction = Math.PI - this.direction;
		}
		if (this.y - this.radius < 0 || this.y + this.radius > 600) {
			this.direction = -this.direction;
		}
	}

	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
	}

	collideWith(brain) {
		let dx = brain.x - this.x;
		let dy = brain.y - this.y;
		let distance = Math.sqrt(dx*dx + dy*dy);
		return distance < this.radius;
	}
}

class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.brains = [];
		this.robots = [];
		this.score = 0;
		this.gameOver = false;
		this.createRobots();
		this.update();
        
	}

	createRobots() {
		for (let i = 0; i < 10; i++) {
			let robot = new Robot();
			this.robots.push(robot);
		}
	}

	throwBrain(x, y) {
        if (this.gameOver) {
            return;
        }
    
        let brain = new Brain(x, y);
        this.brains.push(brain);
    }

	checkCollisions() {
		for (let i = 0; i < this.brains.length; i++) {
			let brain = this.brains[i];
			for (let j = 0; j < this.robots.length; j++) {
				let robot = this.robots[j];
				let dx = brain.x - robot.x;
				let dy = brain.y - robot.y;
				let distance = Math.sqrt(dx*dx + dy*dy);
				if (distance < robot.radius) {
					this.score += 10;
					this.brains.splice(i, 1);
					this.robots.splice(j, 1);
					break;
				}
			}
		}
	}

	update() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.checkCollisions();

		for (let i = 0; i < this.brains.length; i++) {
			let brain = this.brains[i];
			brain.moveTo(400, 50);
			brain.draw(this.context);
		}

		for (let i = 0; i < this.robots.length; i++) {
			let robot = this.robots[i];
			robot.move();
			this.drawRobot(robot);
		}

		this.drawScore();

		if (!this.gameOver) {
			requestAnimationFrame(() => this.update());
		} else {
			this.drawGameOver();
		}
	}

	drawRobot(robot) {
		this.context.fillStyle = robot.color;
		this.context.beginPath();
		this.context.arc(robot.x, robot.y, robot.radius, 0, 2*Math.PI);
		this.context.fill();
	}

	drawScore() {
		this.context.font = "36px sans-serif";
		this.context.fillStyle = "white";
		this.context.fillText(`Score: ${this.score}`, 10, 50);
	}

	drawGameOver() {
		this.context.font = "48px sans-serif";
		this.context.fillStyle = "white";
		this.context.fillText("Game Over", this.width/2 - 150, this.height/2 - 24);
	}

	restart() {
		this.brains = [];
		this.robots = [];
		this.score = 0;
		this.gameOver = false;
		this.createRobots();
		this.update();
	}
}

