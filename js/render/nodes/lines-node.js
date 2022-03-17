// Copyright 2018 The Immersive Web Community Group
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { Material } from '../core/material.js';
import { Node } from '../core/node.js';
import { Primitive, PrimitiveAttribute } from '../core/primitive.js';

const GL = WebGLRenderingContext; // For enums

class LinesMaterial extends Material {
    constructor(options = { baseColor: [1, 0.5, 0, 1] }) {
        super();

        this.baseColor = this.defineUniform('baseColor', options.baseColor);
    }

    get materialName() {
        return 'LINES_MATERIAL';
    }

    get vertexSource() {
        return `
    attribute vec3 POSITION;

    vec4 vertex_main(mat4 proj, mat4 view, mat4 model) {
      return proj * view * model * vec4(POSITION, 1.0);
    }`;
    }

    get fragmentSource() {
        return `
    precision mediump float;

    uniform vec4 baseColor;

    vec4 fragment_main() {
      return baseColor;
    }`;
    }
}

export class LinesNode extends Node {
    constructor(options = {}) {
        super();
        if ((typeof options.VertexArray === 'undefined') || (typeof options.IndexArray === 'undefined')) {
            //this._ray_direction = [0, 0, -5];
            this._vertices = [0, 0, 0, 1, 1, 1];
            this._indices = [0, 1];
        }
        else {            
            this._vertices = options.VertexArray;
            this._indices = options.IndexArray;
        }

        this.material = new LinesMaterial(options);
    }

    onRendererChanged(renderer) {
        //this.ray_direction = this._ray_direction;
        //this.setPoints(this._p0, this._p1);
        this.setLines(this._vertices, this._indices);
    }

        
    setLines(vertices, indices) {
        if (this._vertices || this._indices) {
            this.clearRenderPrimitives();
        }
        
        this._vertices = vertices;
        this._indices = indices;
        
        let vertexBuffer = this._renderer.createRenderBuffer(GL.ARRAY_BUFFER, new Float32Array(this._vertices));
        let indexBuffer = this._renderer.createRenderBuffer(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices));

        let attribs = [
            new PrimitiveAttribute('POSITION', vertexBuffer, 3, GL.FLOAT, 12, 0),
        ];

        let primitive = new Primitive(attribs, this._indices.length, GL.LINES);
        primitive.setIndexBuffer(indexBuffer);

        let renderPrimitive = this._renderer.createRenderPrimitive(primitive, this.material);
        this.addRenderPrimitive(renderPrimitive);
    }
}