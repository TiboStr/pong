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
        window.onkeydown = e => this.move(e.keyCode);
    }

    move(keyCode) {
        switch (keyCode) {
            case 38:
                super.moveUp();
                break;
            case 40:
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
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(canvasWidth / 2, canvasHeight / 2, 15, 0, 2 * Math.PI);
        context.fill();
    }
}


class Score {
    constructor() {
        this.playerScore = 0;
        this.enemyScore = 0;
        this.drawScore();
    }

    drawScore() {
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.font = "40px serif"
        context.fillText(`${this.playerScore} - ${this.enemyScore}`, canvasWidth / 2, 50);
    }
}

document.onload = begin();

async function begin() {
    new Player();
    new Ball();
    new Enemy();
    new Score();
    await new Promise(r => setTimeout(r, 2000))

}

