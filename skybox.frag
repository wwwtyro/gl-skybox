#define SHADER_NAME skybox.frag

precision highp float;

uniform samplerCube uTexture;

varying vec3 vNorm;

void main() {
    gl_FragColor = textureCube(uTexture, vNorm);
}
