/// <reference path="../TSDef/p5.global-mode.d.ts" />

const DEBUG_CONTROLLERS = 'true';
let DEBUG_FRAME = false; // Frame profiler, set to a number of frames to profile (high number = very laggy)

// Variables used across multiple shapes
const shared = {
	width: 1024,
	height: 576,
	mouseCursor: undefined
};

function setup() {
	funcRemaping();

	createCanvas(shared.width, shared.height);
}

function draw() {
	shared.mouseCursor = ARROW;

	layer(-50);
	drawSky({
		stars: { count: 15, brightness: .4, size: 3, skyHeight: .3 },
		glare: { pos: vec(1, .4), strength: 3, brightness: .15 },
		mist: {},
		fog: { height: .5, density: .3 }
	});

	layer(10);
	drawGround({
		height: .18,
		grass: {
			gapDensity: 120, height: .45, heightVariation: .25, borderHeight: .1,
			sections: [ [0, .135], [.215, 1]]
		}
	});


	//1. a cloud in the sky
	layer(-30);
	fill(177, 169, 185);
	ellipse(147, 223, 50, 42);
	ellipse(225, 237, 52, 48);
	ellipse(181, 235, 56, 42);
	
	fill(215, 208, 221);
	ellipse(153, 217, 50, 36);
	ellipse(226, 231, 54, 44);
	ellipse(182, 231, 52, 26);
	ellipse(214, 194, 64, 72);
	ellipse(294, 222, 54, 50);
	ellipse(265, 229, 58, 52);
	ellipse(247, 199, 60, 36);
	ellipse(176, 204, 54, 36);

	//2. a mountain in the distance
	layer(-31); fill(69, 60, 89);
	polygon(513,207, 599,250, 646,282, 672,292, 829,396, 213,402, 407,265, 435,259);
	layer(-30); fill(241, 196, 188);
	polygon(513,207, 599,250, 646,282, 672,292, 775,362, 547,399, 486,314, 491,282, 593,331, 563,269, 504,214);

	layer(-28); fill(69, 60, 89);
	polygon(719,315, 763,332, 1019, 505, -180, 546, 622,362);
	layer(-27); fill(241, 196, 188);
	polygon(719,315, 763,332, 1019,505, 691,547, 734,357, 731,329);

	layer(-25); fill(69, 60, 89);
	polygon(299, 302, 613, 469, 10, 466);
	layer(-24); fill(241, 196, 188);
	polygon(303, 304, 560, 447, 322, 461, 323, 332);

	layer(-22); fill(69, 60, 89);
	polygon(434,374, 455,375, 483,397, 623,461, 251,463);
	layer(-21); fill(241, 196, 188);
	polygon(453,375, 483,397, 830,555, 459,561, 468,402, 456, 383);
	
	//3. a tree
	layer(-11); fill(47, 48, 69);
	triangle(26,241, -16,395, 63,413);
	layer(-9); fill(47, 48, 69);
	triangle(82,301,  49,420, 109,433);
	layer(-11); fill(47, 48, 69);
	triangle(122,361, 140,432, 107,422);
	layer(-9); fill(47, 48, 69);
	triangle(138,450, 172,322, 207,465);
	layer(-10); fill(62, 62, 84);
	spline(602, 583, 411, 508, 132, 428, -92, 403, -19, 609);

	layer(-4); fill(82, 78, 99);
	triangle(820,491, 867,283, 911,470);
	layer(-6); fill(82, 78, 99);
	triangle(924,446, 955,303, 990,432);
	layer(-5); fill(94, 91, 111);
	spline(636, 518, 1050, 425, 1182, 572, 267, 644);

	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen
	layer(11);
	fill(0, 0, 0, 255*.2);
	quad(140, shared.height * (1-.18), 220, shared.height * (1-.18), 240, shared.height, 110, shared.height);
	spline(170, 542, 220, 502, 240, 576, 240, 576, 116, 574);
	spline(199, 552, 230, 546, 240, 573, 240, 573, 185, 576);

	//5. a collectable token - eg. a jewel, fruit, coins
	layer(0);
	gem(vec(731, 423), 80);
	gem(vec(671, 423), 200);
	gem(vec(611, 423), 40);
	gem(vec(551, 423), 20);

	cursor(shared.mouseCursor);
}

