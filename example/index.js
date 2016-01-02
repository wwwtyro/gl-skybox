'use strict'

/* global requestAnimationFrame */

var bunny = require('bunny')
var mat4 = require('gl-mat4')
var createCubemap = require('gl-cubemap-placeholder')
var Geometry = require('gl-geometry')
var glShader = require('gl-shader')
var glslify = require('glslify')
var normals = require('normals')

var createSkybox = require('../index.js')

window.onload = function () {
  var canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.left = '0px'
  canvas.style.top = '0px'
  canvas.style.width = canvas.style.height = '100%'
  document.body.appendChild(canvas)

  var gl = canvas.getContext('webgl')
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  console.log(bunny)
  var bunnyGeom = Geometry(gl)
  bunnyGeom.attr('aPosition', bunny.positions)
  bunnyGeom.attr('aNormal', normals.vertexNormals(bunny.cells, bunny.positions))
  bunnyGeom.faces(bunny.cells)

  var bunnyProgram = glShader(gl, glslify('./bunny.vert'), glslify('./bunny.frag'))

  var cubemap = createCubemap(gl, 512)
  cubemap.generateMipmap()
  cubemap.minFilter = gl.LINEAR_MIPMAP_LINEAR
  cubemap.magFilter = gl.LINEAR

  var skybox = createSkybox(gl, cubemap)

  var model = mat4.create()
  var view = mat4.create()
  var projection = mat4.create()

  gl.clearColor(1, 0, 1, 1)

  var tick = 0

  function render () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    tick += 0.01
    var r = (Math.sin(tick * 3) + 1.0) * 64.0 + 8.0
    mat4.lookAt(view, [Math.cos(tick) * r, Math.cos(tick * 2) * r + 4, Math.sin(tick) * r], [0, 4, 0], [0, 1, 0])
    mat4.perspective(projection, Math.PI / 2, canvas.width / canvas.height, 0.1, 200.0)

    skybox.draw({
      view: view,
      projection: projection
    })

    bunnyProgram.bind()
    bunnyGeom.bind(bunnyProgram)
    bunnyProgram.uniforms.uModel = model
    bunnyProgram.uniforms.uView = view
    bunnyProgram.uniforms.uProjection = projection
    bunnyGeom.draw()

    requestAnimationFrame(render)
  }

  render()
}
