'use strict'

var mat4 = require('gl-mat4')
var Box3D = require('geo-3d-box')
var Geometry = require('gl-geometry')
var glShader = require('gl-shader')
var glslify = require('glslify')
var createStack = require('gl-state')

module.exports = createSkybox

function Skybox (gl, cubemap) {
  var box = Box3D({size: 2})
  box = Geometry(gl)
    .attr('aPosition', box.positions)
    .faces(box.cells)

  var program = glShader(gl, glslify('./skybox.vert'), glslify('./skybox.frag'))

  var stack = createStack(gl, [
    gl.DEPTH_TEST,
    gl.DEPTH_WRITEMASK,
    gl.CULL_FACE_MODE,
    gl.CULL_FACE
  ])

  this.draw = function (camera) {
    // Store the gl state.
    stack.push()

    // Enable front face culling.
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.FRONT)

    // Disble depth test & write.
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)

    // Remove translation from the view matrix.
    var view = new Float32Array(camera.view)
    mat4.invert(view, view)
    view[12] = view[13] = view[14] = 0.0
    mat4.invert(view, view)

    // Set the projection near/far to 0.1/10.
    var projection = new Float32Array(camera.projection)
    projection[10] = -1.0202020406723022
    projection[14] = -0.20202019810676575

    // Render the skybox.
    program.bind()
    box.bind(program)
    program.uniforms.uTexture = cubemap.bind(0)
    program.uniforms.uView = view
    program.uniforms.uProjection = projection
    box.draw()

    // Restore the gl state.
    stack.pop()
  }
}

function createSkybox (gl, cubemap) {
  return new Skybox(gl, cubemap)
}
