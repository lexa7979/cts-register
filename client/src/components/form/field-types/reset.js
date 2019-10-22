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

import { Button } from "reactstrap";

/**
 * Delivers the component for a new submit button.
 *
 * @this	{Form}
 *		Expects to be called in the scope of class Form
 *
 * @param	{null|string}	data.name
 *		Optional: Internal name of the input field, must be unique within form
 * @param	{null|string}	data.value
 *		Optional: Caption of the submit button
 * @param	{null|boolean}	data.focus
 *		Optional: True iff the input field shall be focused initially
 * @param	{object}	extraAttributes
 *		Additional attributes to include into opening tag of field
 *
 * @returns	{object}
 *		React component containing the new form input
 */
export function generateField( data, extraAttributes = {} ) {
	assert(
		typeof this.state === "object"
		&& Array.isArray( this.state.actions ),
		"Missing access to class Form"
	);

	assert( data != null && typeof data === "object",
		`Invalid type of argument "data" (${typeof data})` );

	const { name = "reset", label = "Reset", focus = false } = data;
	assert( name == null || typeof name === "string",
		`Invalid field property "name" (${name})` );
	assert( label == null || typeof label === "string",
		`Invalid field property "label" (${name}: ${label})` );
	assert( focus == null || typeof focus === "boolean",
		`Invalid field property "focus" (${name}: ${focus})` );

	const disabled = this.state.actions.includes( name ) ? null : true;

	const fieldProperties = {
		...extraAttributes,

		key:       name,
		autoFocus: focus ? "autofocus" : null,

		onClick:   this.handleReset,
		color:     disabled ? null : "warning",
		disabled,
	};

	for ( const key in fieldProperties ) {
		if ( fieldProperties[key] == null ) {
			delete fieldProperties[key];
		}
	}

	return React.createElement( Button, fieldProperties, label );
}

export default {
	generateField,
};
