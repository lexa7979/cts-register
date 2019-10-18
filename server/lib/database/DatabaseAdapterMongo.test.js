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

/* eslint-disable no-console,max-lines-per-function */

import PromiseTools from "promise-essentials";

import DatabaseAdapter from "./DatabaseAdapter";

const testData = [
	{ id: 1, data: { city: "Stockholm", street: "Jakobsbergsgatan 22" } },
	{ id: 2, data: { city: "Berlin", street: "Bornholmer Straße 96" } },
	{ data: { city: "Stockholm", street: "Jakobsbergsgatan 22" } },
];

const testStat = {
	numBefore:   null,
	numUpdated:  0,
	numInserted: 0,
};

const adapter = DatabaseAdapter.init( "Mongo", "test" );

// eslint-disable-next-line require-jsdoc
function assertAdapterIsReady() {
	return new Promise( ( resolve, reject ) => {
		try {
			if ( adapter.connection == null ) {
				throw new Error( "No connection to database - skipping test." );
			}
			if ( testStat.numBefore == null ) {
				throw new Error( "Number of records unknown" );
			}
		} catch ( error ) {
			reject( error );
		}
		resolve();
	} );
}

describe( "Database adapter to work with Mongo-DB datasource -", () => {
	describe( "when establishing connection", () => {
		it( "with the parameters configured in .dbsetup.js - succeeds",
			() => adapter.connect()
				.then( () => {
					expect( adapter.connection ).not.toBeNull();
				} ) );

		it( "- delivers the current number of recordsets",
			() => adapter.countItems()
				.then( amount => {
					expect( typeof amount ).toBe( "number" );
					expect( amount ).toBeGreaterThanOrEqual( 0 );
					testStat.numBefore = amount;
				} ) );

		// it( "- DENIES changing the connection state from outside", () => {

		// } );
	} );

	describe( "when storing the testdata", () => {
		it( "with predefined record-ID - succeeds", () => assertAdapterIsReady()
			.then( () => PromiseTools.each( testData, item => {
				let foundBefore = null;
				if ( item.id == null ) {
					return null;
				}
				return adapter.checkItem( String( item.id ) )
					.then( found => {
						foundBefore = found;
						return adapter.addItem( String( item.id ), item.data, "ignore" );
					} )
					.then( id => {
						expect( id ).toBe( String( item.id ) );
						if ( foundBefore ) {
							testStat.numUpdated++;
						} else {
							testStat.numInserted++;
						}
					} );
			} ) )
			.then( () => {
				expect( testStat.numUpdated + testStat.numInserted ).toBeGreaterThan( 0 );
			} ) );

		it( "- delivers the incremented number of recordsets", () => assertAdapterIsReady()
			.then( () => adapter.countItems() )
			.then( amount => {
				expect( amount ).toBe( testStat.numBefore + testStat.numInserted );
			} ) );

		it( "without predefined record-ID - succeeds", () => assertAdapterIsReady()
			.then( () => {
				const numInsertedBefore = testStat.numInserted;
				return PromiseTools.each( testData, ( item, index ) => {
					if ( item.id != null ) {
						return null;
					}
					return adapter.addItem( null, item.data )
						.then( id => {
							expect( typeof id ).toBe( "string" );
							expect( id ).not.toBe( "" );
							testData[index].id = id;
							testStat.numInserted++;
						} );
				} )
					.then( () => {
						expect( testStat.numInserted ).toBeGreaterThan( numInsertedBefore );
						console.log( testStat, testData );
					} );
			} ) );

		it( "- delivers the incremented number of recordsets", () => assertAdapterIsReady()
			.then( () => adapter.countItems() )
			.then( amount => {
				expect( amount ).toBe( testStat.numBefore + testStat.numInserted );
			} ) );
	} );
} );
