/**
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
import PropTypes from "prop-types";

/**
 * Component which contains an input form.
 *
 * @property Component.formFields
 *		The needed input fields must be given as an object-property formFields.
 *		The following input types are supported:
 *		- "input" with needed settings "name", "type"
 *		  and optionally "label", "value", "placeholder", e.g.
 *				{ name: "fullname", type: "input", label: "What's your name?" }
 *		- "textarea" with needed settings "name", "type"
 *		  and optionally "label", "value", "placeholder", "cols", "rows", e.g.
 *	 			{ name: "comments", type: "textarea", placeholder: "Any comments?", rows: 3 }
 *		- "select"
 *		- "checkbox"
 *		- "hidden"
 */
class Form extends React.Component {
	// eslint-disable-next-line require-jsdoc
	constructor( props ) {
		super( props );

		this.state = {
			inputValues: {},
		};

		const { formFields: fields } = this.props;
		this.fieldList = [];
		for ( const name in fields ) {
			if ( typeof name === "string" && name !== "" ) {
				const { type } = fields[name];
				if ( typeof this[`${type}FieldGenerator`] !== "function" ) {
					throw new Error( `Unsupported field type "${type}" (${name})` );
				}
				this.fieldList[name] = { ...fields[name], name, type };
			}
		}

		this.handleInputChange = this.handleInputChange.bind( this );
	}

	/**
	 * Handles the change event of any form field
	 *
	 * @param	{object}	event
	 *		Description of the event to handle
	 */
	handleInputChange( event ) {
		const { name } = event.target;
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;

		this.setState( { ...this.state.inputValues, [name]: value } );
	}

	/**
	 * Wraps the given input component into a new div-container.
	 * A label-element will be added if requested.
	 *
	 * @param	{string} 	inputName
	 * @param	{null|string} 	label
	 * @param	{object} 	inputComponent
	 */
	static labelBoxingGenerator( inputName, label, inputComponent ) {
		if ( label ) {
			return <div className="field labeled" key={inputName}>
				<label htmlFor={inputName}>{label}</label>
				{inputComponent}
			</div>;
		}

		return <div className="field unlabeled" key={inputName}>
			<div></div>
			{inputComponent}
		</div>;
	}

	/**
	 * Delivers the components for a new text field.
	 *
	 * @param	{object}	data
	 */
	inputFieldGenerator( data ) {
		return this.labelBoxingGenerator(
			data.name,
			data.label,
			<input
				name={data.name}
				type="text"
				value={this.state.inputValues[data.name] || "" }
				placeholder={data.placeholder || null}
				onChange={this.handleInputChange}
			/>
		);
	}

	/**
	 * Delivers the components for a new multiline text field.
	 *
	 * @param	{object}	data
	 */
	textareaFieldGenerator( data ) {
		return this.labelBoxingGenerator(
			data.name,
			data.label,
			<textarea
				name={data.name}
				value={this.state.inputValues[data.name] || ""}
				cols={data.cols || null}
				rows={data.rows || null}
				placeholder={data.placeholder || null}
				onChange={this.handleInputChange}
			/>
		);
	}

	/**
	 * Delivers the components for a new select box.
	 *
	 * @param	{object}	data
	 */
	selectFieldGenerator( data ) {
		return this.labelBoxingGenerator(
			data.name,
			data.label,
			<div></div>
		);
	}

	/**
	 * Delivers the components for a new checkbox field.
	 *
	 * @param {*} data
	 */
	checkboxFieldGenerator( data ) {
		return this.labelBoxingGenerator(
			data.name,
			data.label,
			<div></div>
		);
	}

	/**
	 * Delivers the components for a new hidden field.
	 *
	 * @param {*} data
	 */
	static hiddenFieldGenerator( data ) {
		return <input type="hidden" key={data.name} name={data.name} value={data.value} />;
	}

	// eslint-disable-next-line require-jsdoc
	render() {
		const formFields = [];
		this.fieldList.forEach( fieldData => {
			formFields.push( this[`${fieldData.type}FieldGenerator`]( fieldData ) );
		} );

		return <form
			className={this.props.formClass ? `form ${this.props.formClass}` : "form"}
			onSubmit={() => this.props.handleSubmit( this.state.inputValues )}
		>
			<div className="fields">
				{formFields}
			</div>
			<div className="final">
				<input className="submit" type="submit" value="Submit" />
			</div>
		</form>;
	}
}

Form.propTypes = {
	formClass:    PropTypes.string,
	formFields:   PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

export default Form;
