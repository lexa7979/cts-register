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

import DatabaseAdapter from "./DatabaseAdapter";

import assert from "assert";
import { MongoClient } from "mongodb";

import Configuration from "../../.dbsetup";

/**
 * Implements the common API of DatabaseAdapter to store data in a Mongo-DB datasource.
 *
 * Best way to start using this is to call DatabaseAdapter.init( "Mongo", <collection> ).
 *
 * @implements {DatabaseAdapter}
 */
export class DatabaseAdapterMongo extends DatabaseAdapter {
	/**
	 * Preparing a new instance to store data which is related to the given collection.
	 *
	 * Please note:
	 * This constructor will be called by DatabaseAdapter.init().
	 * It's not recommended to call it directly.
	 *
	 * @param	{string}	collection
	 *		Name of a collection inside the datasource where similar data is stored, e.g.
	 *			"users"
	 */
	constructor( collection ) {
		super( collection );

		this.connection = null;
		this.revisions = null;
	}

	/**
	 * Determines if this database adapter knows how to handle revisions of collections or not.
	 *
	 * @returns	{Promise<boolean>}
	 * /
	hasRevisions() {
		return Promise.resolve( true );
	}

	/**
	 * Determines the current revision number of the connected collection.
	 *
	 * This number is incremented everytime some changes are made to the collection
	 * (i.e. record added, record updated or record removed).
	 *
	 * The revision number can be used to determine if locally cached content from the database
	 * might have changed in the meantime and needs to be refreshed.
	 *
	 * @returns	{Promise<number>}
	 *		Resolves with the revision number of the current collection, e.g. 12; or
	 *		Resolves with 0 if no revision number was found.
	 * /
	getRevision() {
		try {
			assert( this.revisions != null,
				"No connection to database" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return this.revisions.findOne( { _id: this.collection } )
			.then( result => (
				result == null || result.current == null || typeof result.current !== "number"
					? 0
					: result.current
			) );
	}

	/**
	 * Increments the current revision number of the selected collection.
	 *
	 * If no revision number was stored for the selected collection,
	 * it's initialised with number 1.
	 *
	 * @returns	{Promise<number>}
	 *		Resolves with the new revision number
	 * /
	nextRevision() {
		let oldRevision = null;
		return this.getRevision()
			.then( revision => {
				oldRevision = revision;
				return revision === 0
					? this.revisions.insertOne( { _id: this.collection, current: 1 } )
					: this.revisions.updateOne( { _id: this.collection }, { $inc: { current: 1 } } );
			} )
			.then( () => this.getRevision() )
			.then( revision => {
				assert( revision > oldRevision,
					"Incrementing revision number failed" );
				return revision;
			} );
	}

	/**
	 * @returns {Promise}
	 */
	connect() {
		try {
			assert( typeof Configuration.url === "string" && Configuration.url !== "",
				"Can't establish connection to database - configure URL in file .dbsetup.js" );
			assert( typeof Configuration.database === "string" && Configuration.database !== "",
				"Can't establish connection to database - configure database name in file .dbsetup.js" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		if ( this.connection == null ) {
			return MongoClient.connect( Configuration.url )
				.then( client => {
					const db = client.db( Configuration.database );
					this.connection = db.collection( this.collection );
					this.revisions = db.collection( "revisions" );
					client.close();
				} );
		}

		return Promise.resolve();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<boolean>}
	 */
	checkItem( id ) {
		let cursor = null;
		try {
			assert( this.connection != null,
				"No connection to database" );
			assert( typeof id === "string" && id !== "",
				"Invalid ID argument" );
			cursor = this.connection.find( { _id: id } );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return cursor.count()
			.then( amount => amount === 1 );
	}

	/**
	 * @param	{object}	filterObject
	 *		See https://docs.mongodb.com/manual/reference/operator/query/
	 *		for composing selectors.
	 * @returns	{Promise<number>}
	 */
	countItems( filterObject = {} ) {
		let cursor = null;
		try {
			assert( filterObject != null && typeof filterObject === "object",
				"Invalid argument \"filterObject\"" );
			cursor = this.connection.find( filterObject );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return cursor.count();
	}

	/**
	 * @param	{object}	filterObject
	 *		See https://docs.mongodb.com/manual/reference/operator/query/
	 *		for composing selectors with Mongo DB.
	 * @param	{number}	offset
	 * @param	{number}	limit
	 * @returns	{Promise<object[]>}
	 */
	findItems( filterObject = {}, offset = 0, limit = Infinity ) {
		let cursor = null;
		try {
			assert( filterObject != null && typeof filterObject === "object",
				"Invalid argument \"filterObject\"" );
			assert( typeof offset === "number" && offset >= 0,
				"Invalid argument \"offset\"" );
			assert( typeof limit === "number" && limit >= 0,
				"Invalid argument \"limit\"" );

			cursor = this.connection.find( filterObject );
			cursor.skip( offset ).limit( limit === Infinity ? 0 : limit );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return cursor.toArray()
			.then( dataList => dataList.map( item => ( { ...item.data, id: item._id } ) ) );	// eslint-disable-line no-underscore-dangle
	}

	/**
	 * @param	{string}	id
	 * @returns	{Promise<object|null>}
	 */
	getItem( id ) {
		try {
			assert( typeof id === "string" && id !== "",
				"Invalid ID argument" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return this.connection.findOne( { _id: id } )
			.then( result => ( result == null ? null : { ...result.data, id } ) );
	}

	/**
	 * @param	{null|string}	id
	 * @param	{object}	data
	 * @param	{string}	handleConflict
	 * @returns	{Promise<string|null>}
	 */
	addItem( id, data, handleConflict = "error" ) {
		try {
			assert( id == null || ( typeof id === "string" && id !== "" ),
				"Invalid ID argument" );
			assert( typeof data === "object",
				"Invalid data argument" );
			assert( [ "error", "ignore", "skip" ].indexOf( handleConflict ) >= 0,
				"Invalid argument \"handleConflict\"" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return ( id == null ? Promise.resolve( false ) : this.checkItem( id ) )
			.then( oldRecordFound => {
				if ( !oldRecordFound ) {
					return this.connection.insertOne( { data } );
				}

				switch ( handleConflict ) {
				default:
				case "error":
					throw new Error( "Adding item failed - ID already in use" );
				case "skip":
					return null;
				case "ignore":
					return this.connection.replaceOne( { _id: id }, { data, _id: id } );
				}
			} )
			.then( result => {
				if ( result == null ) {
					return null;
				}

				assert( result.insertedCount === 1 || result.upsertedCount === 1,
					"Adding new recordset failed" );
				if ( id == null ) {
					return result.insertedId == null ? result.upsertedId._id : result.insertedId._id;	// eslint-disable-line no-underscore-dangle
				}
				return id;
			} );
	}

	/**
	 * @param	{null|string}	id
	 * @param	{object}	data
	 * @param	{string}	handleConflict
	 * @returns	{Promise<boolean>}
	 */
	updateItem( id, data, handleConflict = "error" ) {
		try {
			assert( typeof id === "string" && id !== "",
				"Invalid ID argument" );
			assert( typeof data === "object",
				"Invalid data argument" );
			assert( [ "error", "ignore", "skip" ].indexOf( handleConflict ) >= 0,
				"Invalid argument \"handleConflict\"" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return ( handleConflict === "error" ? this.checkItem( id ) : Promise.resolve( false ) )
			.then( oldRecordFound => {
				if ( !oldRecordFound ) {
					if ( handleConflict === "error" ) {
						throw new Error( "Updating item failed - unknown record ID" );
					}
					if ( handleConflict === "skip" ) {
						return null;
					}
				}

				return this.connection.replaceOne( { _id: id }, { data, _id: id }, { upsert: true } );
			} )
			.then( result => {
				if ( result == null ) {
					return false;
				}

				assert( result.upsertedCount === 1,
					"Updating recordset failed" );
				return true;
			} );
	}

	/**
	 * @param	{string}	id
	 * @param	{string}	handleConflict
	 * @returns	{Promise<boolean>}
	 */
	removeItem( id, handleConflict = "error" ) {
		try {
			assert( typeof id === "string" && id !== "",
				"Invalid ID argument" );
			assert( [ "error", "skip" ].indexOf( handleConflict ) >= 0,
				"Invalid argument \"handleConflict\"" );
		} catch ( error ) {
			return Promise.reject( error );
		}

		return this.connection.deleteOne( { _id: id } )
			.then( result => {
				assert( result.deletedCount === 1 || handleConflict === "skip",
					"Removing recordset failed" );
				return result.deleteCount === 1;
			} );
	}
}

DatabaseAdapterMongo.prototype.checkItem = () => null;

export default DatabaseAdapterMongo;
