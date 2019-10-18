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

/**
 * Generates a new UUID based on random numbers
 *
 * @returns	{string}
 *		UUID, e.g. "a342bdef-8319-20de-bf23-291c23180a1d"
 * /
function generateUUID() {
	let result = "";
	for ( let index = 0; index < 32; index++ ) {
		result += ( [ 8, 12, 14, 16 ].indexOf( index ) >= 0 ? "-" : "" )
			+ "0123456789abcdef".substr( Math.floor( Math.random() * 16 ), 1 );
	}
	return result;
}

/**
 * Checks if the given ID is formatted as an UUID
 *
 * @param	{string}	id
 *		Identifier to be checked, e.g.
 *			"user02" or "a342bdef-8319-20de-bf23-291c23180a1d"
 *
 * @returns	{boolean}
 *		True iff the given identifier is an UUID.
 * /
const isUUID = id => /^[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/.test( id );

/**
 * This class manages a connection to a documentbased database storage
 * and handles the reading and writing of application data.
 */
export class Database {
	/**
	 * Initialises the object instance
	 */
	constructor( adapterClass ) {
		this.cache = {};
		this.revisions = {};

		Object.defineProperty( this, "adapter", { value: adapterClass, writeable: false } );
	}

	/**
	 * Checks if the cached data related to the given revision is up-to-date.
	 *
	 * @param	{string}	composition
	 * @param	{number}	revision
	 */
	checkRevision( composition, revision ) {
		if ( this.revisions[composition] == null ) {
			return false;
		}

		// Grab composition's current revision from database
		const dbRevision = 179;

		const { min, max } = this.revisions[composition];
		return min > 0 && min <= revision
			&& dbRevision > 0 && dbRevision <= max;
	}

	/**
	 * Memorises a revision number which was reached by an update
	 * of this class-instance itself (and not from another source).
	 *
	 * This way we can decide if a previously cached item must
	 * be refreshed or not.
	 *
	 * @param {*} composition
	 * @param {*} revision
	 */
	memoriseRevision( composition, revision ) {
		if ( this.revisions[composition] != null ) {
			const { min, max } = this.revisions[composition];
			if ( min > 0 && revision === max + 1 ) {
				this.revisions[composition].max = revision;
				return;
			}
		}

		this.revisions[composition] = { min: revision, max: revision };
	}

	/**
	 * Check if a record with the given ID is currently stored in the given composition.
	 *
	 * @param	{string}	composition
	 *		Name of the database composition to use, e.g.
	 *			"users"
	 * @param	{string}	id
	 *
	 */
	check( composition, id ) {
		if ( this.cache[composition] == null ) {
			this.cache[composition] = {};
		}

		const cache = this.cache[composition];
		if ( cache[id] != null && cache[id].revision != null ) {
			const { revision } = cache[id];
			if ( this.checkRevision( composition, revision ) ) {
				return cache[id].exists;
			}
			delete cache[id];
		}

		// Grab the record from the database
		const dbFound = true;
		const dbRevision = 180;

		this.memoriseRevision( composition, dbRevision );
		cache[id] = { revision: dbRevision, exists: dbFound };
		return dbFound;
	}

	// /**
	//  *
	//  * @param {*} composition
	//  * @param {*} id
	//  */
	// get( composition, id ) {

	// }

	// find( composition, condition ) {

	// }

	// save( composition, data ) {

	// }

	// update( composition, id, data ) {

	// }

	// remove( composition, id ) {

	// }
}

export default Database;
