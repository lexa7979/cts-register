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

const assert = require( "assert" );

const data = [
	{ id: 79, firstname: "Alexander", lastname: "Urban", attending: "yes" },
	{ id: 80, firstname: "Johnny", lastname: "Puma", attending: "no" },
];

/**
 *
 * @param {*} record
 */
function getAttendee( record ) {
	for ( let index = 0; index < data.length; index++ ) {
		if ( record.firstname === data[index].firstname && record.lastname === data[index].lastname ) {
			return data[index];
		}
	}

	return null;
}

/**
 *
 * @param {*} record
 */
function saveAttendee( record, handleConflicts = "error" ) {
	assert( typeof record === "object", "Invalid argument \"record\"" );
	[ "firstname", "lastname", "attending" ].forEach( key => {
		assert(
			typeof record[key] === "string" && record[key] !== "",
			`Invalid argument "record.${key}"`
		);
	} );

	const check = getAttendee( record );

	if ( check == null ) {
		const id = data.reduce( ( result, item ) => Math.max( item.id, result ), 0 ) + 1;
		const item = { ...record, id };
		data.push( item );
		return item;
	}

	switch ( handleConflicts ) {
	case "error":
		throw new Error( "Can't save record - name is already registered." );
	case "overwrite":
		for ( let index = 0; index < data.length; index++ ) {
			if ( data[index].id === check.id ) {
				data[index].attending = record.attending;
				return data[index];
			}
		}
		throw new Error( "Overwriting record failed - no longer found old record" );
	case "skip":
		return check;
	default:
		throw new Error( "Invalid argument \"handleConflicts\"" );
	}
}

/**
 *
 */
function listAttendees() {
	return data;
}

/**
 * Handles GET-requests to manage the attendees of an event
 *
 * @param	{string}	path
 *		Base URL the server uses for this service
 *
 * @this
 */
function handleAppRequest( path ) {
	this.get( path, ( req, res ) => {
		try {
			const recordList = listAttendees();
			res.status( 200 ).json( { items: recordList, count: recordList.length } );
		} catch ( error ) {
			res.status( 500 ).json( { error: error.message } );
		}
	} );

	this.get( `${path}/:firstname/:lastname`, ( req, res ) => {
		const { firstname, lastname } = req.params;
		try {
			const attendee = getAttendee( { firstname, lastname } );
			if ( attendee == null ) {
				res.status( 404 ).json( { error: "There is no record with the given content." } );
			} else {
				res.status( 200 ).json( attendee );
			}
		} catch ( error ) {
			res.status( 500 ).json( { error: error.message } );
		}
	} );

	this.put( path, ( req, res ) => {
		const { firstname, lastname, attending } = req.body;
		try {
			const result = saveAttendee( { firstname, lastname, attending } );
			res.status( 200 ).json( result );
		} catch ( error ) {
			res.status( 400 ).json( { error: error.message } );
		}
	} );
}

module.exports = {
	handleAppRequest,
};
