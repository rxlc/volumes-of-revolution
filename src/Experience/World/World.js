import * as THREE from 'three';
import Experience from "../Experience";
import { CSG } from 'three-csg-ts'

import Helpers from "./Helpers"


import { evaluateTex } from 'tex-math-parser'
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class World {
    constructor() {
        this.experience = new Experience();

        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;

        this.helpers = new Helpers();

        this.canvasReady = false;

        this.shapes = [];
        this.lights = [];
    
        this.latexes = [];

        this.lines = [];

        this.mat = 0;
        this.volume = 0;


        this.LB = 0;
        this.UB = 0;
        this.C = 0;
    }

    toggleMat(mat) {
        this.mat = mat;
        console.log(this.mat);
        if (this.latexes.length > 0) {
            try {
                this.makeShape(this.LB, this.UB, this.C)
            } catch(error) {
                console.log(error)
            }
        }
    }

    update() {
        if (this.experience.renderer.instance && this.canvasReady == false) {
            this.canvasReady = true
        }

        for (let i=0; i<this.shapes.length; i++) {
            this.shapes[i].shape.rotateY(this.shapes[i].rot)
        }
    }

    visualize(latexA, latexB, lowerBound, upperBound, cylinders) {
        this.latexes = [];

        if (latexA) this.latexes.push(latexA)
        if (latexB) {
            this.latexes.push(latexB)
        } else {
            this.latexes.push("0");
        }

        this.LB = lowerBound
        this.UB = upperBound
        this.C = cylinders

        if (this.latexes.length > 0) {
            try {
                this.graphLines(this.LB, this.UB)
                
                this.makeShape(this.LB, this.UB, this.C)
            } catch(error) {
                console.log(error)
            }
        }
    }

    graphLines(lowerBound, upperBound) {
        for (let i=0; i<this.lines.length; i++) {
            this.scene.remove(this.lines[i])
        }

        this.lines = [];

        for (let i=0; i<this.latexes.length; i++) {
            let material
            if (i == 0) material = new MeshLineMaterial({lineWidth: 0.01, color: 0xE7622F});
            if (i == 1) material = new MeshLineMaterial({lineWidth: 0.01, color: 0x48cae4});

            let points = [];
            for (let j=lowerBound; j<=upperBound; j+=0.1) {
                points.push(0, evaluateTex(this.latexes[i], {x:j}).evaluated, j);
            }

            let geo = new MeshLine()
            geo.setPoints(points.flat());
            let line = new THREE.Mesh(geo, material);

            this.lines.push(line);
            this.scene.add(line);
        }
    }

    upperLower(x) {
        let val1 = Math.abs(evaluateTex(this.latexes[0], {x:x}).evaluated)
        let val2 = Math.abs(evaluateTex(this.latexes[1], {x:x}).evaluated)

        if (val1 > val2) {
            return {upper: this.latexes[0], lower: this.latexes[1]}
        } else {
            return {upper: this.latexes[1], lower: this.latexes[0]}
        }
    }

    makeShape(lowerBound, upperBound, cylinders) {
        this.volume = 0;

        let material;

        if (this.mat == 0) {
            material = new THREE.MeshStandardMaterial( {color: 0x9a8c98} );
        } else {
            material = new THREE.MeshBasicMaterial( {color: 0x9a8c98, transparent: true, wireframe: true, opacity: 0.7} );
        }   

        let height = (upperBound-lowerBound)/cylinders

        for (let i=0; i<this.shapes.length; i++) {
            this.scene.remove(this.shapes[i].shape);
        }

        for (let i=0; i<this.lights.length; i++) {
            this.scene.remove(this.lights[i])
        }

        this.shapes = [];
        this.lights = [];
        let index = 0;

        for (let i=lowerBound; i<=upperBound; i+=height) {
            if (i != lowerBound) {
                let upperLatex = this.upperLower(i).upper;
                let lowerLatex = this.upperLower(i).lower;

                let radiusU = Math.abs(evaluateTex(upperLatex, {x:i}).evaluated);
                let geometryU = new THREE.CylinderGeometry( radiusU, radiusU, height, 24 );
                let cylinderU = new THREE.Mesh( geometryU, material );

                let radiusL = Math.abs(evaluateTex(lowerLatex, {x:i}).evaluated);
                let geometryL = new THREE.CylinderGeometry( radiusL, radiusL, height, 24 );
                let cylinderL = new THREE.Mesh( geometryL, material );

                const upperCSG = CSG.fromMesh(cylinderU);
                const lowerCSG = CSG.fromMesh(cylinderL);

                const subtractCSG = upperCSG.subtract(lowerCSG);
                const result = CSG.toMesh(subtractCSG, cylinderU.matrix);

                result.rotateZ(Math.PI/2);
                result.rotateX(Math.PI/2);
        
                result.position.z += (height/2) + i-height;
                result.material = material;

                this.volume += Math.PI * Math.pow(radiusU,2) * height
                this.volume -= Math.PI * Math.pow(radiusL,2) * height
                
                let rot = 0;
                if (this.mat == 2) {
                    rot = 1/radiusU * 0.003
                    if (index % 2 == 0) rot *= -1
                }

                this.shapes.push({shape: result, rot});
                this.scene.add(result);
                index++;
            }
        }

        if (this.mat == 0) {
            const directionLight1 = new THREE.DirectionalLight(0xffffff, 1.5) //color, intensity
            directionLight1.position.set(-14.182411522639413,7.66174323813831, 8);
            directionLight1.lookAt(this.shapes[0].shape);

            const directionLight2 = new THREE.DirectionalLight(0xffffff, 1.5) //color, intensity
            directionLight2.position.set(14.182411522639413,7.66174323813831, -3.59387172383304);
            directionLight2.lookAt(this.shapes[0].shape);
            this.lights.push(directionLight1);
            this.scene.add(directionLight1); 
            this.lights.push(directionLight2);
            this.scene.add(directionLight2); 
        }
        
    }

    getVolume() {
        return Math.floor(this.volume*100)/100;
    }
}
