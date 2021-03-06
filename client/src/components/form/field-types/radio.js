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

import { Col, FormGroup, Label, Input } from "reactstrap";

/**
 * Delivers the components for a new group of radio buttons.
 *
 * @this	{FormGenerator}
 *		Expects to be called in the scope of class FormGenerator
 *
 * @param	{string}	data.name
 *		Internal name of the input field, must be unique within form
 * @param	{object}	data.options
 *		Selectable alternatives for the radio button group
 * @param	{object}	extraAttributes
 *		Additional attributes to include into opening tag of field
 *
 * @returns	{object}
 *		React component containing the new form input
 */
export function generateField( data, extraAttributes = {} ) {
	assert( typeof this === "object" && this.constructor.name === "FormGenerator",
		"Missing access to class FormGenerator" );
	assert( data != null && typeof data === "object",
		`Invalid type of argument "data" (${typeof data})` );
	assert( typeof data.name === "string" && data.name !== "",
		`Invalid field property "name" (${data.name})` );
	assert( data.options != null && typeof data.options === "object",
		`Invalid field property "options" (${data.name}: ${data.options})` );
	assert( extraAttributes != null && typeof extraAttributes === "object",
		`Invalid type of argument "extraAttributes" (${typeof extraAttributes})` );

	const { name, options } = data;

	const buttonList = [];
	for ( const key in options ) {	// eslint-disable-line guard-for-in
		assert( typeof options[key] === "string" && options[key] !== "",
			`Invalid radio-button option (${name}: ${options[key]})` );

		const value = options[key];

		buttonList.push( <FormGroup key={key} check inline>
			<Label check>
				<Input
					type="radio"
					name={name}
					value={key}
					onChange={this.handleInputChange}
					checked={this.state.inputValues[name] === key}
				/>{" "}
				{value}
			</Label>
		</FormGroup> );
	}

	return React.createElement( Col, extraAttributes, buttonList );
}

export default {
	generateField,
};
