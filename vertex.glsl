out vec2 vUv;

void main() {
    vUv = uv; // Pass texture coordinates
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}