function drawSky({
	stars: { count: starCount, brightness: starBrightness, size: starSize, skyHeight: starSkyHeight },
	glare: { pos: glarePos, strength: glareStrength, brightness: glareBrightness },
	mist: { },
	fog: { density: fogDensity, height: fogHeight }
}) {

	// base color
	background(21, 27, 51); //fill the sky blue

	{ // Stars
		if (!globalThis.stars) {
			const stars = [];
			for (let i = 0; i < starCount; i++) {
				stars.push(vec(random(shared.width), random(shared.height * starSkyHeight)));
			}
			globalThis.stars = stars;
		}

		strokeWeight(starSize);
		stroke(255 * starBrightness);
		for (const star of globalThis.stars) {
			point(star.x, star.y);
		}
	}


	{ // Glare
		const glareColor = color(255, 255, 255);
		const middlePoint = glareStrength / (glareStrength + 1);
		const opacity = 255 * glareBrightness;
		noStroke();
		rectRadGradient(vec(0, 0), vec(shared.width, shared.height),
			{ 0: setAlpha(glareColor, opacity), [middlePoint]: setAlpha(glareColor, opacity * .5), 1: setAlpha(glareColor, 0) },
			vec(shared.width * glarePos.x, shared.height * glarePos.y));
	}

	// Gleam

	// Mist

	{ // Fog
		// const opacity = fogDensity * 255;
		// noStroke();
		// rectGradient(
		// 	vec(0, shared.height * (1-fogHeight)), vec(shared.width, shared.height * fogHeight),
		// 	{ 0.63: color(255, 220, 255, opacity), .9: color(255, 220, 255, opacity*.3), 1: color(255, 220, 255, opacity*.05) }
		// );
	}
}

function drawGround({
	height,
	grass: {
		gapDensity: grassGapDensity, heightVariation: grassHeightVariation,
		height: grassHeight, borderHeight: grassBorderHeight, sections: grassSections
	}
}) {

	noStroke();

	const origin = vec(0, shared.height * (1 - height));
	const size = vec(shared.width, shared.height * height);

	// Base dirt
	// fill(117, 58, 35);
	fill(85, 66, 59);
	rect(origin.x, origin.y, size.x, size.y); //draw some green ground

	{ // Grass
		const borderHeight = shared.height * grassBorderHeight * height;
		const heightVariation = shared.height * grassHeightVariation * height;
		const gapDelta = shared.width / grassGapDensity;
		const yBase = shared.height * (1 - height * (1 - grassHeight));

		// Compute border variations
		if (!globalThis.grassBorder) {
			const borderSections = [];
			for (const section of grassSections) {
				const start = min(section[0], section[1]);
				const span = abs(section[1] - section[0]);
				const gapCount = ceil(span * grassGapDensity); //+1
				const gapSize = span / gapCount;
				const offset = floor(start * grassGapDensity);
				
				const points = [];
				for (let i = 0; i <= gapCount; ++i) {
					const yOffset = noise(offset+i, yBase) - .5;
					points.push(vec((start + i * gapSize)*shared.width, yBase + yOffset * heightVariation));
				}
				borderSections.push(points);
			}
			globalThis.grassBorder = borderSections;
			console.log(borderSections);
		}

		/**
		 * @type {p5.Vector[][]}
		 */
		const grassBorder = globalThis.grassBorder;
		const addVertex = (point, offset = 0) => curveVertex(point.x - (offset.x || 0), point.y - (offset.y || offset));

		for (const grassPoints of grassBorder) {
			push();
			layer(layer()+5);

			// Draw Grass
			// fill(83, 157, 68);
			// fill(52, 99, 42);
			fill(74, 99, 69);
			beginShape();
			addVertex(vec(grassPoints[0].x, origin.y-1));
			addVertex(vec(grassPoints[0].x, origin.y-1));
			grassPoints.forEach(p => addVertex(p, borderHeight - 1));
			addVertex(vec(grassPoints[grassPoints.length-1].x, origin.y-1));
			addVertex(vec(grassPoints[grassPoints.length-1].x, origin.y-1));
			endShape();

			layer(layer()+5);

			// Draw shadow
			fill(0, 0, 0, 50);
			beginShape();
			// addVertex(grassPoints[0]);
			grassPoints.forEach(p => addVertex(p, vec(gapDelta * .3, -borderHeight * .3)));
			grassPoints.forReverse(p => addVertex(p, vec(gapDelta * .3, borderHeight * .7)));
			addVertex(grassPoints[0]);
			endShape();
			
			// Draw border
			// fill(77, 145, 63);
			// fill(47, 89, 38);
			fill(65, 89, 60);
			beginShape();
			// addVertex(grassPoints[0]); // Technically correct, artistically removed
			grassPoints.forEach(p => addVertex(p));
			grassPoints.forReverse(p => addVertex(p, borderHeight));
			addVertex(grassPoints[0]);
			endShape();

			pop();
		}
	}

	{ // Dirt

	}
}

