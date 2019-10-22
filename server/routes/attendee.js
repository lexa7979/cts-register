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

const Store = require( "../services/AttendeeStore" );

/**
 * Handles GET-requests to manage the attendees of an event
 *
 * @this	{Application}
 *		Function is expected to be called in the scope of to the Express app
 *
 * @param	{string}	path
 *		Base URL the server uses for this service
 */
function handleAppRequest( path ) {
	this.get( path, ( req, res ) => {
		try {
			const recordList = Store.getInstance().listItems();
			res.status( 200 ).json( { count: recordList.length, items: recordList } );
		} catch ( error ) {
			res.status( 500 ).json( { error: error.message } );
		}
	} );

	this.get( `${path}/:firstname/:lastname`, ( req, res ) => {
		const { firstname, lastname } = req.params;
		try {
			const attendee = Store.getInstance().getItem( { firstname, lastname } );
			if ( attendee == null ) {
				res.status( 200 )
					.json( { success: false, code: "NOTFOUND", error: "There is no record with the given content." } );
			} else {
				res.status( 200 ).json( { success: true, item: attendee } );
			}
		} catch ( error ) {
			res.status( 500 ).json( { error: error.message } );
		}
	} );

	this.put( path, ( req, res ) => {
		const { firstname, lastname, attending } = req.body;
		try {
			const result = Store.getInstance().saveItem( { firstname, lastname, attending }, "overwrite" );
			res.status( 200 ).json( result );
		} catch ( error ) {
			res.status( 400 ).json( { error: error.message } );
		}
	} );
}

module.exports = {
	handleAppRequest,
};
