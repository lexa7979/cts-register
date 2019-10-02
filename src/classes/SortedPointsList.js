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

/**
 * Class to manage two-dimensional points in a sorted list.
 * Every point is a 2-tuple, i.e. [ <x-coordinate>, <y-coordinate> ].
 *
 * - Points can only be appended to the end of the list.
 * - Every appended point can be combined with some self-defined data.
 * - There is no way to remove a single point after it was added.
 * - If the same point is appended again (e.g. with other data),
 *   the old and the new entry are kept using increasing "generations".
 *
 * - Any point can be marked with a self-defined tag. This tag can be removed, again.
 */
export class SortedPointsList {
	/**
	 * Initialisation of new instance.
	 */
	constructor() {
		this.itemList = [];
		this.itemIndex = new Map();
		this.itemTags = new Map();

		this.itemStats = {
			count: 0,
			minX:  null,
			maxX:  null,
			minY:  null,
			maxY:  null,
		};

		this.currentIndex = {};
	}

	/**
	 * Appends a new point to the end of the list.
	 *
	 * @param	{number[]}	point
	 *		Coordinates of the new point, e.g. [ 4, 8 ]
	 * @param	{*} 	data
	 *		Information which shall be stored together with the new point, e.g.
	 *			{ color: "white" }
	 */
	append( [ posX, posY ], data = null ) {
		const newIndex = this.itemList.length;

		let generation = 1;
		while ( this.itemIndex.has( `${posX}-${posY}-${generation}` ) ) { // [ posX, posY, generation ] ) ) {
			generation++;
		}

		const item = { posX, posY, generation, data };

		this.itemList.push( item );
		this.itemIndex.set( `${posX}-${posY}-${generation}`, newIndex ); // [ posX, posY, generation ], newIndex );

		if ( generation === 1 ) {
			this.itemStats.count++;
			this.itemStats.minX = this.itemStats.minX === null ? posX : Math.min( this.itemStats.minX, posX );
			this.itemStats.maxX = this.itemStats.maxX === null ? posX : Math.max( this.itemStats.maxX, posX );
			this.itemStats.minY = this.itemStats.minY === null ? posY : Math.min( this.itemStats.minY, posY );
			this.itemStats.maxY = this.itemStats.maxY === null ? posY : Math.max( this.itemStats.maxY, posY );
		}
	}

	/**
	 * Delivers information about the given point.
	 *
	 * If the point has more than one generation,
	 * the information from the first generation will be returned.
	 *
	 * @param	{number[]}	point
	 *		Coordinates of the point, e.g. [ 4, 8 ]
	 *
	 * @returns	{object}
	 *		Information about the point in the form
	 *		{ posX, posY, generation, data }, e.g.
	 *			{ posX: 3,
	 *			  posY: 5,
	 *			  generation: 1,
	 *			  data: { color: "white" } }; or
	 *		null if the point wasn't stored, yet.
	 */
	get( [ posX, posY ] ) {
		if ( this.itemIndex.has( `${posX}-${posY}-1` ) ) { // [ posX, posY, 1 ] ) ) {
			const index = this.itemIndex.get( `${posX}-${posY}-1` ); // [ posX, posY, 1 ] );
			return this.itemList[index];
		}

		return null;
	}

	/**
	 * Determines the number of items in the list of points.
	 *
	 * @returns	{number}
	 *		Number of items, e.g. 124
	 */
	length() {
		return this.itemList.length;
	}

	/**
	 * Sets the internal pointer to the point which was added first
	 * and delivers its information.
	 *
	 * @returns	{object}
	 *		Information about the found point in the form
	 *		{ posX, posY, generation, data }, e.g.
	 *			{ posX: 6,
	 *			  posY: 2,
	 *			  generation: 3,
	 *			  data: { color: "black" } }; or
	 *		null if there was no point stored, yet.
	 */
	first( iterator = "default" ) {
		if ( this.itemList.length === 0 ) {
			delete this.currentIndex[iterator];
			return null;
		}

		this.currentIndex[iterator] = 0;
		return this.itemList[0];
	}

