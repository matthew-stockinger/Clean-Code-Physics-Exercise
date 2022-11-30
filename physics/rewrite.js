const X = 0;
const Y = 1;

function convertToDegrees(radians) {
  return (radians / Math.PI) * 180;
}

function convertToRadians(degrees) {
  return (degrees / 180) * Math.PI;
}

class Force {
  constructor(magnitudeNewtons, realInclineDegrees) {
    this.magnitudeNewtwons = magnitudeNewtons;
    this.realInclineDegrees = realInclineDegrees;
    this.realInclineRadians = convertToRadians(this.realInclineDegrees);
    this.xyComponents = [
      this.magnitudeNewtwons * Math.cos(this.realInclineRadians),
      this.magnitudeNewtwons * Math.sin(this.realInclineRadians),
    ];
  }

  setInclinedXYComponents(planeInclineDegrees) {
    const planeInclineRadians = convertToRadians(planeInclineDegrees);

    this.inclinedXYComponents = [
      this.xyComponents[X] * Math.cos(planeInclineRadians) +
        this.xyComponents[Y] * Math.sin(planeInclineRadians),
      -this.xyComponents[X] * Math.sin(planeInclineRadians) +
        this.xyComponents[Y] * Math.cos(planeInclineRadians),
    ];
  }
}

class InclinedPlaneProblem {
  constructor(descriptorObject) {
    this.itemOnPlane = descriptorObject.itemOnPlane;
    this.inclinedPlane = descriptorObject.inclinedPlane;
    this.coefficientOfFriction = descriptorObject.coefficientOfFriction || 0;
    this.forceApplied = descriptorObject.forceApplied || new Force(0, 0);
  }

  solve() {
    this.forceGravity = this.getForceGravity();
    this.forceApplied.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    this.forceNormal = this.getForceNormal();
    this.forceNetWithoutFriction = this.getForceNetWithoutFriction();
    this.forceFriction = this.getForceFriction();
    this.forceNet = this.getForceNet();
  }

  getForceGravity() {
    const gravity = new Force(this.itemOnPlane.massKg * 9.8, -90);
    gravity.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    return gravity;
  }

  getForceNormal() {
    const magnitude = Math.abs(this.forceGravity.inclinedXYComponents[Y]);
    const realDirection = 90 + this.inclinedPlane.angleDegrees;
    const normal = new Force(magnitude, realDirection);
    normal.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    return normal;
  }

  getForceNetWithoutFriction() {
    const gravityInclinedX = this.forceGravity.inclinedXYComponents[X];
    const appliedInclinedX = this.forceApplied.inclinedXYComponents[X];
    const netInclinedX = gravityInclinedX + appliedInclinedX;
    let realDirection;
    if (netInclinedX > 0) {
      realDirection = this.inclinedPlane.angleDegrees;
    } else {
      realDirection = this.inclinedPlane.angleDegrees + 180;
    }
    const net = new Force(Math.abs(netInclinedX), realDirection);
    net.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    return net;
  }

  getForceFriction() {
    const frictionNewtons =
      this.coefficientOfFriction * this.forceNormal.magnitudeNewtwons;
    let frictionAngle;
    if (this.forceNetWithoutFriction.inclinedXYComponents[X] > 0) {
      frictionAngle = this.inclinedPlane.angleDegrees + 180;
    } else {
      frictionAngle = this.inclinedPlane.angleDegrees;
    }
    const friction = new Force(frictionNewtons, frictionAngle);
    friction.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    return friction;
  }

  getForceNet() {
    const magnitude =
      this.forceFriction.inclinedXYComponents[X] +
      this.forceNetWithoutFriction.inclinedXYComponents[X];
    const net = new Force(magnitude, this.inclinedPlane.angleDegrees);
    net.setInclinedXYComponents(this.inclinedPlane.angleDegrees);
    return net;
  }
}

////////////////////////// Tests ///////////////////

// no friction, no applied force
const ex1 = new InclinedPlaneProblem({
  itemOnPlane: { massKg: 10 },
  inclinedPlane: { angleDegrees: 30 },
});
// ex1.solve();
// console.log(ex1);

// some friction, no applied force
const ex2 = new InclinedPlaneProblem({
  itemOnPlane: { massKg: 10 },
  inclinedPlane: { angleDegrees: 30 },
  coefficientOfFriction: 0.5,
});
// ex2.solve();
// console.log(ex2);

// some friction, 100N applied uphill force
const ex3 = new InclinedPlaneProblem({
  itemOnPlane: { massKg: 10 },
  inclinedPlane: { angleDegrees: 30 },
  coefficientOfFriction: 0.5,
  forceApplied: new Force(100, 30),
});
ex3.solve();
console.log(ex3);

// little friction, 100N applied downhill force
const ex4 = new InclinedPlaneProblem({
  itemOnPlane: { massKg: 10 },
  inclinedPlane: { angleDegrees: 30 },
  coefficientOfFriction: 0.3,
  forceApplied: new Force(100, 210),
});
// ex4.solve();
// console.log(ex4);
