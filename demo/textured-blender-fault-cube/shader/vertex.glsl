attribute vec3 aVertexPosition;
attribute vec2 aWeight;

attribute float aJointIndex;
attribute float aJointWeight;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrices[2];

void main (void) {
  mat4 jointMatrix;
  if (aJointIndex < 1.0) {
    jointMatrix = boneMatrices[0];
  } else if (aJointIndex < 2.0) {
    jointMatrix = boneMatrices[1];
  }
  // We only have one index right now... so the weight is always 1.
  gl_Position = uPMatrix * uMVMatrix * jointMatrix * aJointWeight * vec4(aVertexPosition, 1.0);
}