	/**
	 * Sets the internal pointer to the point which was added last
	 * and delivers its information.
	 *
	 * @returns	{object}
	 *		Information about the found point in the form
	 *		{ posX, posY, generation, data }, e.g.
	 *			{ posX: 6,
	 *			  posY: 2,
	 *			  generation: 3,
	 *			  data: { color: "black" } }; or
	 *		null if there was no point stored, yet.
	 */
	last( iterator = "default" ) {
		if ( this.itemList.length === 0 ) {
			delete this.currentIndex[iterator];
			return null;
		}

		this.currentIndex[iterator] = this.itemList.length - 1;
		return this.itemList[this.currentIndex[iterator]];
	}

	/**
	 * Checks if the current point has a predecessor.
	 *
	 * @returns	{boolean}
	 *		True iff there is another list-item before the current point
	 */
	hasPrev( iterator = "default" ) {
		return this.currentIndex[iterator] > 0;
	}

	/**
	 * Switches to the predecessor of the current point
	 * and delivers its information.
	 *
	 * If there is no predecessor the current point will be deselected,
	 * i.e. there will be no current point afterwards.
	 *
	 * @returns	{object}
	 *		Information about the found point in the form
	 *		{ posX, posY, generation, data }, e.g.
	 *			{ posX: 6,
	 *			  posY: 2,
	 *			  generation: 3,
	 *			  data: { color: "black" } }; or
	 *		null if the previously selected point has no predecessor
	 */
	prev( iterator = "default" ) {
		if ( this.currentIndex[iterator] > 0 ) {
			this.currentIndex[iterator]--;
			return this.itemList[this.currentIndex[iterator]];
		}

		delete this.currentIndex[iterator];
		return null;
	}

	/**
	 * Checks if the current point has a successor.
	 */
	hasNext( iterator = "default" ) {
		return typeof this.currentIndex[iterator] === "number"
			&& this.currentIndex[iterator] + 1 < this.itemList.length;
	}

	/**
	 * Switches to the successor of the current point
	 * and delivers its information.
	 */
	next( iterator = "default" ) {
		if (
			typeof this.currentIndex[iterator] === "number"
			&& this.currentIndex[iterator] + 1 < this.itemList.length
		) {
			this.currentIndex[iterator]++;
			return this.itemList[this.currentIndex[iterator]];
		}

		delete this.currentIndex[iterator];
		return null;
	}

	/**
	 * Delivers the information of the currently selected point.
	 */
	current( iterator = "default" ) {
		return typeof this.currentIndex[iterator] === "number"
			? this.itemList[this.currentIndex[iterator]]
			: null;
	}

	/**
	 * Marks the given point.
	 *
	 * If the same point was already marked before with another flag,
	 * the new flag will be stored anyway.
	 *
	 * @param	{number[]}	point
	 *		Coordinates of a point in the list,
	 *			[ 4, 8 ]
	 * @param	{*} 	flag
	 *		Data to save together as tag; or
	 *		null if the point shall be marked without any additional data.
	 */
	setMark( [ posX, posY ], flag = null ) {
		this.itemTags.set( `${posX}-${posY}`, flag === null ? true : flag );
		// this.itemTags.set( [ posX, posY ], flag === null ? true : flag );
	}

	/**
	 * Checks if the given point was marked before
	 * and in that case delivers the stored tag.
	 *
	 * @param	{number[]}	point
	 *		Coordinates of a point in the list, e.g.
	 *			[ 4, 8 ]
	 */
	getMark( [ posX, posY ] ) {
		return this.itemTags.has( `${posX}-${posY}` ) // [ posX, posY ] )
			? this.itemTags.get( `${posX}-${posY}` ) // [ posX, posY ] )
			: null;
	}

	/**
	 * Removes any tag from the given point
	 * in case the point was marked before.
	 *
	 * @param	{number[]}	point
	 *		Coordinates of a point in the list, e.g.
	 *			[ 4, 8 ]
	 */
	unmark( [ posX, posY ] ) {
		this.itemTags.delete( `${posX}-${posY}` ); // [ posX, posY ] );
	}

	/**
	 * Removes the tags from any point which was marked before.
	 */
	unmarkAll() {
		this.itemTags.clear();
	}

	/**
	 * Delivers an object with some statistical data about the list of points.
	 */
	getStats() {
		return this.itemStats;
	}
}

export default SortedPointsList;
