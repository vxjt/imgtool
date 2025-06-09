import * as heh from './heh.js'
import * as THREE from 'three'

import fragment from './fragment.glsl?raw'
import vertex from './vertex.glsl?raw'

//three init
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector(`#canvas`)
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate)

const loader = new THREE.TextureLoader()

let aspect = window.innerWidth / window.innerHeight
let aspect_image = 1

const camera = new THREE.OrthographicCamera(-aspect, aspect)
camera.position.z = 1
const scene = new THREE.Scene()

let uniform = {
	test: {value: 0.4},
	tex: {value: 0}
}

//scene init
const geometry = new THREE.PlaneGeometry()
const material = new THREE.ShaderMaterial({
		uniforms: uniform,
		vertexShader: vertex,
		fragmentShader: fragment
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//events
window.addEventListener(`dragover`, (e) => {
	e.preventDefault()
})

window.addEventListener(`drop`, (e) => {
	e.preventDefault()
	const types = ["image/png", "image/jpeg", "image/webp"]
	if(types.includes(e.dataTransfer.items[0].type)) {
		const blob = URL.createObjectURL(e.dataTransfer.items[0].getAsFile())
		uniform['tex'].value = loader.load(blob, (t) => {
			updateimageaspect(t)
			camera.zoom = 1
			camera.position.x = 0
			camera.position.y = 0
			camera.updateProjectionMatrix()
			URL.revokeObjectURL(blob)
		})
	} else {
		console.log(`cannot load ${e.dataTransfer.items[0].type}`)
	}
})

window.addEventListener(`mousemove`, (e) => {
	if(e.buttons === 1) {
		camera.position.x -= e.movementX * (camera.right - camera.left) / window.innerWidth / camera.zoom
		camera.position.y += e.movementY * (camera.right - camera.left) / window.innerWidth / camera.zoom
		camera.updateProjectionMatrix()
	}
})

window.addEventListener(`pointerdown`, (e) => {
	if (e.buttons === 4) {
		camera.zoom = 1
		camera.position.x = 0
		camera.position.y = 0
		camera.updateProjectionMatrix()
	}
})

window.addEventListener(`resize`, () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	aspect = window.innerWidth / window.innerHeight
	camera.left = -aspect
	camera.right = aspect
	camera.top = 1
	camera.bottom = -1
	camera.updateProjectionMatrix()
})

window.addEventListener(`wheel`, (e) => {
	e.preventDefault()
	camera.zoom *= e.deltaY > 0 ? 0.95 : 1.05
	camera.updateProjectionMatrix()
}, {passive: false})

//routines
function animate() {
	renderer.render(scene, camera)
}

function updateimageaspect(t) {
	if(mesh.geometry) {
		aspect_image = t.image.width / t.image.height
		mesh.scale.set(aspect_image, 1, 1)
	}
}