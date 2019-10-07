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

import assert from "assert";

import React from "react";
import PropTypes from "prop-types";

const propTypes = {
	formClass:    PropTypes.string,
	fields:       PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
};

const defaultProps = {};

/**
 * Component which contains an input form.
 *
 * @property Component.fields
 *		The needed input fields must be given as an object-property "fields".
 *		The following input types are supported:
 *		- "input" with optional settings "label", "value", "placeholder", e.g.
 *				fullname: { type: "input", label: "What's your name?" }
 *		- "textarea" with optional settings "label", "value", "placeholder", "cols", "rows", e.g.
 *	 			comments: { type: "textarea", placeholder: "Any comments?", rows: 3 }
 *		- "select"
 *		- "checkbox"
 *		- "hidden"
 */
export class Form extends React.Component {
	// eslint-disable-next-line require-jsdoc
	constructor( props ) {
		super( props );

		if (
			this.props.fields === null
			|| typeof this.props.fields !== "object"
			|| typeof this.props.handleSubmit !== "function"
		) {
			return;
		}

		this.state = {
			inputValues: {},
		};

		const { fields } = this.props;
		this.fieldList = [];
		for ( const name in fields ) {
			if ( typeof name === "string" && name !== "" ) {
				const { type = "input", value = "" } = fields[name];
				if ( typeof this[`${type}FieldGenerator`] !== "function" ) {
					throw new Error( `Unsupported field type "${type}" (${name})` );
				}
				this.fieldList[name] = { ...fields[name], name, type };
				this.state.inputValues[name] = value;
			}
		}

		this.handleInputChange = this.handleInputChange.bind( this );
		this.onSubmit = this.onSubmit.bind( this );
	}

	/**
	 * Wraps the given input component into a new div-container.
	 * A label-element will be added if requested.
	 *
	 * @param	{string} 	inputName
	 * @param	{null|string} 	label
	 * @param	{object} 	inputComponent
	 */
	labelBoxingGenerator( inputName, label, inputComponent ) {	// eslint-disable-line class-methods-use-this
		assert( typeof inputName === "string" && inputName !== "", "Invalid argument" );
		assert( label == null || ( typeof label === "string" && label !== "" ), "Invalid argument" );
		assert( inputComponent != null && typeof inputComponent === "object", "Missing argument" );

		if ( label ) {
			return <div className="field labeled" key={inputName}>
				<label htmlFor={inputName}>{label}</label>
				{inputComponent}
			</div>;
		}

		return <div className="field unlabeled" key={inputName}>
			<div className="nolabel"></div>
			{inputComponent}
		</div>;
	}

	/**
	 * Delivers the components for a new text field.
	 *
	 * @param	{object}	data
	 */
	inputFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

		return this.labelBoxingGenerator(
			data.name,
			data.label,
			<input
				name={data.name}
				type="text"
				value={this.state.inputValues[data.name]}
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
		assert( data !== null && typeof data === "object", "Invalid argument" );

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
		assert( data !== null && typeof data === "object", "Invalid argument" );

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
		assert( data !== null && typeof data === "object", "Invalid argument" );

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
		assert( data !== null && typeof data === "object", "Invalid argument" );

		return <input type="hidden" key={data.name} name={data.name} value={data.value} />;
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

		this.setState( { inputValues: { ...this.state.inputValues, [name]: value } } );
	}

	/**
	 *
	 */
	onSubmit( event ) {
		event.preventDefault();

		if ( typeof this.props.handleSubmit === "function" ) {
			this.props.handleSubmit( this.state.inputValues );
		}
	}

	// eslint-disable-next-line require-jsdoc
	render() {
		if ( this.fieldList === null || typeof this.fieldList !== "object" ) {
			return <div className="empty-form"></div>;
		}

		const formFields = [];
		for ( const name in this.fieldList ) {	// eslint-disable-line guard-for-in
			const data = this.fieldList[name];
			formFields.push( this[`${data.type}FieldGenerator`]( data ) );
		}

		return <form
			className={this.props.formClass ? `form ${this.props.formClass}` : "form"}
			onSubmit={this.onSubmit}
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

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
