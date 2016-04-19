attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aWeight;

attribute vec4 aJointIndex;
attribute vec4 aJointWeight;

uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform mat3 uNMatrix;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 boneMatrices[5];

varying vec3 vLightWeighting;

void main (void) {
  // Select joint matrix for this vertex
  mat4 jointMatrix[4];
  mat4 weightedJointMatrix;

  for (int i = 0; i < 5; i++) {
    if (aJointIndex.x == float(i)) {
      jointMatrix[0] = boneMatrices[i];
    }
    if (aJointIndex.y == float(i)) {
      jointMatrix[1] = boneMatrices[i];
    }
    if (aJointIndex.z == float(i)) {
      jointMatrix[2] = boneMatrices[i];
    }
    if (aJointIndex.w == float(i)) {
      jointMatrix[3] = boneMatrices[i];
    }
  }

  weightedJointMatrix += jointMatrix[0] * aJointWeight.x;
  weightedJointMatrix += jointMatrix[1] * aJointWeight.y;
  weightedJointMatrix += jointMatrix[2] * aJointWeight.z;
  weightedJointMatrix += jointMatrix[3] * aJointWeight.w;

  // Lighting
  vec3 transformedNormal = uNMatrix * aVertexNormal;
  float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
  vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;

  // Blender uses a right handed coordinate system. We convert to left handed here
  vec4 leftWorldSpace = weightedJointMatrix * vec4(aVertexPosition, 1.0);
  float y = leftWorldSpace.z;
  float z = -leftWorldSpace.y;
  leftWorldSpace.y = y;
  leftWorldSpace.z = z;

  // TODO: Is that even called world space?
  vec4 leftHandedPosition = uPMatrix * uMVMatrix * leftWorldSpace;

  // We only have one index right now... so the weight is always 1.
  gl_Position = leftHandedPosition;
}
