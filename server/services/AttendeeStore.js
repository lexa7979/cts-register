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

const stores = {};

/**
 * Class to manage basic database stores
 * which contain data about people attending an event.
 *
 * The data will only be managed in memory.
 * The store might contain some example recordsets in the beginning.
 */
class AttendeeStore {
	/**
	 * Use this method to get your instance of the store.
	 */
	static getInstance( storeID = "default" ) {
		if ( stores[storeID] == null ) {
			stores[storeID] = new AttendeeStore();
		}
		return stores[storeID];
	}

	/**
	 * Initialises a new store
	 */
	constructor() {
		this.data = [
			{ id: 1, firstname: "Alexander", lastname: "Urban", attending: "yes" },
			{ id: 2, firstname: "Johnny", lastname: "Puma", attending: "no" },
		];

		this.locales = [ "sv-SE", "de-DE" ];
	}

	/**
	 * Looks for a stored recordset related to the given attendee
	 *
	 * @param	{object}	record
	 * @param	{string}	record.firstname
	 *		First name of the stored attendee
	 * @param	{string}	record.lastname
	 *		Last name of the stored attendee
	 *
	 * @returns	{null|object}
	 *		Complete recordset of the stored attendee; or
	 *		Null if no recordset was found
	 */
	getItem( record ) {
		assert( record != null && typeof record === "object",
			`Invalid type of argument "record" (${typeof record})` );
		assert( typeof record.firstname === "string" && record.firstname !== "",
			`Invalid argument "record.firstname" (${record.firstname})` );
		assert( typeof record.lastname === "string" && record.lastname !== "",
			`Invalid argument "record.lastname" (${record.lastname})` );

		const firstname = record.firstname.toLocaleLowerCase( this.locales );
		const lastname = record.lastname.toLocaleLowerCase( this.locales );

		for ( let index = 0; index < this.data.length; index++ ) {
			if (
				firstname === this.data[index].firstname.toLocaleLowerCase( this.locales )
				&& lastname === this.data[index].lastname.toLocaleLowerCase( this.locales )
			) {
				return this.data[index];
			}
		}

		return null;
	}

	/**
	 * Stores a new recordset (or updates an existing one)
	 *
	 * @param	{object}	record
	 * @param	{string}	record.firstname
	 * @param	{string}	record.lastname
	 * @param	{string}	record.attending
	 *
	 * @param	{string}	handleConflicts
	 *		How shall we react in case that there already is a recordset related to the given person?
	*		- "error", if you want an error to be thrown
	*		- "overwrite", if you want the old data to be discarded
	*		- "skip", if you want the new data to be discarded
	*
	* @returns	{object}
	*		Data of the stored recordset
	*
	* @throws
	*/
	saveItem( record, handleConflicts = "error" ) {
		assert( record != null && typeof record === "object",
			`Invalid type of argument "record" (${typeof record})` );
		[ "firstname", "lastname", "attending" ].forEach( key => {
			assert( typeof record[key] === "string" && record[key] !== "",
				`Invalid argument "record.${key}" (${record[key]})` );
		} );

		const check = this.getAttendee( record );
		if ( check == null ) {
			const id = this.data.reduce( ( result, item ) => Math.max( item.id, result ), 0 ) + 1;
			const item = { ...record, id };
			this.data.push( item );
			return item;
		}

		switch ( handleConflicts ) {
		case "error":
			throw new Error( "Can't save record - name is already registered." );
		case "overwrite":
			for ( let index = 0; index < this.data.length; index++ ) {
				if ( this.data[index].id === check.id ) {
					this.data[index].attending = record.attending;
					return this.data[index];
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
	 * Delivers a list of all stored recordsets
	 *
	 * @returns	{object[]}
	 */
	listItems() {
		return this.data;
	}
}


module.exports = {
	getInstance: AttendeeStore.getInstance,
};
