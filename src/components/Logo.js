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
/* eslint-disable class-methods-use-this */

import assert from "assert";

import React from "react";
import PropTypes from "prop-types";

import SortedPointsList from "../classes/SortedPointsList";
import DotMatrixCharacters from "../classes/DotMatrixCharacters";

const propTypes = {
	text:       PropTypes.string.isRequired,
	background: PropTypes.string,
	color:      PropTypes.oneOfType( [ PropTypes.string, PropTypes.array ] ),
	zoom:       PropTypes.number,
	ratio:      PropTypes.number,
	animation:  PropTypes.string,
};

const defaultProps = {
	zoom:       1,
	background: "white",
	color:      "black",
};

/**
 * This component will be a SVG graphic which contains a given text.
 * The text is built using a 5x5 matrix for every character.
 *
 * Be sure to use Logo.supports( text ) before creating an instance.
 */
export class Logo extends React.Component {
	/**
	 * Checks if all characters of the given text are supported to draw the logo.
	 *
	 * @param	{string}	text
	 *		Text which will be used to create a logo, e.g.
	 *			"CTS\n2020"
	 */
	static supports( text ) {
		if ( typeof text !== "string" ) {
			return false;
		}

		for ( let pos = 0; pos < text.length; pos++ ) {
			if ( !/\r?\n/.test( text[pos] ) && !DotMatrixCharacters.supports( text[pos] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Initialising component
	 */
	constructor( props ) {	// eslint-disable-line max-lines-per-function, max-statements
		super( props );

		this.textLines = this.props.text.split( /\r?\n/ );

		const textWidth = this.textLines.reduce( ( maxLen, line ) => Math.max( maxLen, line.length ), 0 );
		const textHeight = this.textLines.length;

		this.colorList = Array.isArray( this.props.color ) ? this.props.color : [ this.props.color || "white" ];
		while ( this.colorList.length < textHeight ) {
			this.colorList.push( this.colorList[this.colorList.length - 1] );
		}

		this.pointsList = new SortedPointsList();
		let allCharIndex = 0;
		this.textLines.forEach( ( textline, lineIndex ) => {
			const lineStart = Math.floor( ( textWidth - textline.length ) / 2 );
			const posY = 6 * lineIndex;
			const color = this.colorList[lineIndex];
			for ( let charPos = 0; charPos < textline.length; charPos++ ) {
				const character = textline[charPos];
				const posX = 6 * ( lineStart + charPos );
				this.printCharacter( character, [ posX, posY ], { allCharIndex: allCharIndex++, color } );
			}
		} );

		const stat = this.pointsList.getStats();
		this.imageSizes = {
			width:       this.props.zoom * ( stat.maxX + 3 ),
			height:      this.props.zoom * ( stat.maxY + 3 ),
			leftPadding: 0,
			topPadding:  0,
		};
		if ( textWidth && textHeight && this.props.ratio ) {
			const ratioWidth = this.imageSizes.height * this.props.ratio;
			if ( this.imageSizes.width < ratioWidth ) {
				this.imageSizes.leftPadding = Math.floor( ( ratioWidth - this.imageSizes.width ) / 2 );
				this.imageSizes.width = ratioWidth;
			} else if ( this.imageSizes.width > ratioWidth ) {
				const ratioHeight = this.imageSizes.width / this.props.ratio;
				this.imageSizes.topPadding = Math.floor( ( ratioHeight - this.imageSizes.height ) / 2 );
				this.imageSizes.height = Math.floor( ratioHeight );
			}
		}

		this.state = {
			// animationPoint: null,
			// animationSetup: this.props.animation
			// 	? this.props.animation.split( ":" )
			// 	: [],
		};

		// // this.animationSetup = this.props.animation
		// // 	? this.props.animation.split( ":" )
		// // 	: [];

		// this.animationStepForward = this.animationStepForward.bind( this );
	}

	/**
	 * Actions to take when component is ready
	 * /
	componentDidMount() {
		if ( this.state.animationSetup.length === 0 ) {
			return Promise.resolve();
		}

		switch ( this.state.animationSetup[0] ) {
		case "running-point":
			return this.animationPointFirst()
				.then( () => setTimeout( this.animationStepForward, 200 ) );

		default:
			return Promise.resolve();
		}
	}

	/**
	 * Appends the dots of the string's first character to the list of points.
	 *
	 * @param	{string} 	character
	 * @param	{number[]} 	point
	 * @param	{object}	data.charIndex
	 */
	printCharacter( character, [ posX, posY ], { charIndex, color } ) {
		assert( typeof character === "string", "Invalid argument type (charString)" );
		assert( character.length === 1, "Invalid argument (charString)" );
		assert( typeof posX === "number", "Invalid argument type (point)" );
		assert( typeof posY === "number", "Invalid argument type (point)" );

		const dotList = DotMatrixCharacters.getMatrix( character[0] );
		if ( !Array.isArray( dotList ) ) {
			return;
		}

		dotList.forEach( dot => {
			const [ pointOffsetX, pointOffsetY ] = dot;
			if ( pointOffsetX !== null && pointOffsetY !== null ) {
				this.pointsList.append(
					[ posX + pointOffsetX, posY + pointOffsetY ],
					{ charIndex, color }
				);
			}
		} );
	}

	/**
	 * Check if there is an active animation which shall be advanced, now.
	 * /
	animationStepForward() {
		if ( this.state.animationSetup.length === 0 ) {
			return Promise.resolve();
		}

		switch ( this.state.animationSetup[0] ) {
		case "running-point":
			return this.animationPointNext( false )
				.then( () => this.animationLayerRefresh() )
				.then( () => setTimeout( this.animationStepForward, 200 ) );

		default:
			return Promise.resolve();
		}
	}

	/**
	 * Selects the first point of the very first character in the text.
	 * /
	animationPointFirst( callback ) {
		return new Promise( resolve => {
			// eslint-disable-next-line require-jsdoc
			const resolveWithCallback = () => {
				if ( typeof callback === "function" ) {
					callback.call( this );
				}
				resolve();
			};

			if ( this.textLines.length === 0 ) {
				this.setState(
					{ animationPoint: null },
					resolve
				);
			} else if ( this.textLines[0].length > 0 && ( CHARMAP[this.textLines[0][0]] || [] ).length > 0 ) {
				this.setState(
					{ animationPoint: { line: 0, char: 0, point: 0 } },
					resolveWithCallback
				);
			} else {
				this.setState(
					{ animationPoint: null },
					() => this.animationPointNext( true ).then( resolveWithCallback ),
				);
			}
		} );
	}

	/**
	 * Selects the next point in the current character of the text.
	 *
	 * If there are no more points in the current character,
	 * than the first point of the next character will be selected.
	 *
	 * @param	{boolean}	stopAtEnd
	 *		Set to true if the routine shall stop at the last point
	 *		of the very last character in the text; or
	 *		Set to false if the routine shall loop back to the start
	 *		in case that the very last point is reached.
	 *
	 * @returns	{null|object}
	 *		Returns tripel with data of next point; or
	 *		Returns null if no more point could be selected
	 * /
	animationPointNext( stopAtEnd = false, callback = null ) {
		return new Promise( resolve => {
			// eslint-disable-next-line require-jsdoc
			const resolveWithCallback = () => {
				if ( typeof callback === "function" ) {
					callback.call( this );
				}
				resolve();
			};

			if ( this.textLines.length === 0 ) {
				this.setState( { animationPoint: null }, resolve );
				return;
			}

			let { line, char, point } = this.state.animationPoint || { line: 0, char: 0, point: 0 };
			point++;

			while ( line < this.textLines.length ) {
				while ( char < this.textLines[line].length ) {
					const map = CHARMAP[this.textLines[line][char]] || [];
					if ( point < map.length ) {
						this.setState( { animation: { line, char, point } }, resolveWithCallback );
						return;
					}
					char++;
					point = 0;
				}
				line++;
				char = 0;
			}

			this.setState(
				{ animationPoint: null },
				() => {
					if ( stopAtEnd ) {
						resolveWithCallback();
					} else {
						this.animationPointNext( true ).then( resolveWithCallback );
					}
				}
			);
		} );
	}

	// animationLayerClear() {

	// }

	// animationLayerSetPoint() {

	// }

	/**
	 *
	 * @param {*} line
	 * @param {*} char
	 * @param {*} point
	 * /
	animationPointColor( line, char, point ) {
		// if (
		// 	this.animationSetup[0] === "running-point"
		// 	&& Array.isArray( this.state.animation )
		// ) {
		// 	const [ line2, char2, point2 ] = this.state.animation;
		// 	if (
		// 		// eslint-disable-next-line no-extra-parens
		// 		( line === line2 && char === char2 && point === point2 )
		// 		|| this.textLines[line][char][point] === this.textLines[line2][char2][point2]
		// 	) {
		// 		return this.animationSetup[1] || "white";
		// 	}
		// }

		if (
			this.state.animationSetup[0] === "running-point"
			&& this.state.animationPoint !== null
			&& typeof this.state.animationPoint === "object"
			&& this.state.animationPoint.line === line
			&& this.state.animationPoint.char === char
			&& this.state.animationPoint.point === point
		) {
			return this.state.animationSetup[1] || "white";
		}
		return null;
	}

	/**
	 * Composing output
	 */
	render() {
		if ( !this.imageSizes.height || !this.imageSizes.width ) {
			return <div className="emptySVG"></div>;
		}

		const rectangleList = [];

		let currDot = this.pointsList.first();
		while ( currDot ) {
			if ( currDot.generation === 1 ) {
				const dotX = this.imageSizes.leftPadding + ( currDot.posX + 1 ) * this.props.zoom;
				const dotY = this.imageSizes.topPadding + ( currDot.posY + 1 ) * this.props.zoom;
				const fill = currDot.data.color;
				rectangleList.push( <rect key={`${dotX}-${dotY}`}
					x={dotX} y={dotY} width={this.props.zoom} height={this.props.zoom}
					style={{ fill, strokeWidth: this.props.zoom / 10, stroke: fill }}
				/> );
			}
			currDot = this.pointsList.next();
		}

		return <svg
			width={this.imageSizes.width}
			height={this.imageSizes.height}
			style={{ backgroundColor: this.props.background || "white" }}
		>
			{rectangleList}
		</svg>;
	}
}

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
