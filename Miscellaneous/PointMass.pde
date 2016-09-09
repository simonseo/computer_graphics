// PointMass
class PointMass {
  float lastX, lastY; // for calculating position change (velocity)
  float x,y;
  float accX, accY;
  
  float mass = 1;
  float damping = 20;

  // An ArrayList for links, so we can have as many links as we want to this PointMass
  ArrayList links = new ArrayList();
  
  boolean pinned = false;
  float pinX, pinY;
  
  // PointMass constructor
  PointMass(float xPos, float yPos) {
    x = xPos;
    y = yPos;
    
    lastX = x;
    lastY = y;
    
    accX = 0;
    accY = 0;
  }
  
  // The update function is used to update the physics of the PointMass.
  // motion is applied, and links are drawn here
  void updatePhysics(float timeStep) { // timeStep should be in elapsed seconds (deltaTime)
    this.applyForce(0, mass * gravity);
    
    float velX = x - lastX;
    float velY = y - lastY;
    
    // dampen velocity
    velX *= 0.99;
    velY *= 0.99;

    float timeStepSq = timeStep * timeStep;

    // calculate the next position using Verlet Integration
    float nextX = x + velX + 0.5 * accX * timeStepSq;
    float nextY = y + velY + 0.5 * accY * timeStepSq;
    
    // reset variables
    lastX = x;
    lastY = y;
    
    x = nextX;
    y = nextY;
    
    accX = 0;
    accY = 0;
  }
  void updateInteractions() {
    // this is where our interaction comes in.
    if (mousePressed) {
      float distanceSquared = distPointToSegmentSquared(pmouseX,pmouseY,mouseX,mouseY,x,y);
      if (mouseButton == LEFT) {
        if (distanceSquared < mouseInfluenceSize) { // remember mouseInfluenceSize was squared in setup()
          // To change the velocity of our PointMass, we subtract that change from the lastPosition.
          // When the physics gets integrated (see updatePhysics()), the change is calculated
          // Here, the velocity is set equal to the cursor's velocity
          lastX = x - (mouseX-pmouseX)*mouseInfluenceScalar;
          lastY = y - (mouseY-pmouseY)*mouseInfluenceScalar;
        }
      }
      else { // if the right mouse button is clicking, we tear the cloth by removing links
        if (distanceSquared < mouseTearSize) 
          links.clear();
      }
    }
  }

  void draw() {
    // draw the links and points
    stroke(0);
    if (links.size() > 0) {
      for (int i = 0; i < links.size(); i++) {
        Link currentLink = (Link) links.get(i);
        currentLink.draw();
      }
    }
    else
      point(x, y);
  }
  /* Constraints */
  void solveConstraints() {
    /* Link Constraints */
    // Links make sure PointMasss connected to this one is at a set distance away
    for (int i = 0; i < links.size(); i++) {
      Link currentLink = (Link) links.get(i);
      currentLink.solve();
    }
    
    /* Boundary Constraints */
    // These if statements keep the PointMasss within the screen
    if (y < 1)
      y = 2 * (1) - y;
    if (y > height-1)
      y = 2 * (height - 1) - y;
      
    if (x > width-1)
      x = 2 * (width - 1) - x;
    if (x < 1)
      x = 2 * (1) - x;
    
    /* Other Constraints */
    // make sure the PointMass stays in its place if it's pinned
    if (pinned) {
      x = pinX;
      y = pinY; 
    }
  }
  
  // attachTo can be used to create links between this PointMass and other PointMasss
  void attachTo(PointMass P, float restingDist, float stiff) {
    attachTo(P, restingDist, stiff, 30, true);
  }
  void attachTo(PointMass P, float restingDist, float stiff, boolean drawLink) {
    attachTo(P, restingDist, stiff, 30, drawLink);
  }
  void attachTo(PointMass P, float restingDist, float stiff, float tearSensitivity) {
    attachTo(P, restingDist, stiff, tearSensitivity, true);
  }
  void attachTo(PointMass P, float restingDist, float stiff, float tearSensitivity, boolean drawLink) {
    Link lnk = new Link(this, P, restingDist, stiff, tearSensitivity, drawLink);
    links.add(lnk);
  }
  void removeLink (Link lnk) {
    links.remove(lnk);
  }  
 
  void applyForce(float fX, float fY) {
    // acceleration = (1/mass) * force
    // or
    // acceleration = force / mass
    accX += fX/mass;
    accY += fY/mass;
  }
  
  void pinTo (float pX, float pY) {
    pinned = true;
    pinX = pX;
    pinY = pY;
  }
} 
