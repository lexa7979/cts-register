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

import React from "react";
import PropTypes from "prop-types";

/**
 * 00 01 02 03 04
 * 05 06 07 08 09
 * 10 11 12 13 14
 * 15 16 17 18 19
 * 20 21 22 23 24
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


/* eslint-disable id-length */
/**
 * ####s s#### ####s       s#### ####s
 * #       #   #               # #   #
 * #       #   #####        #### ##  #
 * #       #       #        #    # e #
 * ####e   e   e#### s###e  ###e #####
 */
const CHARMAP = {
	A: [ 20, 15, 10, 5, 1, 2, 3, 9, 14, 19, 24, 10, 11, 12, 13, 14 ],
	C: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24 ],
	E: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 11, 12 ],
	L: [ 0, 5, 10, 15, 20, 21, 22, 23, 24 ],
	S: [ 4, 3, 2, 1, 0, 5, 10, 11, 12, 13, 14, 19, 24, 23, 22, 21, 20 ],
	T: [ 0, 1, 2, 3, 4, 7, 12, 17, 22 ],
	X: [ 0, 6, 12, 18, 24, 4, 8, 12, 16, 20 ],

	0: [ 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 11, 17 ],
	2: [ 0, 1, 2, 3, 4, 9, 14, 13, 12, 11, 16, 21, 22, 23, 24 ],

	_:   [ 20, 21, 22, 23, 24 ],
	" ": [],
};
/* eslint-enable id-length */

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
			if ( !/\r?\n/.test( text[pos] ) && !Array.isArray( CHARMAP[text[pos]] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Initialising component
	 */
	constructor( props ) {
		super( props );

		this.textLines = this.props.text.split( /\r?\n/ );
		this.sizes = {
			height:     this.textLines.length,
			width:      this.textLines.reduce( ( maxLength, line ) => Math.max( maxLength, line.length ), 0 ),
			leftBorder: 0,
			topBorder:  0,
		};
		this.sizes.extendX = this.props.zoom * ( 6 * this.sizes.width + 1 );
		this.sizes.extendY = this.props.zoom * ( 6 * this.sizes.height + 1 );

		if ( this.sizes.height > 0 && this.sizes.width > 0 && this.props.ratio > 0 ) {
			if ( this.sizes.extendX > this.sizes.extendY * this.props.ratio ) {
				this.sizes.topBorder = Math.floor(
					Math.abs( this.sizes.extendY - Math.floor( this.sizes.extendX / this.props.ratio ) ) / 2
				);
				this.sizes.extendY = Math.floor( this.sizes.extendX / this.props.ratio );
			} else if ( this.sizes.extendX < this.sizes.extendY * this.props.ratio ) {
				this.sizes.leftBorder = Math.floor(
					Math.abs( this.sizes.extendX - Math.floor( this.sizes.extendY * this.props.ratio ) ) / 2
				);
				this.sizes.extendX = Math.floor( this.sizes.extendY * this.props.ratio );
			}
		}

		this.state = {
			animation: null,
		};

		this.animationSetup = this.props.animation
			? this.props.animation.split( ":" )
			: [];

		this.animationStepForward = this.animationStepForward.bind( this );
	}

	/**
	 *
	 */
	componentDidMount() {
		this.animationStepForward();
	}

	/**
	 *
	 */
	animationStepForward() {
		if ( this.animationSetup[0] === "running-point" ) {
			if (
				!this.state.animation
				&& this.textLines.length > 0
				&& this.textLines[0].length > 0
				&& ( CHARMAP[this.textLines[0][0]] || [] ).length > 0
			) {
				this.setState(
					{ animation: [ 0, 0, 0 ] },
					() => setTimeout( this.animationStepForward, 200 )
				);
				return;
			}

			let [ line, char, point ] = this.state.animation || [ 0, 0, 0 ];
			point++;
			while ( line < this.textLines.length ) {
				while ( char < this.textLines[line].length ) {
					const map = CHARMAP[this.textLines[line][char]] || [];
					if ( point < map.length ) {
						this.setState(
							{ animation: [ line, char, point ] },
							() => setTimeout( this.animationStepForward, 200 )
						);
						return;
					}
					char++;
					point = 0;
				}
				line++;
				char = 0;
			}
			this.setState(
				{ animation: null },
				() => setTimeout( this.animationStepForward, 200 )
			);
			// eslint-disable-next-line no-useless-return
			return;
		}
	}

	/**
	 *
	 * @param {*} line
	 * @param {*} char
	 * @param {*} point
	 */
	animationPointColor( line, char, point ) {
		if (
			this.animationSetup[0] === "running-point"
			&& Array.isArray( this.state.animation )
			&& this.state.animation[0] === line
			&& this.state.animation[1] === char
			&& this.state.animation[2] === point
		) {
			return this.animationSetup[1] || "white";
		}
		return null;
	}

	/**
	 *
	 * @param {*} character
	 */
	getRectangles( charX, charY ) {
		const template = CHARMAP[this.textLines[charY][charX]] || [];

		let color = "white";
		if ( typeof this.props.color === "string" ) {
			( { color } = this.props );
		} else if (
			Array.isArray( this.props.color )
			&& this.props.color.length > charY
		) {
			if ( typeof this.props.color[charY] === "string" ) {
				color = this.props.color[charY];
			} else if (
				Array.isArray( this.props.color[charY] )
				&& this.props.color[charY].length > charX
				&& typeof this.props.color[charY][charX] === "string"
			) {
				color = this.props.color[charY][charX];
			}
		}

		const rectangleList = [];
		for ( let pointIndex = 0; pointIndex < template.length; pointIndex++ ) {
			const [ pointX, pointY ] = POINTS[template[pointIndex]];
			rectangleList.push( <rect key={`${pointY}-${pointX}-${pointIndex}`}
				x={this.sizes.leftBorder + ( 6 * charX + pointX + 1 ) * this.props.zoom}
				y={this.sizes.topBorder + ( 6 * charY + pointY + 1 ) * this.props.zoom}
				width={this.props.zoom}
				height={this.props.zoom}
				style={{ fill: this.animationPointColor( charY, charX, pointIndex ) || color }}
			/> );
		}

		return rectangleList;
	}

	/**
	 * Composing output
	 */
	render() {
		if ( this.sizes.height === 0 || this.sizes.width === 0 ) {
			return <div className="emptySVG"></div>;
		}

		const framesList = [];
		// eslint-disable-next-line id-length
		for ( let y = 0; y < this.sizes.height; y++ ) {
			// eslint-disable-next-line id-length
			for ( let x = 0; x < this.textLines[y].length; x++ ) {
				framesList.push( this.getRectangles( x, y ) );
			}
		}

		return <svg
			width={this.sizes.extendX}
			height={this.sizes.extendY}
			style={{ backgroundColor: this.props.background || "white" }}
		>
			{framesList}
		</svg>;
	}
}

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
