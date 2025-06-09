in vec2 vUv;
uniform sampler2D tex;
uniform float test;

float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

void main() {
    vec2 st = gl_FragCoord.xy / 1000.0;
    gl_FragColor = texture2D(tex, vUv);
    //gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}