/**
 * Draws a gem at the given position
 * 
 * @param {p5.Vector} pos 
 * @param {number} hue 
 */
function gem(pos, hue = 48) {
	push();
	colorMode(HSB);
	translate(pos.x, pos.y);
	scale(.13);
	fill(hue, 100, 77); triangle(-113, 0, -74, 0, 0, 187);
	fill(hue, 96, 87); triangle(-74, 0, -31, 0, 0, 187);
	fill(hue, 98, 82); triangle(-113, 0, 0, -188, -74, 0);
	fill(hue, 96, 92); triangle(0, -188, -31, 0, -74, 0);
	fill(hue, 99, 99); triangle(0, -188, 30, 0, -31, 0);
	fill(hue, 60, 98); triangle(0, -188, 73, 0, 30, 0);
	fill(hue, 40, 99); triangle(0, -188, 114, 0, 73, 0);
	fill(hue, 96, 92); triangle(-31, 0, 30, 0, 0, 187);
	fill(hue, 40, 99); triangle(30, 0, 73, 0, 0, 187);
	fill(hue, 60, 98); triangle(73, 0, 114, 0, 0, 187);
	pop();
}

/// Utility functions

/**
 * See the polyfill implementation of forEach in mdn web docs
 * https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#polyfill
 * 
 * @param {(value: any, index: number, array: any[]) => void} callback
 * @param {any} thisArg
 * @returns {void}
 */
Array.prototype.forReverse = function (callback, thisArg) {

	var T = arguments.length >= 2 ? thisArg : undefined;
	var kValue, O = Object(this), len = O.length >>> 0;

	let k = len;
	while (k-- > 0) {
		if (k in O) {
			kValue = O[k];
			callback.call(T, kValue, k, O);
		}
	}
};

/**
 * Creates a shorthand for some functions,
 * and adds sorting layers
 */
function funcRemaping() {
	globalThis.vec = createVector;

	// I really wanted to have layers...
	//#region Sorting Layers
	globalThis.renderQueue = {};
	globalThis.layerStack = [0];

	globalThis.layer = (layer) => {
		if (layer === undefined) return globalThis.layerStack[0];
		if (globalThis.lastDrawCall?.name === 'push') {
			// Special case, need to move the push command to the new layer
			const currLayer = globalThis.layerStack[0];
			const pushCall = globalThis.renderQueue[currLayer].pop();
			(globalThis.renderQueue[layer] || (globalThis.renderQueue[layer] = [])).push(pushCall);
		}

		globalThis.layerStack[0] = layer;
		globalThis.lastDrawCall = null;
	};

	const enqueue = (fnName) => {
		const fnRef = globalThis[fnName];
		return function() {
			const layer = globalThis.layerStack[0];
			const drawCall = { name: fnName, fn: fnRef, args: [...arguments] };
			(globalThis.renderQueue[layer] || (globalThis.renderQueue[layer] = [])).push(drawCall);
			globalThis.lastDrawCall = drawCall;
		};
	};

	['background', 'clear', 'colorMode', 'fill', 'noFill', 'noStroke', 'stroke',
		'arc', 'ellipse', 'line', 'point', 'quad', 'rect', 'triangle',
		'ellipseMode', 'noSmooth', 'rectMode', 'smooth', 'strokeCap', 'strokeJoin', 'strokeWeight',
		'bezier', 'bezierDetail', 'bezierPoint', 'bezierTangent', 'curveDetail', 'curveTightness', 'curvePoint', 'curveTangent',
		'beginContour', 'beginShape', 'bezierVertex', 'curveVertex', 'endContour', 'endShape', 'quadraticVertex', 'vertex',
		'applyMatrix', 'resetMatrix', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'shearX', 'shearY', 'translate',
		'textAlign', 'textLeading', 'textSize', 'textStyle', 'textWidth', 'textAscent', 'textDescent', 'textWrap', 'text', 'textFont', 
	].forEach(fnName => globalThis[fnName] = enqueue(fnName));

	const oldPush = enqueue('push');
	globalThis.push = function() {
		globalThis.layerStack.unshift(globalThis.layerStack[0]);
		oldPush.bind(this)();
	};

	const oldPop = enqueue('pop');
	globalThis.pop = function() {
		oldPop.bind(this)();
		globalThis.layerStack.shift();
	};

	const flushRenderQueue = () => {
		if (!globalThis.renderQueue) return;

		Object.keys(globalThis.renderQueue).sort((a, b) => (+a) - (+b))
			.forEach(key => {
				if (DEBUG_FRAME)
					console.groupCollapsed(`Layer ${key}`);
				const renderLayer = globalThis.renderQueue[key]; // FIFO queue
				renderLayer.forEach(drawCall => {
					if (DEBUG_FRAME)
						console.log(`${drawCall.name}(${(drawCall.args || []).map(a => a.toString()).join(', ')})`);
					return drawCall.fn(...drawCall.args);
				});
				delete globalThis.renderQueue[key];
				if (DEBUG_FRAME)
					console.groupEnd();
			});
	};

	let frameCount = 0;
	const oldDraw = globalThis.draw;
	globalThis.draw = function () {
		oldDraw.bind(this)();
		if (DEBUG_FRAME)
			console.groupCollapsed(`Frame ${frameCount}`);
		flushRenderQueue();
		if (DEBUG_FRAME) {
			console.groupEnd();
			--DEBUG_FRAME;
		}
		++frameCount;
	};
	//#endregion
}

