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
 * Delivers the components for a new group of radio buttons.
 *
 * @this
 *		Expects to be called in the scope of class Form
 *
 * @param	{string}	data.name
 *		Internal name of the input field, must be unique within form.
 * @param	{string[]}	data.options
 *		List of selectable alternatives for the radio button group
 *
 * @returns	{object}
 *		React component containing the new form input
 */
export function generateField( data ) {
	assert(
		typeof this.state === "object"
		// && typeof this.state.inputValues === "object"
		&& typeof this.handleInputChange === "function",
		"Missing access to class Form"
	);

	assert( data !== null && typeof data === "object",
		"Invalid argument \"data\"" );

	const buttonList = [];
	for ( let index = 0; index < data.options.length; index++ ) {
		const id = `${data.name}-radio-${index + 1}`;
		buttonList.push( <div key={id}>
			<input
				type="radio"
				id={id}
				name={data.name}
				value={data.options[index]}
				onChange={this.handleInputChange}
			/>
			<label htmlFor={id}>{data.options[index]}</label>
		</div> );
	}

	return <div key={data.name} className="field radio">{buttonList}</div>;
}

export default {
	generateField,
};
