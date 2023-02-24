import nerdamer, { set } from 'nerdamer';
import 'nerdamer/Solve';

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
    
        this.latexes = [];

        this.lines = [];
    }

    update() {
        if (this.experience.renderer.instance && this.canvasReady == false) {
            this.canvasReady = true
        }
    }

    visualize(latexA, latexB, lowerBound, upperBound, cylinders) {
        this.latexes = [];

        if (latexA) this.latexes.push(latexA)
        if (latexB) this.latexes.push(latexB)

        if (this.latexes.length > 0) {
            try {
                this.graphLines(lowerBound, upperBound)
                
                this.makeShape(lowerBound, upperBound, cylinders)
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

    makeSections(lowerBound, upperBound, cylinders) {
        let parsed1 = nerdamer.convertFromLaTeX(this.latexes[0])
        let parsed2 = nerdamer.convertFromLaTeX(this.latexes[1])

        let equation = `${parsed1} - (${parsed2})`

        nerdamer.set('SOLUTIONS_AS_OBJECT', true)
        let solutions = nerdamer.solveEquations(equation,'x');

        let intersects = [upperBound];
        
        for (const sol in solutions) {
            let val = solutions[sol].multiplier.num/solutions[sol].multiplier.den
            if (val > lowerBound && val < upperBound) {
                let allowed = true;

                for (let i=0; i<intersects.length; i++) {
                    if (Math.abs(intersects[i] - val) < (upperBound-lowerBound)/cylinders) {
                        allowed = false;
                    }
                }
               
                if (allowed) intersects.push(val);
            }
        }

        let sections = [];

        let start = lowerBound;
        for (let i=0; i<intersects.length; i++) {
            sections.push({start, end: intersects[i]})
            start = intersects[i];
        }

        console.log(sections)
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
        const material = new THREE.MeshBasicMaterial( {color: 0x9a8c98, transparent: true, wireframe: true, opacity: 0.7} );
        let height = (upperBound-lowerBound)/cylinders

        for (let i=0; i<this.shapes.length; i++) {
            this.scene.remove(this.shapes[i]);
        }

        this.shapes = [];

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

                this.shapes.push(result)
                this.scene.add(result);

            }
        }
    }
}