/**
 * Creates a copy of a color,
 * with the given alpha value
 * 
 * @param {p5.Color} original
 * @param {number} alpha
 * @returns {p5.Color}
 */
function setAlpha(original, alpha) {
	return color(red(original), green(original), blue(original), alpha);
}

/**
 * Draws a polygon with the given points,
 * just like triangle and quad
 * 
 * @param  {...number} coords 
 */
function polygon(...coords) {
	beginShape();
	coords.reduce((acc, val, idx) => (idx % 2 ? acc[0].push(val) : acc.unshift([val]), acc), [])
		.forReverse(p => vertex(...p));
	endShape(CLOSE);
}

/**
 * Draws a curve across the given points
 * 
 * @param  {...number} coords 
 */
 function spline(...coords) {
	beginShape();
	if (coords.length > 1)
		curveVertex(coords[0], coords[1]);
	coords.reduce((acc, val, idx) => (idx % 2 ? acc[0].push(val) : acc.unshift([val]), acc), [])
		.forReverse(p => curveVertex(...p));
	endShape(CLOSE);
}

//#region Gradient functions
// Wanted to include some more lighting effects,
// but couldn't dedicate enough time

/**
 * Sets a linear gradient fill on p5js shapes
 * 
 * @param {p5.Vector} start
 * @param {p5.Vector} end
 * @param {p5.Color} colorFrom
 * @param {p5.Color} colorTo
 */
function linearGradient(start, end, colorStops) {
	let gradient = drawingContext.createLinearGradient(start.x, start.y, end.x, end.y);
	for (const [offset, color] of Object.entries(colorStops)) {
		gradient.addColorStop(offset, color);
	}

	drawingContext.fillStyle = gradient;
}

/**
 * Sets a radial gradient fill on p5js shapes
 * 
 * @param {p5.Vector} start
 * @param {p5.Vector} end
 * @param {p5.Color} colorFrom
 * @param {p5.Color} colorTo
 */
function radialGradient(center, radius, colorStops) {
	let gradient = drawingContext.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
	for (const [offset, color] of Object.entries(colorStops)) {
		gradient.addColorStop(offset, color);
	}

	drawingContext.fillStyle = gradient;
}

/**
 * Draws a rect with a linear gradient fill
 * 
 * @param {p5.Vector} origin 
 * @param {p5.Vector} bounds 
 * @param {{[offset: number]: p5.Color}} colorStops 
 * @param {number} angle Only works for angles in [-PI/4 + k * PI/2, PI/4 + k * PI/2]
 * @param {number} radius 
 */
function rectGradient(origin, bounds, colorStops, angle = 0, radius = 0) {

	// remap between -PI and PI
	while (angle > PI)
		angle -= 2 * PI;

	const dir = abs(angle) > HALF_PI ? -1 : 1;
	abs(angle) > HALF_PI ? angle -= HALF_PI : angle;

	const extents = bounds.copy().mult(0.5);
	const center = origin.copy().add(extents);

	const start = vec(center.x + tan(angle) * center.y, center.y + extents.y).mult(dir);
	const end = center.copy().mult(2).sub(start); // mirror around center

	linearGradient(start, end, colorStops);
	rect(origin.x, origin.y, bounds.x, bounds.y, radius);
}

