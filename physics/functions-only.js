//////// don't touch ////////
const X = 0;
const Y = 1;
let forceAppliedInclined,
  forceGravity,
  forceGravityInclined,
  forceNormal,
  forceNormalInclined,
  forceFriction,
  forceFrictionInclined,
  forceNet,
  forceNetInclined;

/////////// edit these ///////////////
const massKg = 10;
const planeAngleDeg = 30;
const frictionCoeff = 0.5; // ok to enter 0
const forceApplied = xyFromMagnitudeAndDirection(100, 30);

printSolution();

////////// don't touch below here ////////////

function printSolution() {
  forceAppliedInclined = getInclinedXYComponents(forceApplied, planeAngleDeg);
  forceGravity = xyFromMagnitudeAndDirection(massKg * 9.8, -90);
  forceGravityInclined = getInclinedXYComponents(forceGravity, planeAngleDeg);
  forceNormal = getForceNormal();
  forceNormalInclined = getInclinedXYComponents(forceNormal, planeAngleDeg);
  forceFriction = getForceFriction();
  forceFrictionInclined = getInclinedXYComponents(forceFriction, planeAngleDeg);
  forceNet = getForceNet();
  forceNetInclined = getInclinedXYComponents(forceNet, planeAngleDeg);

  console.log(
    "\nforceAppliedInclined\n",
    forceAppliedInclined,
    "\nforceGravity\n",
    forceGravity,
    "\nforceGravityInclined\n",
    forceGravityInclined,
    "\nforceNormal\n",
    forceNormal,
    "\nforceNormalInclined\n",
    forceNormalInclined,
    "\nforceFriction\n",
    forceFriction,
    "\nforceFrictionInclined\n",
    forceFrictionInclined,
    "\nforceNet\n",
    forceNet,
    "\nforceNetInclined\n",
    forceNetInclined
  );
}

function getForceNet() {
  const magnitude =
    forceFrictionInclined[X] +
    forceGravityInclined[X] +
    forceAppliedInclined[X];
  return xyFromMagnitudeAndDirection(magnitude, planeAngleDeg);
}

function getForceFriction() {
  const magnitude = frictionCoeff * forceNormalInclined[Y];
  const forceNetNoFriction = getForceNetNoFriction();
  const forceNetNoFrictionInclined = getInclinedXYComponents(
    forceNetNoFriction,
    planeAngleDeg
  );
  let frictionAngle;
  if (forceNetNoFrictionInclined[X] > 0) {
    frictionAngle = planeAngleDeg + 180;
  } else {
    frictionAngle = planeAngleDeg;
  }
  return xyFromMagnitudeAndDirection(magnitude, frictionAngle);
}

function getForceNetNoFriction() {
  const netInclinedX = forceGravityInclined[X] + forceAppliedInclined[X];
  let direction;
  if (netInclinedX > 0) {
    direction = planeAngleDeg;
  } else {
    direction = planeAngleDeg + 180;
  }
  return xyFromMagnitudeAndDirection(Math.abs(netInclinedX), direction);
}

function getForceNormal() {
  const magnitude = Math.abs(forceGravityInclined[Y]);
  const direction = 90 + planeAngleDeg;
  return xyFromMagnitudeAndDirection(magnitude, direction);
}

function convertToDegrees(radians) {
  return (radians / Math.PI) * 180;
}

function convertToRadians(degrees) {
  return (degrees / 180) * Math.PI;
}

function xyFromMagnitudeAndDirection(magnitudeNewtons, directionDeg) {
  const directionRad = convertToRadians(directionDeg);
  return [
    magnitudeNewtons * Math.cos(directionRad),
    magnitudeNewtons * Math.sin(directionRad),
  ];
}

function getInclinedXYComponents(xyComponents, planeInclineDeg) {
  const planeInclineRad = convertToRadians(planeInclineDeg);
  return [
    xyComponents[X] * Math.cos(planeInclineRad) +
      xyComponents[Y] * Math.sin(planeInclineRad),
    -xyComponents[X] * Math.sin(planeInclineRad) +
      xyComponents[Y] * Math.cos(planeInclineRad),
  ];
}
