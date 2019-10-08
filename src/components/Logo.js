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
/* eslint-disable class-methods-use-this */

import assert from "assert";

import React from "react";
import PropTypes from "prop-types";

import SortedPointsList from "../classes/SortedPointsList";
import DotMatrixCharacters from "../classes/DotMatrixCharacters";
import Animation from "../classes/Animation";

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

		if ( typeof this.props.text !== "string" ) {
			return;
		}

		this.textLines = this.props.text.split( /\r?\n/ );

		this.textWidth = this.textLines.reduce( ( maxLen, line ) => Math.max( maxLen, line.length ), 0 );
		this.textHeight = this.textLines.length;

		this.colorList = Array.isArray( this.props.color ) ? this.props.color : [ this.props.color || "white" ];
		while ( this.colorList.length < this.textHeight ) {
			this.colorList.push( this.colorList[this.colorList.length - 1] );
		}

		this.pointsList = new SortedPointsList();
		let allCharIndex = 0;
		this.textLines.forEach( ( textline, lineIndex ) => {
			const lineStart = ( this.textWidth - textline.length ) / 2;
			const posY = 6 * lineIndex;
			const color = this.colorList[lineIndex];
			for ( let charPos = 0; charPos < textline.length; charPos++ ) {
				const character = textline[charPos];
				const posX = Math.floor( 6 * ( lineStart + charPos ) );
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
		if ( this.textWidth && this.textHeight && this.props.ratio ) {
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

		this.animation = this.props.animation
			? new Animation( this.props.animation, this.pointsList, () => this.forceUpdate() )
			: null;
	}

	/**
	 * Actions to take when component is ready
	 */
	componentDidMount() {
		if ( this.animation ) {
			this.animation.init();
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
	 * Composing output
	 */
	render() {
		if ( !this.textHeight || !this.textWidth ) {
			return <div className="empty-svg"></div>;
		}

		const rectangleList = [];

		let currDot = this.pointsList.first();
		while ( currDot ) {
			if ( currDot.generation === 1 ) {
				const dotX = this.imageSizes.leftPadding + ( ( currDot.posX + 1 ) * this.props.zoom );
				const dotY = this.imageSizes.topPadding + ( ( currDot.posY + 1 ) * this.props.zoom );
				const mark = this.pointsList.getMark( [ currDot.posX, currDot.posY ] );
				if ( mark === null ) {
					const fill = currDot.data.color;
					rectangleList.push( <rect key={`${dotX}-${dotY}`}
						x={dotX}
						y={dotY}
						width={this.props.zoom}
						height={this.props.zoom}
						style={{ fill, strokeWidth: this.props.zoom / 10, stroke: fill }}
					/> );
				} else if ( typeof mark === "object" && mark.color ) {
					const fill = mark.color;
					rectangleList.push( <rect key={`${dotX}-${dotY}`}
						x={dotX}
						y={dotY}
						width={this.props.zoom}
						height={this.props.zoom}
						style={{ fill, strokeWidth: this.props.zoom / 10, stroke: fill }}
					/> );
				}
			}
			currDot = this.pointsList.next();
		}

		return <svg
			xmlns="http://www.w3.org/2000/svg"
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
