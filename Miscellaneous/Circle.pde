// Circle
// used as a head for ragdolls
class Circle {
  
  float radius;
  
  PointMass attachedPointMass;
  
  Circle (float r) {
    radius = r;
  }
  
  // Constraints
  void solveConstraints () {
    float x = attachedPointMass.x;
    float y = attachedPointMass.y;
    
    // only do a boundary constraint
    if (y < radius)
      y = 2*(radius) - y;
    if (y > height-radius)
      y = 2 * (height - radius) - y;
    if (x > width-radius)
      x = 2 * (width - radius) - x;
    if (x < radius)
      x = 2*radius - x;
      
    attachedPointMass.x = x;
    attachedPointMass.y = y;
  }
  
  void draw () {
    ellipse(attachedPointMass.x, attachedPointMass.y, radius*2, radius*2);
  }
  
  void attachToPointMass (PointMass p) {
    attachedPointMass = p;
  }
}
