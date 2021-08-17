// Name any p5.js functions we use in `global` so Glitch can recognize them.
/* global
 *    HSB, background, color, collideRectRect, colorMode, createCanvas, fill, frameRate, keyCode, height,
 *    loop, noFill, noLoop, noStroke, random, rect, round, stroke, sqrt, text, width
 *    UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
 */

// Solution: Version 2 - With Tail

let backgroundColor, playerSnake, currentApple, score;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frameRate(12);
  playerSnake = new Snake();
  currentApple = new Apple();
  score = 0;
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  playerSnake.moveSelf();
  playerSnake.showSelf();
  playerSnake.checkCollisions();
  playerSnake.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  fill(0);
  text(`Score: ${score}`, 20, 20);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width/2;
    this.y = height - this.size;
    this.direction = 'N';
    this.speed = 12;  // reason?
    // let temp = new TailSegment(this.x, this.y);
    // this.tail = [temp];
    this.tail = [new TailSegment(this.x, this.y)] // adds new tail or square
  }

  moveSelf() {
    if (this.direction === "N") { //moves by itself N = negative
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
    this.tail.unshift(new TailSegment(this.x, this.y));  // add a tail segment at the beginning or new square
    this.tail.pop();  // remove the last square
  }

  showSelf() {
    //head of snake (main)
    stroke(240, 100, 100);
    noFill();
    rect(this.x, this.y, this.size, this.size);
    
    //tail increases by one
    noStroke();          //'0'{}{}{}{}<length ++new block
    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].showSelf();
    }
  }

  checkApples() {
    // If the head of the snake collides with the apple...
    if (collideRectRect(this.x, this.y, this.size, this.size,
        currentApple.x, currentApple.y, currentApple.size, currentApple.size)) {
      // Make a new apple, increment the score, and extend the tail.
      score += 1;
      currentApple = new Apple();
      this.extendTail();
    }
  }

  checkCollisions() { //bitting your own tale but it starts at the very 1st square, not the main head.
    if (this.tail.length > 1) {
      for (let i=1; i < this.tail.length; i++) {
        if (this.x == this.tail[i].x && this.y == this.tail[i].y) {
          gameOver();
        }
      }
    }
  }

  extendTail() {
    // Add a new segment by duplicating whatever you find at the end of the tail.
    let lastTailSegment = this.tail[this.tail.length - 1]; // adds new square. Allows to push the square and add a new one{end}.
    // Push a new tail segment to the end, using the same position as the
    // current last segment of the tail.
    this.tail.push(new TailSegment(lastTailSegment.x, lastTailSegment.y));
  }
}

class TailSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
  }

  showSelf() {
    fill(0);
    rect(this.x, this.y, this.size, this.size);
  }
}



class Apple {
  constructor() {
    this.size = 10;
    this.x = round(random(width - this.size));
    this.y = round(random(height - this.size));
  }

  showSelf() {
    fill(0, 80, 80);
    rect(this.x, this.y, this.size, this.size);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && playerSnake.direction != 'S') {
    playerSnake.direction = "N";
  } else if (keyCode === DOWN_ARROW && playerSnake.direction != 'N') {
    playerSnake.direction = "S";
  } else if (keyCode === RIGHT_ARROW && playerSnake.direction != 'W') {
    playerSnake.direction = "E";
  } else if (keyCode === LEFT_ARROW && playerSnake.direction != 'E') {
    playerSnake.direction = "W";
  } else if (keyCode === 32) {
    restartGame();
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  score = 0;
  playerSnake = new Snake();
  currentApple = new Apple();
  loop();  // call the function draw continuously 
}

function gameOver() {
  stroke(0);
  text("GAME OVER", 50, 50);
  noLoop();
}
