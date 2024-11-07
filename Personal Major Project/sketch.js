// Define the radius, number of rows, and number of columns for the cylinders in the Grass element
let cylinderRadius = 10;
let cylinderRows;
let cylinderCols;

// Create an empty array to store circles in the River element
let riverCircles = [];

// Create a boolean variable to control when the Tree element is drawn
let ifDrawTree = true;

function setup() {
  createCanvas(windowWidth, windowHeight); // Set canvas size to window width and height
  angleMode(DEGREES); // Use degrees, as opposed to radians, to measure angles
  // I remove noLoop()

  // Calculate cylinder dimensions based on canvas size
  cylinderRows = Math.floor(height / (cylinderRadius * 0.6));
  cylinderCols = Math.floor(width / (cylinderRadius * 1.2));

  // Initialize circles for the river
  let numRiverRows = Math.floor(height / 30); // Rows based on height
  let numRiverCircles = Math.floor(width / 10); // Circles in each row based on width

  // Initialize circles for the river
  for (let j = 0; j < numRiverRows; j++) { // Loop through 6 rows of circles
    for (let i = 0; i < numRiverCircles; i++) { // Loop through 40 circles in each row
      // Adjust x position to start from the right side, with a curve to the left
      let x = width - i * random(15, 30); // Randomize x increment to introduce more curve

      // Set a base y-position in the lower part of the canvas and add curving effects
      let baseY = height * 0.7;
      let yOffset = sin(map(i, 0, 40, 0, PI)) * 100; // Stronger sine wave for curvature
      let rowOffset = j * random(10, 30); // Add variation for each row
      let downwardSlope = i * random(4, 8); // Increase downward slope gradually

      let y = baseY + yOffset + rowOffset + downwardSlope; // Combine all for a flowing shape

      // Randomize the size and color of each circle
      let circleSize = random(width / 100, width / 15);
      let blueShade = color(random(0, 100), random(100, 200), random(200, 255));
      riverCircles.push(new Circle(x, y, circleSize, blueShade));
    }
  }
}

function draw() {
  // Draw the Sky element
  drawGradientSky();
  drawCelestialBodies();
  drawStars();

  // Draw the first Grass element
  push();
  translate(width / 5.5, height / 1.8); // Shift the origin from the default (0,0) to the specified position
  drawGrass();
  pop();

  // Draw the second Grass element
  push();
  translate(width / 1.1, height / 1.6); // Shift the origin from the default (0,0) to the specified position
  drawGrass();
  pop();

  // Draw the Tree element
  if (ifDrawTree) {
    // I change the last parameter from 9 to 10, make the tree bigger
    drawTree(width / 1.6, height * 0.8, -90, 10); // Start from the location, pointing upwards
    // I remove ifDrawTree = false, so the tree will stay on canvas
    //ifDrawTree = false; // Stop drawing the tree
  }

  // Draw the River element
  for (let circle of riverCircles) {
    circle.display();
  }
}

// Create a function for applying responsive design
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // Reinitialize values after resizing
  ifDrawTree = true;
  redraw(); // Ensure all elements resize and reposition after resizing the window.
}

// Create a function to draw the Grass element using cylinders
function drawGrass() {
  for (let y = 0; y < cylinderRows; y++) { // Loop through the rows of cylinders
    for (let x = 0; x < cylinderCols; x++) { // Loop through the columns in each row
      // Calculate the position in isometric view
      let xPos = (x - y) * cylinderRadius * 1.2;
      let yPos = (x + y) * cylinderRadius * 0.6;

      // Randomize the height for the top of each cylinder
      //let topHeight = random(20, 80); 
      //I used the perlin noise to make the animation of the grass element smoother
      let topHeight = map(noise(x * 0.1, y * 0.1, frameCount * 0.01), 0, 1, 20, 80);

      // Draw each cylinder with a random top height
      drawCylinder(xPos, yPos, topHeight);
    }
  }
}

// Create a function to draw a cylinder to be used in the Grass element
function drawCylinder(x, y, topHeight) {
  push();
  translate(x, y); // Place the cylinder at the specified origin (x,y)

  // Draw the side face of the cylinder
  fill(random(50, 255), 196, 82);
  strokeWeight(1);
  stroke(255);

  /* The usage of beginShape() and endShape() functions was modified from the examples on https://p5js.org/reference/p5/beginShape/.
  These two functions allow for creating a custom shape by adding vertices in the vertex() function.
  Here, the positions of the vertices are determined by the radius and the height of the cylinder. */
  beginShape();
  vertex(-cylinderRadius, 0);
  vertex(cylinderRadius, 0);
  vertex(cylinderRadius, -topHeight);
  vertex(-cylinderRadius, -topHeight);
  endShape(CLOSE);


  // Draw the top face of the cylinder as an ellipse at the new top height
  fill(random(32, 100), 152, 48);
  ellipse(0, -topHeight, cylinderRadius * 2, cylinderRadius * 0.8);
  pop();
}

