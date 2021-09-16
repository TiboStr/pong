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
            case 38:  // arrow up
            case 90:  // z
            case 87:  // w
                super.moveUp();
                break;
            case 40:  // arrow down
            case 83:  // s
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
        this.height = canvasHeight / 2.0;
        this.width = canvasWidth / 2.0;
        this.angle = 45;
        this.r = 15.0;

        this.draw();
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

    touchWall(player, enemy) {
        return this.width <= this.r || this.height <= this.r || this.width >= canvasWidth - this.r || this.height >= canvasHeight - this.r;
    }

    touchPlayer(player, enemy) {
        return (player.x + 15 >= this.width - this.r && player.y <= this.height && player.y + 70 >= this.height) || (enemy.x <= this.width + this.r && enemy.y <= this.height && enemy.y + 70 >= this.height);
    }

    act(player, enemy, score) {
        if (this.touchWall(player, enemy)) {
            this.bounce();
        }
        else if (this.touchPlayer(player, enemy)) {
            this.bounce();
        }
        context.clearRect(this.width - 22.21, this.height - 22.21, 60, 60);
        let radians = this.angle * Math.PI / 180.0;
        this.width += Math.cos(radians) * 1.5;
        this.height += Math.sin(radians) * 1.5;
        this.draw();

    }

    bounce() {
        this.angle += 90;
        this.angle %= 360;
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

