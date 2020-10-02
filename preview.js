/*
 *	MIT License
 *
 *	Copyright (c) 2020 xyzzy@rockingship.org
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *	SOFTWARE.
 */

"use strict";

const nodeCanvas = require("canvas");
const fs = require("fs")

const width = 320;
const height = 180;

/*
 * create the canvas
 */
const canvas = nodeCanvas.createCanvas(width, height)
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d")

/*
 * generate the palette
 */
const palr = new Array(256);
const palg = new Array(256);
const palb = new Array(256);
for (let x = 0; x < 256; x++) {
	palr[x] = Math.round(128.0 + 128 * Math.sin(Math.PI * x / 32.0));
	palg[x] = Math.round(128.0 + 128 * Math.sin(Math.PI * x / 64.0));
	palb[x] = Math.round(128.0 + 128 * Math.sin(Math.PI * x / 128.0));
}

/*
 * Draw/paint
 */

let time = 100; // animation time `t`

/*
 * Script preamble
 */
const w = width, h = height;
const aspect = width / height;
const cos = Math.cos, sin = Math.sin, tan = Math.tan, sqrt = Math.sqrt, PI = Math.PI;

let _x0 = -0.5, _dx = 1 / w, _y0 = -0.5, _dy = 1 / h;
if (w > height) {
	_x0 *= aspect;
	_dx *= aspect;
} else {
	_y0 /= aspect;
	_dy /= aspect;
}

/*
 * Execute
 */

// get image
const img = ctx.getImageData(0, 0, width, height);
const _d = img.data;

// update image
let _i = 0;
for (let _y = 0, y = _y0; _y < h; _y++, y += _dy) {
	for (let _x = 0, x = _x0; _x < w; _x++, x += _dx) {
		// code snippet 1
		const v1 = sin(x * 10 + time / 55);
		// code snippet 2
		const v2 = sin(10 * (x * sin(time / 77) + y * cos(time / 144)) + time / 113);
		// code snippet 3
		const cx = x + .5 * sin(time / 200);
		const cy = y + .5 * cos(time / 131);
		const v3 = sin(sqrt(100 * (cx * cx + cy * cy)) + time / 57);

		// set pixel
		const v = Math.round(128 + 127 * (v1 + v2 + v3) / 3);
		_d[_i++] = palr[v];
		_d[_i++] = palg[v];
		_d[_i++] = palb[v];
		_d[_i++] = 255;
	}
}

// update image
ctx.putImageData(img, 0, 0);

/*
 * save
 */
let buffer = canvas.toBuffer('image/png')
fs.writeFileSync('preview.png', buffer)
