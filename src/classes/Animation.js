/**
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

import assert, { AssertionError } from "assert";

import SortedPointsList from "./SortedPointsList";

/**
 * This class is used by component <Logo />
 * to animate some parts of the Text.
 */
export class Animation {
	/**
	 * Initialising a new instance
	 *
	 * @param	{string}	setup
	 *		Animation mode, maybe combined with some options, separated by colon, e.g.
	 *			"running-point:green"
	 */
	constructor( setup, pointsList, updateTrigger ) {
		assert( typeof setup === "string" && setup !== "", "Invalid argument \"setup\" for new Animation()" );

		const setupList = setup.split( ":" );
		assert( setupList.length > 0 && setupList[0] !== "", "Missing animation mode for new Animation()" );

		this.mode = setupList[0];

		switch ( setupList[0] ) {
		case "running-point":
			this.options = { color: setupList[1] || "red" };
			break;
		default:
			throw new AssertionError( { message: "Invalid animation mode for new Animation()" } );
		}

		assert( pointsList instanceof SortedPointsList, "Invalid argument \"pointsList\" for new Animation()" );
		this.pointsList = pointsList;
		this.pointsList.unmarkAll();

		assert( typeof updateTrigger === "function", "Invalid argument \"updateTrigger\" for new Animation()" );
		this.updateTrigger = updateTrigger;
	}

	/**
	 *
	 */
	init() {
		if ( this.mode === "running-point" ) {
			const item = this.pointsList.first( "animation" );
			if ( item ) {
				this.pointsList.setMark( [ item.posX, item.posY ], this.options );
				this.updateTrigger.call();
				setTimeout( () => this.step(), 150 );
			}
		}
	}

	/**
	 *
	 */
	step() {
		if ( this.mode === "running-point" ) {
			let item = this.pointsList.current( "animation" );
			if ( item ) {
				this.pointsList.unmark( [ item.posX, item.posY ] );
				item = this.pointsList.next( "animation" );
				if ( !item ) {
					item = this.pointsList.first( "animation" );
				}
				if ( item ) {
					this.pointsList.setMark( [ item.posX, item.posY ], this.options );
					this.updateTrigger.call();
					setTimeout( () => this.step(), 150 );
				}
			}
		}
	}
}

export default Animation;
