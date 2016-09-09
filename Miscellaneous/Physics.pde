// Physics
// Timesteps are managed here
class Physics {
  // list of circle constraints
  ArrayList<Circle> circles = new ArrayList<Circle>();
  
  long previousTime;
  long currentTime;
  
  int fixedDeltaTime;
  float fixedDeltaTimeSeconds;
  
  int leftOverDeltaTime;
  
  int constraintAccuracy;
  
  Physics() {
    fixedDeltaTime = 16;
    fixedDeltaTimeSeconds = (float)fixedDeltaTime / 1000.0;
    leftOverDeltaTime = 0;
    constraintAccuracy = 3;
  }
  
  // Update physics
  void update() {
    // calculate elapsed time
    currentTime = millis();
    long deltaTimeMS = currentTime - previousTime;
    
    previousTime = currentTime; // reset previous time
    
    // break up the elapsed time into manageable chunks
    int timeStepAmt = (int)((float)(deltaTimeMS + leftOverDeltaTime) / (float)fixedDeltaTime);
    
    // limit the timeStepAmt to prevent potential freezing
    timeStepAmt = min(timeStepAmt, 5);
    
    // store however much time is leftover for the next frame
    leftOverDeltaTime = (int)deltaTimeMS - (timeStepAmt * fixedDeltaTime);
  
    // How much to push PointMasses when the user is interacting
    mouseInfluenceScalar = 1.0 / timeStepAmt;
    
    // update physics
    for (int iteration = 1; iteration <= timeStepAmt; iteration++) {
      // solve the constraints multiple times
      // the more it's solved, the more accurate.
      for (int x = 0; x < constraintAccuracy; x++) {
        for (int i = 0; i < pointmasses.size(); i++) {
          PointMass pointmass = (PointMass) pointmasses.get(i);
          pointmass.solveConstraints();
        }
        for (int i = 0; i < circles.size(); i++) {
          Circle c = (Circle) circles.get(i);
          c.solveConstraints();  
        }
      }
      
      // update each PointMass's position
      for (int i = 0; i < pointmasses.size(); i++) {
        PointMass pointmass = (PointMass) pointmasses.get(i);
        pointmass.updateInteractions();
        pointmass.updatePhysics(fixedDeltaTimeSeconds);
      }
    }
  }
  
  void addCircle (Circle c) {
    circles.add(c);  
  }
  void removeCircle (Circle c) {
    circles.remove(c);  
  }
}
