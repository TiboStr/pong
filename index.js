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
        this.height = canvasHeight / 2.0;
        this.width = canvasWidth / 2.0;
        this.angle = 45;

        this.draw();
    }

    draw(){
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(this.width, this.height, 15.0, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }

    getHeigth(){
        return height;
    }

    getWidth(){
        return width;
    }

    touchWall(){
        return this.width <= 15.0 || this.height <= 15.0 || this.width >= canvasWidth - 15.0 || this.height >= canvasHeight - 15.0
    }

    move() {
        if(this.touchWall()){
            this.bounce();
        }
        context.clearRect(this.width-22.21, this.height-22.21, 60, 60);
        let radians = this.angle * Math.PI / 180.0;
        this.width += Math.cos(radians)*1.5;
        this.height += Math.sin(radians)*1.5;
        this.draw();
        
    }

    bounce(){
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
        context.font = "40px serif"
        context.fillText(`${this.playerScore} - ${this.enemyScore}`, canvasWidth / 2, 50);
    }
}


document.onload = startScreen();

function startScreen() {
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.font = "40px serif"
    context.fillText("Press any key to start the game", canvasWidth / 2, canvasHeight/2);
    canvas.classList.add("blink");

    window.onkeydown = () => {
        canvas.classList.remove("blink");
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        begin();  
    }

}

async function begin() {
    const player = new Player();
    const ball = new Ball();
    const enemy = new Enemy();
    const score = new Score();
    const objects = [player,  ball, enemy, score];
    while (true){
        await new Promise(r => setTimeout(r, 1))
        context.clearRect(0, 0, canvas.width, canvas.height);
        ball.move();
        objects.forEach(e => e.draw())
    }
    

}

