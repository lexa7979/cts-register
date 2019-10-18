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
import DatabaseAdapterMongo from "./DatabaseAdapterMongo";

/**
 * Use this function to initialise one of the known database adapters
 * in order to handle a fixed collection.
 *
 * @param	{string}	adapterName
 *		Identifier of the database adapter which shall be used.
 *		These adapters are supported so far:
 *		- "Mongo"
 * @param	{string}	collection
 *		Name of a collection inside the datasource where similar data is stored, e.g.
 *			"users"
 */
export function init( adapterName, collection ) {
	assert( typeof adapterName === "string" && adapterName !== "",
		"Invalid argument \"adapterName\"" );
	assert( typeof collection === "string" && collection !== "",
		"Invalid argument \"collection\"" );

	switch ( adapterName ) {
	default:
		throw new Error( `Unknown database adapter given (${adapterName}).` );
	case "Mongo":
	case "DatabaseAdapterMongo":
		return new DatabaseAdapterMongo( collection );
	}
}

export default {
	init,
};
