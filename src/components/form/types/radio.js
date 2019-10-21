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
 * @this	{Form}
 *		Expects to be called in the scope of class Form
 *
 * @param	{string}	data.name
 *		Internal name of the input field, must be unique within form.
 * @param	{string[]}	data.options
 *		List of selectable alternatives for the radio button group
 * @param	{object}	extraAttributes
 *		Additional attributes to include into opening tag of field
 *
 * @returns	{object}
 *		React component containing the new form input
 */
export function generateField( data, extraAttributes = {} ) {
	assert(
		typeof this.state === "object"
		&& typeof this.state.inputValues === "object"
		&& typeof this.handleInputChange === "function",
		"Missing access to class Form"
	);

	assert( data !== null && typeof data === "object",
		"Invalid argument \"data\"" );

	const { name, options } = data;
	assert( typeof name === "string" && name !== "",
		`Invalid field property "name" (${name})` );
	assert( Array.isArray( options ) && options.length > 0,
		`Invalid field property "options" (${name}: ${options})` );

	const buttonList = [];
	for ( let index = 0; index < data.options.length; index++ ) {
		buttonList.push( <FormGroup check key={index}>
			<Label check>
				<Input
					type="radio"
					name={data.name}
					value={data.options[index]}
					onChange={this.handleInputChange}
				/>{" "}
				{data.options[index]}
			</Label>
		</FormGroup> );
	}

	return React.createElement( Col, { ...extraAttributes, className: "radio" }, buttonList );
}

export default {
	generateField,
};
