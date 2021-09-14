const canvas = document.getElementById("game");
const context = canvas.getContext('2d');

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;


if (!context) {
    alert("Please update your browser");
}

class AbstractPlayer {
    constructor() {
        this.height = 70;
        this.width = 15;
        this.stepSize = 12;
    }

    draw(x, y) {
        context.fillStyle = 'chartreuse';
        context.fillRect(x, y, this.width, this.height);
    }

}

class Player extends AbstractPlayer {
    constructor() {
        super();
        this.x = 10;
        this.y = canvasHeight / 2 - this.height / 2
        super.draw(this.x, this.y);

        window.onkeydown = e => this.move(e.keyCode);
    }

    move(keyCode) {
        switch (keyCode) {
            case 38:
                context.clearRect(this.x, this.y, this.width, this.height);
                this.y = this.y - this.stepSize > 0 ? this.y - this.stepSize : this.y;
                super.draw(this.x, this.y);
                break;
            case 40:
                context.clearRect(this.x, this.y, this.width, this.height);
                this.y = this.y + this.height + this.stepSize < canvasHeight ? this.y + this.stepSize : this.y;
                super.draw(this.x, this.y);
                break;
        }

    }
}

class Enemy extends AbstractPlayer {
    constructor() {
        super();
        this.x = canvasWidth - this.width - 10;
        this.y = canvasHeight / 2 - this.height / 2
        super.draw(this.x, this.y);
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

