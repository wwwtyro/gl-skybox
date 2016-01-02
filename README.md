# gl-skybox

Draws a skybox into a 3D scene.

## Install

```sh
npm install gl-skybox
```

## Example

```js
var mat4 = require('gl-mat4')
var createCubemap = require('gl-cubemap-placeholder')
var createSkybox = require('gl-skybox')

var cubemap = createCubemap(gl, 512)
cubemap.generateMipmap()
cubemap.minFilter = gl.LINEAR_MIPMAP_LINEAR
cubemap.magFilter = gl.LINEAR

var skybox = createSkybox(gl, cubemap)

var view = mat4.create()
var projection = mat4.create()

mat4.lookAt(view, [0, 0, 0], [0, 0, -1], [0, 1, 0])
mat4.perspective(projection, Math.PI / 2, width/height, 0.1, 10.0)

skybox.draw({
  view: view,
  projection: projection
})

```

## API

```js
var createSkybox = require('gl-skybox')
```

### Constructor

#### `var skybox = createSkybox(gl, cubemap)`

Takes a WebGL context `gl` and a [gl-texture-cube](https://github.com/wwwtyro/gl-texture-cube)
object `cubemap`. Returns an object `skybox` ready for rendering into your
scene.

### Methods

#### `skybox.draw(camera)`

Draws the skybox into your scene.

Takes a `camera` object that defines the view and projection matrices:

```js
{
  view: gl-mat4 matrix,
  projection: gl-mat4 matrix
}
```

This function will take care of centering the skybox and projection near/far
values for you, so there is no need to make a view/projection matrix specifically
for rendering the skybox. It will also disable depth buffer read/writes and
then restore them to whatever you had them set to before returning, so there's
no need to handle that yourself.
