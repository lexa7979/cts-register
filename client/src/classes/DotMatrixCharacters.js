/**
 * MIT License
 *
 * Copyright (c) 2019 <alexander.urban@cygni.se>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable array-element-newline */
const POINTS = [
	[ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 4, 0 ],
	[ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 4, 1 ],
	[ 0, 2 ], [ 1, 2 ], [ 2, 2 ], [ 3, 2 ], [ 4, 2 ],
	[ 0, 3 ], [ 1, 3 ], [ 2, 3 ], [ 3, 3 ], [ 4, 3 ],
	[ 0, 4 ], [ 1, 4 ], [ 2, 4 ], [ 3, 4 ], [ 4, 4 ],
];
/* eslint-enable array-element-newline */

/**
 * 00 01 02 03 04
 * 05 06 07 08 09
 * 10 11 12 13 14
 * 15 16 17 18 19
 * 20 21 22 23 24
 */

/* eslint-disable id-length */
/**
 * ####s s#### ####s       s#### ####s
 * #       #   #               # #   #
 * #       #   #####        #### ##  #
 * #       #       #        #    # e #
 * ####e   e   e#### s###e  ###e #####
 */
const CHARMAP = {
	A: [ 20, 15, 10, 5, 1, 2, 3, 9, 14, 13, 12, 11, 10, 5, 1, 2, 3, 9, 14, 19, 24 ],
	B: [ 0, 5, 10, 15, 20, 15, 10, 5, 0, 1, 2, 3, 9, 13, 12, 11, 10, 11, 12, 13, 19, 23, 22, 21, 20 ],
	C: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24 ],
	E: [ 4, 3, 2, 1, 0, 5, 10, 11, 12, 11, 10, 15, 20, 21, 22, 23, 24 ],
	G: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 13, 12 ],
	H: [ 0, 5, 10, 15, 20, 15, 10, 11, 12, 13, 14, 9, 4, 9, 14, 19, 24 ],
	I: [ 0, 1, 2, 3, 4, 3, 2, 7, 12, 17, 22, 21, 20, 21, 22, 23, 24 ],
	L: [ 0, 5, 10, 15, 20, 21, 22, 23, 24 ],
	M: [ 0, 5, 10, 15, 20, 15, 10, 5, 0, 1, 2, 7, 12, 17, 22, 17, 12, 7, 2, 3, 4, 9, 14, 19, 24 ],
	N: [ 20, 15, 10, 5, 0, 1, 2, 7, 12, 17, 22, 23, 24, 19, 14, 9, 4 ],
	S: [ 4, 3, 2, 1, 0, 5, 10, 11, 12, 13, 14, 19, 24, 23, 22, 21, 20 ],
	T: [ 0, 1, 2, 3, 4, 3, 2, 7, 12, 17, 22 ],
	U: [ 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4 ],
	X: [ 0, 6, 12, 18, 24, 18, 12, 16, 20, 16, 12, 8, 4 ],
	Y: [ 0, 5, 10, 11, 12, 17, 22, 17, 12, 13, 14, 9, 4 ],

	0: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 17, 11, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4 ],
	1: [ 0, 1, 2, 7, 12, 17, 22, 21, 20, 21, 22, 23, 24 ],
	2: [ 0, 1, 2, 3, 4, 9, 14, 13, 12, 11, 16, 21, 22, 23, 24 ],
	8: [ 4, 3, 2, 1, 0, 5, 10, 11, 12, 13, 14, 19, 24, 23, 22, 21, 20, 15, 10, 11, 12, 13, 14, 9, 4 ],
	9: [ 4, 3, 2, 1, 0, 5, 10, 11, 12, 13, 14, 9, 4, 9, 14, 19, 24, 23, 22, 21, 20 ],

	_:   [ 20, 21, 22, 23, 24 ],
	" ": [],
};
/* eslint-enable id-length */


/**
 * This class contains some static functions to handle
 * dot-matrix pattern for printing characters into some graphic.
 *
 * The characters are always five pixel height and five pixel width.
 *
 * Not all characters are supported.
 */
export class DotMatrixCharacters {
	/**
	 * Determines if there is a definition of the given character
	 * and its dots.
	 *
	 * @param	{string}	character
	 *
	 * @returns	{boolean}
	 *		True iff the character is known
	 */
	static supports( character ) {
		return typeof character === "string"
			&& character.length === 1
			&& Array.isArray( CHARMAP[character] );
	}

	/**
	 * Delivers the coordinates of the given character's dots.
	 *
	 * @param	{string}	character
	 *
	 * @returns	{Array|null}
	 *		List of tuples representing the character's dots; or
	 *		Null if the character is not defined, yet
	 */
	static getMatrix( character ) {
		if (
			typeof character === "string"
			&& character.length === 1
			&& Array.isArray( CHARMAP[character] )
		) {
			return CHARMAP[character]
				.map( pointNum => POINTS[pointNum] );
		}

		return null;
	}
}

export default DotMatrixCharacters;
