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

import React from "react";
import assert from "assert";

/**
 * Delivers the components for a new text field.
 *
 * @this
 *		Expects to be called in the scope of class Form
 *
 * @param	{string}	data.name
 *		Internal name of the input field, must be unique within form.
 * @param	{null|string}	data.placeholder
 *		Optional: Hint to show as long as input field is empty
 * @param	{null|boolean}	data.focus
 *		Optional: True iff the input field shall be focused initially
 *
 * @returns	{object}
 *		React component containing the new form input
 */
export function generateField( data ) {
	assert(
		typeof this.state === "object"
		&& typeof this.state.inputValues === "object"
		&& typeof this.handleInputChange === "function",
		"Missing access to class Form"
	);

	assert( data !== null && typeof data === "object",
		"Invalid argument \"data\"" );
	assert( typeof data.name === "string" && data.name !== "",
		"Invalid argument \"data.name\"" );
	assert( data.placeholder == null || typeof data.placeholder === "string",
		"Invalid argument \"data.placeholder\"" );
	assert( data.focus == null || typeof data.focus === "boolean",
		"Invalid argument \"data.focus\"" );

	const allProperties = {
		key:         data.name,
		name:        data.name,
		value:       this.state.inputValues[data.name] || "",
		placeholder: data.placeholder,
		autoFocus:   data.focus ? "autofocus" : null,
		onChange:    this.handleInputChange,
		className:   "field input",

		type: "text",
	};

	const fieldProperties = {};
	for ( const key in allProperties ) {
		if ( allProperties[key] != null ) {
			fieldProperties[key] = allProperties[key];
		}
	}

	return React.createElement( "input", fieldProperties );
}

export default {
	generateField,
};
