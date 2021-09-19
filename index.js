const canvas = document.getElementById("game");
const context = canvas.getContext('2d');

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

if (!context) {
    alert("Please update your browser");
}

class AbstractPlayer {
    static height = 70;
    static width = 15;
    static stepSize = 12;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    draw() {
        context.fillStyle = 'chartreuse';
        context.fillRect(this.x, this.y, AbstractPlayer.width, AbstractPlayer.height);
    }

    moveUp() {
        context.clearRect(this.x, this.y, AbstractPlayer.width, AbstractPlayer.height);
        this.y = this.y - AbstractPlayer.stepSize > 0 ? this.y - AbstractPlayer.stepSize : this.y;
        this.draw(this.x, this.y);
    }

    moveDown() {
        context.clearRect(this.x, this.y, AbstractPlayer.width, AbstractPlayer.height);
        this.y = this.y + AbstractPlayer.height + AbstractPlayer.stepSize < canvasHeight ? this.y + AbstractPlayer.stepSize : this.y;
        this.draw(this.x, this.y);
    }

}

class Player extends AbstractPlayer {
    constructor() {
        super(10, canvasHeight / 2 - AbstractPlayer.height / 2);
        window.onkeydown = e => this.moveWithKey(e.keyCode);
        canvas.onmousemove = e => this.moveWithMouse(e);
    }

    moveWithMouse(evt) {
        if (evt.offsetY > this.y + AbstractPlayer.height) {
            super.moveDown();
        } else if (evt.offsetY < this.y) {
            super.moveUp();
        }
    }
    moveWithKey(keyCode) {
        switch (keyCode) {
            case 38: // arrow up
            case 90: // z
            case 87: // w
                super.moveUp();
                break;
            case 40: // arrow down
            case 83: // s
                super.moveDown();
                break;
        }
    }
}

class Enemy extends AbstractPlayer {
    constructor() {
        super(canvasWidth - AbstractPlayer.width - 10, canvasHeight / 2 - AbstractPlayer.height / 2);
    }
}

class Ball {
    constructor() {
        this.initialize()

        this.draw();
    }

    initialize() {
        this.height = canvasHeight / 2.0;
        this.width = canvasWidth / 2.0;
        this.angle = this.getRandomAngle();
        this.r = 15.0;
    }

    getRandomAngle() {
        return Math.random() * 90 - 45 + (Math.random() < 0.5 ? 180 : 0);
    }

    draw() {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.width, this.height, this.r, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }

    getHeigth() {
        return height;
    }

    getWidth() {
        return width;
    }

    // If ball touches left wall, return 0. If ball touches upper wall, return 1...
    // If ball touches player, return 4. If ball touches enemy, return 5.
    // If ball touches nothing, return -1

    getWall(player, enemy) {
        if (this.width <= this.r) {
            return 0;
        } else if (this.height <= this.r) {
            return 1;
        } else if (this.width >= canvasWidth - this.r) {
            return 2;
        } else if (this.height >= canvasHeight - this.r) {
            return 3;
        } else if (player.x + 15 >= this.width - this.r && player.y <= this.height && player.y + 70 >= this.height) {
            return 4;
        } else if (enemy.x <= this.width + this.r && enemy.y <= this.height && enemy.y + 70 >= this.height) {
            return 5;
        }
        return -1;
    }

    touchesVerticalWall(player, enemy) {
        return this.getWall(player, enemy) == 0 || this.getWall(player, enemy) == 2;
    }

    touchWall(player, enemy) {
        return [0, 1, 2, 3].includes(this.getWall(player, enemy));
    }

    touchPlayer(player, enemy) {
        return [4, 5].includes(this.getWall(player, enemy));
    }

    act(player, enemy, score) {
        if (this.getWall(player, enemy) != -1) {
            if (this.touchesVerticalWall(player, enemy)) {
                if (this.getWall(player, enemy) == 0) {
                    score.enemyScores();
                } else {
                    score.playerScores();
                }
                this.initialize();

            } else {
                this.bounce(player, enemy);
            }
        }
        context.clearRect(this.width - 22.21, this.height - 22.21, 60, 60);
        let radians = this.angle * Math.PI / 180.0;
        this.width += Math.cos(radians) * 1.5;
        this.height += Math.sin(radians) * 1.5;
        this.draw();
    }

    bounce(player, enemy) {
        let surfaceAngle = [90, 0, 90, 0, 90, 90];
        let wall = this.getWall(player, enemy);
        if (wall < 0 || wall > 5) {
            throw {
                name: "AssertionError",
                message: "invalid wall"
            };
        }
        let a = surfaceAngle[wall] * 2 - this.angle;
        this.angle = a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
    }

}


class Score {
    constructor() {
        this.playerScore = 0;
        this.enemyScore = 0;
        this.draw();
    }

    draw() {
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.font = "40px serif";
        context.fillText(`${this.playerScore} - ${this.enemyScore}`, canvasWidth / 2, 50);
    }

    playerScores() {
        this.playerScore += 1;
    }

    enemyScores() {
        this.enemyScore += 1;
    }
}


document.onload = startScreen();

function startScreenHandler() {
    canvas.classList.remove("blink");
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    begin();
}

function startScreen() {
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = "40px serif";
    context.fillText("Press any key to start the game", canvasWidth / 2, canvasHeight / 2);
    canvas.classList.add("blink");

    ["keydown", "mousedown"].forEach(evt => window.addEventListener(evt, startScreenHandler));
}


async function begin() {
    window.removeEventListener('keydown', startScreenHandler);
    window.removeEventListener('mousedown', startScreenHandler);

    const player = new Player();
    const ball = new Ball();
    const enemy = new Enemy();
    const score = new Score();
    const objects = [player, ball, enemy, score];

    while (true) {
        await new Promise(r => setTimeout(r, 1));
        context.clearRect(0, 0, canvas.width, canvas.height);
        ball.act(player, enemy, score);
        objects.forEach(e => e.draw());
    }

}