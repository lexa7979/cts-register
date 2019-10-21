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

/* eslint-disable class-methods-use-this,no-unused-vars */

import assert from "assert";

/**
 * Abstract class which is used to give an exchangeable API
 * to store recordsets in a documentbased database.
 */
export class DatabaseAdapterInterface {
	/**
	 * Checks the structure of the derived adapter class.
	 *
	 * Please note:
	 * Don't instantiate DatabaseAdapter directly.
	 * Use DatabaseAdapter.init() instead.
	 *
	 * @param	{string}	collection
	 *		Name of a collection inside the datasource where similar data is stored, e.g.
	 *			"users"
	 */
	constructor( collection ) {
		assert( new.target !== "DatabaseAdapterInterface",
			"You can't use interface DatabaseAdapterInterface directly, use a derivate instead" );

		const thisClass = Object.getPrototypeOf( this );
		[
			"connect",
			"checkItem",
			"countItems",
			"findItems",
			"getItem",
			"addItem",
			"updateItem",
			"removeItem",
		].forEach( name => {
			assert( Object.prototype.hasOwnProperty.call( thisClass, name ) && typeof this[name] === "function",
				`Derivation of DatabaseAdapterInterface is missing mandatory implementation of ${name}()` );
		} );

		assert( typeof collection === "string" && collection !== "",
			"Can't construct implementation of DatabaseAdapterInterface: Invalid argument" );
		Object.defineProperty( this, "collection", { value: collection, writable: false } );

		this.connection = null;

		this.features = {
			cache: false,
		};
	}

	/**
	 * Checks if the current implementation of the database adapter
	 * supports the given feature.
	 *
	 * @param	{string}	feature
	 *		Name of the feature you want to use. The following values are supported:
	 *		- "cache"
	 *				Every queried recordset or list is cached in memory
	 *				together with the current revision number of the collection.
	 *				With every change of the collection the revision number
	 *				will be incremented; this must also be done by any other
	 *				application accessing the same collection.
	 *				When the same recordset or list is needed again and
	 *				the revision number is still "valid" the cached data
	 *				will be delivered instead of querying it from the database again.
	 */
	hasFeature( feature ) {
		assert( typeof feature === "string" && feature !== "" && this.features[feature] != null,
			"Invalid argument \"feature\"" );

		switch ( feature ) {
		default:
			throw new Error( `Unknown feature given (${feature}).` );
		case "cache":
			return typeof this.cacheGetRevision === "function"
				&& typeof this.cacheCheckRevision === "function"
				&& typeof this.cacheNextRevision === "function";
		}
	}

	/**
	 * Activates the given feature.
	 *
	 * @param	{string}	feature
	 * @param	{string}	handleConflict
	 */
	enableFeature( feature, handleConflict = "error" ) {
		assert( typeof feature === "string" && feature !== "" && this.features[feature] != null,
			"Invalid argument \"feature\"" );
		assert( [ "error", "skip" ].indexOf( handleConflict ) >= 0,
			"Invalid argument \"handleConflict\"" );

		if ( handleConflict === "error" && !this.hasFeature( feature ) ) {
			throw new Error( `${this.constructor.name} doesn't support feature "${feature}"` );
		}

		this.features[feature] = true;
	}

