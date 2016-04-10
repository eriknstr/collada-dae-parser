var fs = require('fs')
var dae2json = require('../../../')

module.exports = LoadModel

// TODO: clean up
function LoadModel (gl, callback) {
  // TODO: Read using xhr request
  dae2json(fs.readFileSync('./demo/assets/two-skinned-cubes.dae'), function (err, parsedDae) {
    if (err) { callback(err) }

    var vertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedDae.vertexPositions), gl.STATIC_DRAW)

    var vertexPositionIndexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexPositionIndexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parsedDae.vertexPositionIndices), gl.STATIC_DRAW)

    // TODO: naming
    var vertexJointAffectors = []
    var vertexJointWeights = []
    // Handle weights (this model has only one joint/weight per vertex)
    // TODO: Should the consumer be expected to know the max # joints/weights per vertex?
    parsedDae.vertexJointWeights.forEach(function (jointsAndWeights) {
      var jointIndex = Object.keys(jointsAndWeights)[0]
      vertexJointAffectors.push(Number(jointIndex))
      vertexJointWeights.push(jointsAndWeights[jointIndex])
    })

    // Joints the affect each vertex
    // TODO: naming
    var affectingJointIndexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, affectingJointIndexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexJointAffectors), gl.STATIC_DRAW)

    // Weights of affecting joints
    // TODO: naming
    var weightBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, weightBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexJointWeights), gl.STATIC_DRAW)

    var stuff = {
      vertexPositionBuffer: vertexPositionBuffer,
      vertexPositionIndexBuffer: vertexPositionIndexBuffer,
      affectingJointIndexBuffer: affectingJointIndexBuffer,
      weightBuffer: weightBuffer,
      keyframes: parsedDae.keyframes
    }
    callback(null, stuff)
  })
}