/**
 * 
 * @param {p5.Vector} origin 
 * @param {p5.Vector} bounds 
 * @param {{[offset: number]: p5.Color}} colorStops 
 * @param {p5.Vector} center 
 * @param {number} radius 
 */
function rectRadGradient(origin, bounds, colorStops, center, radius = 0) {

	const toCenter = origin.copy().add(bounds.copy().mult(0.5)).sub(center);
	const toCorner = origin.copy().sub(center);

	const distantCorner = vec(
		toCorner.x + (toCenter.x > toCorner.x ? bounds.x : 0),
		toCorner.y + (toCenter.y > toCorner.y ? bounds.y : 0));

	radialGradient(center, center.dist(distantCorner), colorStops);
	rect(origin.x, origin.y, bounds.x, bounds.y, radius);
}
//#endregion

//#region Draggable handles
/**
 * Creates a point which can be moved on the screen
 * 
 * @param {string} id
 * @param {p5.Vector} pos
 * @param {p5.Color} color
 * @returns {p5.Vector} The current pos of the point handle
 */
function draggablePoint(id, pos, pointColor, { lockX = false, lockY = false } = {}) {

	if (!globalThis.dragHandles) {
		globalThis.dragHandles = {};
	}

	if (!globalThis.dragHandles[id]) {
		globalThis.dragHandles[id] = { pos: pos.copy(), color: color(random(255), 200, 90) };
	}

	const handle = globalThis.dragHandles[id];

	push();
	layer(100);
	if (handle.pos.dist(vec(pmouseX, pmouseY)) < 7) {
		shared.mouseCursor = HAND;
		if (mouseIsPressed) {
			if (!lockX) handle.pos.x = mouseX;
			if (!lockY) handle.pos.y = mouseY;
		}
	}

	if (!pointColor) {
		pointColor = handle.color;
		colorMode(HSB);
	}

	strokeWeight(7);
	stroke(pointColor);
	point(handle.pos.x, handle.pos.y);
	if (keyIsDown(17) && mouseIsPressed) {
		console.log(`${id}: ${handle.pos.x}, ${handle.pos.y}`);
	}


	if (DEBUG_CONTROLLERS) {
		noStroke();
		fill(0, 0, 90);
		textAlign(LEFT, CENTER);
		if (DEBUG_CONTROLLERS === 'compact') {
			text(`${id}`, handle.pos.x + 10, handle.pos.y);
		} else {
			text(`${id}: ${handle.pos.x}, ${handle.pos.y}`, handle.pos.x + 10, handle.pos.y);
		}
	}

	pop();

	return handle.pos;
}

/**
 * Draws an editable ellipse
 * 
 * @param {string} id 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 */
function dragEllipse(id, x, y, w, h) {
	let pPos = globalThis.dragHandles?.[id]?.pos;
	pPos && (pPos = vec(pPos.x, pPos.y));
	const eHeight = (pPos?.y - globalThis.dragHandles?.[`${id}.h`]?.pos?.y) || -h,
		eWeight = (pPos?.x - globalThis.dragHandles?.[`${id}.w`]?.pos?.x) || w;
	const center = draggablePoint(id, vec(x, y));
	pPos?.sub(center);
	if (pPos?.x || pPos?.y) {
		globalThis.dragHandles[`${id}.h`]?.pos?.sub(pPos);
		globalThis.dragHandles[`${id}.w`]?.pos?.sub(pPos);
	}
	draggablePoint(`${id}.w`, vec(center.x+eWeight, center.y), undefined, { lockY: true });
	draggablePoint(`${id}.h`, vec(center.x, center.y+eHeight), undefined, { lockX: true });
	ellipse(center.x, center.y, 2*abs(eWeight), 2*abs(eHeight));
}

/**
 * Draws some p5 shape, making each point draggable
 * 
 * @param {string} id
 * @param {any} func
 * @param {number[]} coords
 * 
 */
function drag(id, func, ...coords) {
	const points = coords
		.reduce((acc, val, idx) => (idx % 2 ? acc[0].push(val) : acc.unshift([val]), acc), [])
		.reverse().map((p, i) => draggablePoint(`${id}_${i}`, vec(p[0], p[1])));
	func(...points.flatMap(p => [p.x, p.y]));
}

//#endregion
