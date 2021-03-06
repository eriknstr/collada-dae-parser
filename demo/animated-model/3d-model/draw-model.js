var matrixMultiply = require('../render/matrix-math/multiply.js')
var makeTranslation = require('../render/matrix-math/make-translation.js')

var vec3Normalize = require('gl-vec3/normalize')
var vec3Scale = require('gl-vec3/scale')

var mat3FromMat4 = require('gl-mat3/from-mat4')
var mat3Invert = require('gl-mat3/invert')
var mat3Transpose = require('gl-mat3/transpose')

module.exports = drawModel

function drawModel (gl, modelData, opts) {
  var modelMatrix = makeTranslation(opts.position[0], opts.position[1], opts.position[2])
  modelMatrix = matrixMultiply(modelMatrix, opts.viewMatrix)

  // Vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, modelData.vertexPositionBuffer)
  gl.vertexAttribPointer(modelData.shaderObj.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  // Vertex normals
  gl.bindBuffer(gl.ARRAY_BUFFER, modelData.vertexNormalBuffer)
  gl.vertexAttribPointer(modelData.shaderObj.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

  // vertex joints
  gl.bindBuffer(gl.ARRAY_BUFFER, modelData.affectingJointIndexBuffer)
  gl.vertexAttribPointer(modelData.shaderObj.jointIndexAttribute, 4, gl.FLOAT, false, 0, 0)

  // vertex joint weights
  gl.bindBuffer(gl.ARRAY_BUFFER, modelData.weightBuffer)
  gl.vertexAttribPointer(modelData.shaderObj.jointWeightAttribute, 4, gl.FLOAT, false, 0, 0)

  // lighting
  var lightingDirection = [1, -0.5, -1]
  var normalizedLD = []
  vec3Normalize(normalizedLD, lightingDirection)
  vec3Scale(normalizedLD, normalizedLD, -1)

  gl.uniform3f(modelData.shaderObj.ambientColorUniform, 0.5, 0.5, 0.5)
  gl.uniform3fv(modelData.shaderObj.lightingDirectionUniform, normalizedLD)
  gl.uniform3f(modelData.shaderObj.directionalColorUniform, 1.0, 1.0, 1.0)

  // Vertex weight
  for (var jointNum = 0; jointNum < opts.numJoints; jointNum++) {
    gl.uniformMatrix4fv(modelData.shaderObj['boneMatrix' + jointNum], false, opts.interpolatedJoints[jointNum])
    gl.uniform4fv(modelData.shaderObj['boneRotQuaternion' + jointNum], opts.rotationQuats[jointNum])
    gl.uniform4fv(modelData.shaderObj['boneTransQuaternion' + jointNum], opts.translationQuats[jointNum])
  }

  // Normal Matrices
  // TODO: Don't calculate normals using matrices, use dual quats
  for (var q = 0; q < opts.numJoints; q++) {
    // TODO: better name
    var jointNormalMatrix = []
    mat3FromMat4(jointNormalMatrix, opts.interpolatedJoints[q])
    mat3Invert(jointNormalMatrix, jointNormalMatrix)
    mat3Transpose(jointNormalMatrix, jointNormalMatrix)
    gl.uniformMatrix3fv(modelData.shaderObj['normalMatrix' + q], false, jointNormalMatrix)
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelData.vertexPositionIndexBuffer)

  gl.uniformMatrix4fv(modelData.shaderObj.pMatrixUniform, false, opts.perspectiveMatrix)
  gl.uniformMatrix4fv(modelData.shaderObj.mvMatrixUniform, false, modelMatrix)
  // Set light uniform
  var normalMatrix = []
  mat3FromMat4(normalMatrix, modelMatrix)
  mat3Invert(normalMatrix, normalMatrix)
  mat3Transpose(normalMatrix, normalMatrix)
  gl.uniformMatrix3fv(modelData.shaderObj.nMatrixUniform, false, normalMatrix)

  gl.drawElements(gl.TRIANGLES, modelData.numElements, gl.UNSIGNED_SHORT, 0)
}