// Create Circle class to be used in the River element
class Circle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  // Create a method for drawing circles
  display() {
    fill(this.color);
    stroke(255);
    ellipse(this.x, this.y, this.size, this.size);

    // Use a random value between 0 and 1 to determine whether to draw a spiral or inner circles
    if (random() < 0.5) {
      this.drawSpiral();
    } else {
      this.drawInnerCircles();
    }
  }

  // Create a method for drawing spirals inside the circle
  drawSpiral() {
    angleMode(RADIANS); // Set to radians for this function to make sure angels are not in degrees
    stroke(255, 200);
    noFill();
    // Set the initial x- and y-position for the first point in the spiral
    let prevX = this.x;
    let prevY = this.y;

    // Loop through angles from 0 to 4 full rotations
    for (let angle = 0; angle < TWO_PI * 4; angle += 0.05) {
      let r = map(angle, 0, TWO_PI * 4, 0, this.size / 2 - 1); // Map the angle to a radius, increasing as the angle increases

      // Calculate the x- and y-position for the current point in the spiral
      let x = this.x + r * cos(angle);
      let y = this.y + r * sin(angle);

      // Draw a line from the previous point to the current point to create the spiral
      line(prevX, prevY, x, y);

      // Update the previous x- and y-position for the next segment
      prevX = x;
      prevY = y;
    }
    angleMode(DEGREES); // Reset angleMode to degrees
  }

  // Create a method for drawing smaller circles inside the circle
  drawInnerCircles() {
    let numInnerCircles = Math.round(random(3, 6)); // Randomly choose between 3 and 6 inner circles

    // Loop to create each inner circle
    for (let i = 0; i < numInnerCircles; i++) {
      // Random size for each inner circle, up to one-third of the main circle's size
      let innerSize = random(5, this.size / 3);

      // Pick a random x- and y-position within the bounds of the outer circle
      let innerX = this.x + random(-this.size / 3, this.size / 3);
      let innerY = this.y + random(-this.size / 3, this.size / 3);
      let innerColor = color(255, random(100, 200)); // Set the color with a white tone and random transparency

      // Draw the circle with the specified values above
      fill(innerColor);
      ellipse(innerX, innerY, innerSize, innerSize);
    }
  }
}

// Create a function to draw the Tree element
function drawTree(x, y, angle, number) {
  if (number > 0) {
    // Draw the main branch
    let length = map(number, 0, 10, height / 50, height / 10); // Map the length to the window height
    let x2 = x + cos(angle) * length;
    let y2 = y + sin(angle) * length;
    stroke(random(100, 255), random(100, 255), random(100, 255));
    line(x, y, x2, y2);

    // Call the function to draw circles around every branch
    drawTreeCircles(x2, y2, number);

    // Create 2 branches from the previous branch until the number value becomes 0
    drawTree(x2, y2, angle - random(15, 30), number - 1);
    drawTree(x2, y2, angle + random(15, 30), number - 1);
  }
}

// Create a function to draw some concentric circles on every branch
function drawTreeCircles(x, y, number) {
  // Draw concentric circles with random colors
  noFill();
  // I change (number * 1) to (number * 0.8) in order to reduce the numbers of concentric circles
  for (let i = 0; i < number * 0.8; i++) {
    stroke(random(100, 255), random(100, 255), random(100, 255), 150);
    ellipse(x, y, i * 10, i * 10);
  }

  // Draw some dots around the circles to present leaves
  for (let i = 0; i < number * 2; i++) {
    let angle = random(360);
    let radius = random(number * 5, number * 10);
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    fill(random(100, 255), random(100, 255), random(100, 255), 200);
    noStroke();
    circle(x + xOffset, y + yOffset, 5);
  }
}

// Create a function to draw the Sky element
function drawGradientSky() {
  for (let y = 0; y <= height; y++) {
    let gradient = map(y, 0, height, 0, 1);
    let skycolor = lerpColor(color(25, 10, 100), color(50, 50, 50), gradient);
    /* A funtion that helps interpolates between these two colours
    this lerp function and how to make gradient was adapted from by Patt Vira
    https://www.youtube.com/watch?v=lPgscmgxcH0 */

    stroke(skycolor);
    line(0, y, width, y); // Draw a line on canvas for each y value. This fills the background with the gradient.
  }
}

// Create a function to draw the celestial bodies in the Sky element
function drawCelestialBodies() {
  noStroke();
  let numBodies = 12;
  // Loop to create the big yellow circles aka the celestial bodies
  for (let i = 0; i < numBodies; i++) {
    let x = random(width); // Random positioning on x
    let y = random(height / 4); // This makes sure that they always remain in the upper half
    let maxRadius = random(40, 30);
    let innerCircles = 7; // These are the circles in circles

    // This loop draws the inner circles
    for (let j = 0; j < innerCircles; j++) {
      let radius = map(j, 0, innerCircles, maxRadius, 0);
      fill(255, 255, 50, map(j, 0, innerCircles, 100, 0));
      ellipse(x, y, radius * 2, radius * 2);
    }
  }
}

// Create a function to draw the stars in the Sky element
function drawStars() {
  noStroke();
  fill(255, 255, 200);
  let numStars = 150;
  for (let i = 0; i < numStars; i++) {
    let xPos = random(width);
    let yPos = random(height);
    let w = random(1, 5);
    let h = w + random(-1, 1);
    ellipse(xPos, yPos, w, h);
  }
}