	/**
	 * Establishs a connection to the database server
	 * which is configured in file "./dbsetup.js"
	 *
	 * returns:
	 *		Resolves when the connection is ready to be used
	 *
	 * @returns	{Promise}
	 */
	connect() {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Checks if a
	 * /
	isConnected() {
		return this.connection != null;
	}

	/**
	 * Determines if exactly one item with the given ID is stored in the current collection.
	 *
	 * id:
	 *		ID of a possibly stored record, e.g. "abce7982-3279-de82-7391-732cdf233190"
	 *
	 * returns:
	 *		Resolves with true iff a matching record was found.
	 *
	 * @param	{string}	id
	 * @returns	{Promise<boolean>}
	 */
	checkItem( id ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Counts the numbers of stored recordsets which belong to the selected collection
	 * and match the given filter.
	 *
	 * filterObject:
	 *		Filter which shall be used to query the recordsets, e.g.
	 *			{ city: "Stockholm" }
	 *
	 * returns:
	 *		Number of found records
	 *
	 * @param	{object}	filterObject
	 * @returns	{Promise<number>}
	 */
	countItems( filterObject = {} ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Queries the connected database for records of the current collection
	 * which fit the given filter.
	 *
	 * filterObject:
	 *		Filter which shall be used to query the recordsets, e.g.
	 *			{ city: "Stockholm" }
	 * offset:
	 *		Index of the first record, which shall be contained in the result.
	 *		Set to 0 if no records shall be skipped from the beginning of the list.
	 * limit:
	 *		Amount of sequential records which shall be contained in the result.
	 *		Set to Infinity if no records shall be left out from the end of the list.
	 *
	 * returns:
	 *		Resolves with the data of the found recordsets, e.g.
	 *			[ { id: 12, city: "Stockholm" },
	 *			  { id: 15, city: "Berlin" } ]
	 *
	 * @param	{object}	filterObject
	 * @param	{number}	offset
	 * @param	{number}	limit
	 * @returns	{Promise<object[]>}
	 */
	findItems( filterObject = {}, offset = 0, limit = Infinity ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Queries a record which is stored in the current collection of the database.
	 *
	 * id:
	 *		ID of the stored record, e.g. "abce7982-3279-de82-7391-732cdf233190"
	 *
	 * returns:
	 *		Resolves with the data of the stored recordset; or
	 *		Resolves with null if there is no record with the given ID in the current collection
	 *
	 * @param	{string}	id
	 * @returns	{Promise<object|null>}
	 */
	getItem( id ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Stores a new record in the current collection of the database
	 *
	 * id:
	 *		Null if the ID of the new record shall be determined by the database; or
	 *		ID of the new record, e.g. "abce7982-3279-de82-7391-732cdf233190"
	 * data:
	 *		Data which shall be stored in the database
	 * handleConflict:
	 *		How shall we act if another record with the same ID is already stored
	 *		in the database? Possible values are:
	 *			- "error" (default), i.e. the promise is rejected; or
	 *			- "ignore", i.e. the old record is discarded; or
	 *			- "skip", i.e. the new record is not stored.
	 *
	 * returns:
	 *		Resolves with the ID of the newly inserted recordset; or
	 *		Resolves with null if the ID is already in use and handleConflict == "skip"
	 *
	 * @param	{null|string}	id
	 * @param	{object}	data
	 * @param	{string}	handleConflict
	 * @returns	{Promise<string|null>}
	 */
	addItem( id, data, handleConflict = "error" ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Replaces a recordset from the database's selected collection
	 * using the given ID and data.
	 *
	 * id:
	 *		ID of a stored record, e.g. "abce7982-3279-de82-7391-732cdf233190"
	 * data:
	 *		Data which shall be stored in the database instead of the records old data
	 * handleConflict:
	 *		How shall we act if no record with the given ID is stored
	 *		in the database? Possible values are:
	 *			- "error" (default), i.e. the promise is rejected; or
	 *			- "ignore", i.e. the data is stored as a new record; or
	 *			- "skip", i.e. the new data is not stored.
	 *
	 * returns:
	 *		Resolves with true iff the new data was successfully stored using the given ID
	 *
	 * @param	{null|string}	id
	 * @param	{object}	data
	 * @param	{string}	handleConflict
	 * @returns	{Promise<boolean>}
	 */
	updateItem( id, data, handleConflict = "error" ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}

	/**
	 * Removes a stored recordset from the database's selected collection.
	 *
	 * id:
	 *		ID of a stored record, e.g. "abce7982-3279-de82-7391-732cdf233190"
	 * handleConflict:
	 *		How shall we react in case that no record with the given ID was found?
	 *		Possible values:
	 *		- "error" (default), i.e. the promise is rejected; or
	 *		- "skip", i.e. no recordset is removed.
	 *
	 * returns:
	 *		Resolves with true iff a record with the given ID existed and was deleted
	 *
	 * @param	{string}	id
	 * @param	{string}	handleConflict
	 * @returns	{Promise<boolean>}
	 */
	removeItem( id, handleConflict = "error" ) {
		return Promise.reject( new Error( "Unexpected call of base class method" ) );
	}
}

export default DatabaseAdapterInterface;