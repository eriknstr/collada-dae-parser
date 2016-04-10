var fs = require('fs')
var path = require('path')

var test = require('tape')

var colladaFilePath = path.resolve(__dirname, './fixture/textured-blender-default-cube.dae')
var tbdcColladaXML = fs.readFileSync(colladaFilePath).toString('utf8')
var expectedTBDC = require('./expected/textured-blender-default-cube.js')

var blenderCubeAmimatedPath = path.resolve(__dirname, './fixture/animated-blender-cube.dae')
var animatedColladaXML = fs.readFileSync(blenderCubeAmimatedPath).toString('utf8')
var expectedAnimatedCube = require('./expected/animated-blender-cube.js')

var skeletonSkinnedCubesPath = path.resolve(__dirname, './fixture/two-skinned-cubes.dae')
var skeletonSkinnedCubesXML = fs.readFileSync(skeletonSkinnedCubesPath).toString('utf8')
var expectedSkinnedCube = require('./expected/two-skinned-cube.js')

var parseCollada = require('../')

test('Parse a default blender cube with an added texture', function (t) {
  t.plan(1)
  parseCollada(tbdcColladaXML, function (err, parsedCube) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedCube, expectedTBDC)
  })
})

test('Parse a default blender cube with an animation', function (t) {
  t.plan(1)
  parseCollada(animatedColladaXML, function (err, parsedAnimatedCube) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedAnimatedCube, expectedAnimatedCube)
  })
})

test('Parse two blender cubes animated with bones and skinning', function (t) {
  t.plan(1)
  parseCollada(skeletonSkinnedCubesXML, function (err, parsedSkeletonSkinnedCubes) {
    if (err) {
      t.fail()
    }
    t.deepEqual(parsedSkeletonSkinnedCubes, expectedSkinnedCube)
    t.end()
  })
})