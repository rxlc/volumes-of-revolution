import * as THREE from 'three';
import Experience from "./Experience";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';

export default class Camera {
    constructor() {
        this.experience = new Experience();

        this.sizes = this.experience.sizes
        this.scene = this.experience.scene

        this.stoppedArEvent = new CustomEvent("stoppedAr")

        this.canvasReady = false;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(-14.206159419738277, 7.568450967915513, -3.6962960513546386);
        this.instance.lookAt(new Vector3(5,0,0))
        this.scene.add(this.instance);
    }

    setOrbit() {
        this.controls = new OrbitControls(this.instance, this.experience.containerRef.current);
        this.controls.enableDamping = true;

        this.controls.addEventListener("start", () => {
            if (this.controls.autoRotate) {
                document.dispatchEvent(this.stoppedArEvent)
            }
        })
    }

    update() {
        if (this.experience.renderer.instance && this.canvasReady === false) {
            this.setOrbit();
            this.controls.domElement.style.width = `${this.experience.renderer.instance.domElement.clientWidth}px`
            this.controls.domElement.style.height = `${this.experience.renderer.instance.domElement.clientHeight}px`
            this.canvasReady = true;
        }

        this.sizes.on('resize', () => {
            this.resize();
        });

        if (this.canvasReady) {
            this.controls.update();
        }
    }

    resize() {
        this.controls.domElement.style.width = `${this.experience.renderer.instance.domElement.clientWidth}px`
        this.controls.domElement.style.height = `${this.experience.renderer.instance.domElement.clientHeight}px`
        this.instance.aspect = this.sizes.width/this.sizes.height
        this.instance.updateProjectionMatrix();
    }


}