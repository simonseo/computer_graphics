// The Link class is used for handling distance constraints between PointMasss.
class Link {
  float restingDistance;
  float stiffness;
  float tearSensitivity;
  
  PointMass p1;
  PointMass p2;
  
  // if you want this link to be invisible, set this to false
  boolean drawThis = true;
  
  Link(PointMass which1, PointMass which2, float restingDist, float stiff, float tearSensitivity, boolean drawMe) {
    p1 = which1; // when you set one object to another, it's pretty much a reference. 
    p2 = which2; // Anything that'll happen to p1 or p2 in here will happen to the paticles in our ArrayList
    
    restingDistance = restingDist;
    stiffness = stiff;
    drawThis = drawMe;
    
    this.tearSensitivity = tearSensitivity;
  }
  
  // Solve the link constraint
  void solve() {
    // calculate the distance between the two PointMasss
    float diffX = p1.x - p2.x;
    float diffY = p1.y - p2.y;
    float d = sqrt(diffX * diffX + diffY * diffY);
    
    // find the difference, or the ratio of how far along the restingDistance the actual distance is.
    float difference = (restingDistance - d) / d;
    
    // if the distance is more than curtainTearSensitivity, the cloth tears
    if (d > tearSensitivity) 
      p1.removeLink(this);
    
    // Inverse the mass quantities
    float im1 = 1 / p1.mass;
    float im2 = 1 / p2.mass;
    float scalarP1 = (im1 / (im1 + im2)) * stiffness;
    float scalarP2 = stiffness - scalarP1;
    
    // Push/pull based on mass
    // heavier objects will be pushed/pulled less than attached light objects
    p1.x += diffX * scalarP1 * difference;
    p1.y += diffY * scalarP1 * difference;
    
    p2.x -= diffX * scalarP2 * difference;
    p2.y -= diffY * scalarP2 * difference;
  }

  // Draw if it's visible
  void draw() {
    if (drawThis)
      line(p1.x, p1.y, p2.x, p2.y);
  }
}
