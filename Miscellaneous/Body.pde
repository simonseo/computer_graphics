// Body
// Here we construct and store a ragdoll
class Body {
  /*
     O
    /|\
   / | \
    / \
   |   |
  */
  PointMass head;
  PointMass shoulder;
  PointMass elbowLeft;
  PointMass elbowRight;
  PointMass handLeft;
  PointMass handRight;
  PointMass pelvis;
  PointMass kneeLeft;
  PointMass kneeRight;
  PointMass footLeft;
  PointMass footRight;
  Circle headCircle;
  
  float headWidth;
  float headLength;
  Body (float x, float y, float bodyHeight) {
    headLength = bodyHeight / 7.5;
    headWidth = headLength * 3/4;

    head = new PointMass(x + random(-5,5),y + random(-5,5));
    head.mass = 4;
    shoulder = new PointMass(x + random(-5,5),y + random(-5,5));
    shoulder.mass = 26; // shoulder to torso
    head.attachTo(shoulder, 5/4 * headLength, 1, bodyHeight*2, true);
    
    elbowLeft = new PointMass(x + random(-5,5),y + random(-5,5));
    elbowRight = new PointMass(x + random(-5,5),y + random(-5,5));
    elbowLeft.mass = 2; // upper arm mass
    elbowRight.mass = 2; 
    elbowLeft.attachTo(shoulder, headLength*3/2, 1, bodyHeight*2, true);
    elbowRight.attachTo(shoulder, headLength*3/2, 1, bodyHeight*2, true);
    
    handLeft = new PointMass(x + random(-5,5),y + random(-5,5));
    handRight = new PointMass(x + random(-5,5),y + random(-5,5));
    handLeft.mass = 2;
    handRight.mass = 2;
    handLeft.attachTo(elbowLeft, headLength*2, 1, bodyHeight*2, true);
    handRight.attachTo(elbowRight, headLength*2, 1, bodyHeight*2, true);
    
    pelvis = new PointMass(x + random(-5,5),y + random(-5,5));
    pelvis.mass = 15; // pelvis to lower torso
    pelvis.attachTo(shoulder,headLength*3.5,0.8,bodyHeight*2, true);
    // this restraint keeps the head from tilting in extremely uncomfortable positions
    pelvis.attachTo(head, headLength*4.75, 0.02, bodyHeight*2, false);
    
    kneeLeft = new PointMass(x + random(-5,5),y + random(-5,5));
    kneeRight = new PointMass(x + random(-5,5),y + random(-5,5));
    kneeLeft.mass = 10;
    kneeRight.mass = 10;
    kneeLeft.attachTo(pelvis, headLength*2, 1, bodyHeight*2, true);
    kneeRight.attachTo(pelvis, headLength*2, 1, bodyHeight*2, true);
    
    footLeft = new PointMass(x + random(-5,5),y + random(-5,5));
    footRight = new PointMass(x + random(-5,5),y + random(-5,5));
    footLeft.mass = 5; // calf + foot
    footRight.mass = 5;
    footLeft.attachTo(kneeLeft, headLength*2, 1, bodyHeight*2, true);
    footRight.attachTo(kneeRight, headLength*2, 1, bodyHeight*2, true);
    
    // these constraints resist flexing the legs too far up towards the body
    footLeft.attachTo(shoulder, headLength*7.5, 0.001, bodyHeight*2, false);
    footRight.attachTo(shoulder, headLength*7.5, 0.001, bodyHeight*2, false);
    
    headCircle = new Circle(headLength*0.75);
    headCircle.attachToPointMass(head);
    
    physics.addCircle(headCircle);
    addPointMass(head);
    addPointMass(shoulder);
    addPointMass(pelvis);
    addPointMass(elbowLeft);
    addPointMass(elbowRight);
    addPointMass(handLeft);
    addPointMass(handRight);
    addPointMass(kneeLeft);
    addPointMass(kneeRight);
    addPointMass(footLeft);
    addPointMass(footRight);
  }
  void removeFromWorld () {
    physics.removeCircle(headCircle);
    removePointMass(head);
    removePointMass(shoulder);
    removePointMass(pelvis);
    removePointMass(elbowLeft);
    removePointMass(elbowRight);
    removePointMass(handLeft);
    removePointMass(handRight);
    removePointMass(kneeLeft);
    removePointMass(kneeRight);
    removePointMass(footLeft);
    removePointMass(footRight);
  }
}
