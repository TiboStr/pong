const canvas = document.getElementById("game");
const context = canvas.getContext('2d');

const canvasHeight = canvas.height;
const canvasWidth = canvas.width;


if (!context) {
    alert("Please update your browser");
}

class AbstractPlayer {
    constructor() {
        context.fillStyle = 'chartreuse';
        this.height = 70;
        this.width = 15;
    }
}

class Player extends AbstractPlayer{
    constructor() {
        super();
        context.fillRect(10, canvasHeight/2-this.height/2, this.width, this.height);

        window.onkeydown = e => this.move(e.keyCode);
    }
    
    move(keyCode) {
        switch(keyCode) {
            case 38:
                alert("up");
                break;
            case 40:
                alert("down");
                break;
        }
        
    }
}

class Enemy extends AbstractPlayer {
    constructor() {
        super();
        context.fillRect(canvasWidth - this.width - 10, canvasHeight/2-this.height/2, this.width, this.height);
    }
}

class Ball {
    constructor() {
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(canvasWidth/2, canvasHeight/2, 15, 0, 2 * Math.PI);
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
        context.fillText(`${this.playerScore} - ${this.enemyScore}`, canvasWidth/2, 50);
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

