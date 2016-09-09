
// Where we'll store all of the points
ArrayList<PointMass> pointmasses;

// every PointMass within this many pixels will be influenced by the cursor
float mouseInfluenceSize = 20; 
// minimum distance for tearing when user is right clicking
float mouseTearSize = 8;
float mouseInfluenceScalar = 5;

// amount to accelerate everything downward
float gravity = 980; 

// Dimensions for our curtain. These are number of PointMasss for each direction, not actual widths and heights
// the true width and height can be calculated by multiplying restingDistances by the curtain dimensions
final int curtainHeight = 40;
final int curtainWidth = 60;
final int yStart = 25; // where will the curtain start on the y axis?
final float restingDistances = 6;
final float stiffnesses = 1;
final float curtainTearSensitivity = 50; // distance the PointMasss have to go before ripping

// Physics, see physics.pde
Physics physics;
void setup() {
  size(640,480);
  
  physics = new Physics();
  
  // we square the mouseInfluenceSize and mouseTearSize so we don't have to use squareRoot when comparing distances with this.
  mouseInfluenceSize *= mouseInfluenceSize; 
  mouseTearSize *= mouseTearSize;
  
  // We use an ArrayList instead of an array so we can add or remove PointMasss at will.
  // not that it isn't possible using an array, it's just more convenient this way
  pointmasses = new ArrayList<PointMass>();
  
  // create the curtain
  createCurtain();
  
  // create the ragdolls
  createBodies();
}

void draw() {
  background(255);
  
  physics.update();
  
  updateGraphics();
  
  // Print frame rate every now and then
//  if (frameCount % 60 == 0)
//    println("Frame rate is " + frameRate);
}
// Draw everything
void updateGraphics() {
  for (PointMass p : pointmasses) {
    p.draw();
  }
  for (Circle c : physics.circles) {
    c.draw(); 
  }
}

void addPointMass(PointMass p) {
  pointmasses.add(p); 
}
void removePointMass(PointMass p) {
  pointmasses.remove(p);  
}


void createCurtain() {
  // midWidth: amount to translate the curtain along x-axis for it to be centered
  // (curtainWidth * restingDistances) = curtain's pixel width
  int midWidth = (int) (width/2 - (curtainWidth * restingDistances)/2);
  // Since this our fabric is basically a grid of points, we have two loops
  for (int y = 0; y <= curtainHeight; y++) { // due to the way PointMasss are attached, we need the y loop on the outside
    for (int x = 0; x <= curtainWidth; x++) { 
      PointMass pointmass = new PointMass(midWidth + x * restingDistances, y * restingDistances + yStart);
      
      // attach to 
      // x - 1  and
      // y - 1  
      //  *<---*<---*<-..
      //  ^    ^    ^
      //  |    |    |
      //  *<---*<---*<-..
      //
      // PointMass attachTo parameters: PointMass PointMass, float restingDistance, float stiffness
      // try disabling the next 2 lines (the if statement and attachTo part) to create a hairy effect
      if (x != 0) 
        pointmass.attachTo((PointMass)(pointmasses.get(pointmasses.size()-1)), restingDistances, stiffnesses);
      // the index for the PointMasss are one dimensions, 
      // so we convert x,y coordinates to 1 dimension using the formula y*width+x  
      if (y != 0)
        pointmass.attachTo((PointMass)(pointmasses.get((y - 1) * (curtainWidth+1) + x)), restingDistances, stiffnesses);
      
      // we pin the very top PointMasss to where they are
      if (y == 0)
        pointmass.pinTo(pointmass.x, pointmass.y);
        
      // add to PointMass array  
      pointmasses.add(pointmass);
    }
  }
}
void createBodies() {
  for (int i = 0; i < 25; i++) {
    new Body(random(width), random(height), 40);
  }  
}

// Controls. The r key resets the curtain, g toggles gravity
void keyPressed() {
  if ((key == 'r') || (key == 'R')) {
    pointmasses = new ArrayList<PointMass>();
    physics.circles = new ArrayList<Circle>();
    createCurtain();
    createBodies();
  } 
  if ((key == 'g') || (key == 'G'))
    toggleGravity();
}
void toggleGravity() {
  if (gravity != 0)
    gravity = 0;
  else
    gravity = 980;
}

// Using http://www.codeguru.com/forum/showpost.php?p=1913101&postcount=16
// We use this to have consistent interaction
// so if the cursor is moving fast, it won't interact only in spots where the applet registers it at
float distPointToSegmentSquared(float lineX1, float lineY1, float lineX2, float lineY2, float pointX, float pointY) {
  float vx = lineX1 - pointX;
  float vy = lineY1 - pointY;
  float ux = lineX2 - lineX1;
  float uy = lineY2 - lineY1;
  
  float len = ux*ux + uy*uy;
  float det = (-vx * ux) + (-vy * uy);
  if ((det < 0) || (det > len)) {
    ux = lineX2 - pointX;
    uy = lineY2 - pointY;
    return min(vx*vx+vy*vy, ux*ux+uy*uy);
  }
  
  det = ux*vy - uy*vx;
  return (det*det) / len;
}
