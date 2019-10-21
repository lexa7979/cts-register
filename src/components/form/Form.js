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

/* eslint-disable class-methods-use-this */

import assert from "assert";

import React from "react";
import PropTypes from "prop-types";
import { Form as ReactstrapForm, FormGroup, Col, Label, FormText } from "reactstrap";

import FormTypes from "./types";

const propTypes = {
	fields:       PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	formClass:    PropTypes.string,
	validateData: PropTypes.func,
};

const defaultProps = {};

/**
 * Component which contains an input form
 */
export class Form extends React.Component {
	/**
	 * Initialising component
	 */
	constructor( props ) {
		super( props );

		this.state = {
			inputValues: {},
			touched:     {},
			messages:    {},
			actions:     [],
		};

		this.fieldList = [];
		for ( const name in this.props.fields ) {
			if ( typeof name === "string" && name !== "" ) {
				const { type = "input", value = "" } = this.props.fields[name];
				assert(
					FormTypes[type] != null
					&& typeof FormTypes[type] === "object"
					&& typeof FormTypes[type].generateField === "function",
					`Unsupported field type "${type}" (${name})`
				);
				this.fieldList[name] = {
					...this.props.fields[name],

					name,
					type,
					id: `${this.props.formClass || "form"}-${name}`,
				};
				this.state.inputValues[name] = value;
			}
		}

		this.validation = {
			progressing: false,
			requested:   false,
		};

		this.handleInputChange = this.handleInputChange.bind( this );
		this.onSubmit = this.onSubmit.bind( this );
	}

	/**
	 * Actions to take when component is ready
	 */
	componentDidMount() {
		this.runValidation();
	}

	/**
	 * Validates the form inputs if props.validateData is given
	 *
	 * If another (asynchronous) validation is already in progress,
	 * nothing will be done, now. Still, it's memorised that
	 * another validation shall be run just after the active one
	 * has finished.
	 */
	runValidation() {
		if ( typeof this.props.validateData !== "function" ) {
			return Promise.resolve();
		}

		if ( this.validation.progressing ) {
			this.validation.requested = true;
			return Promise.resolve();
		}
		this.validation.progressing = true;

		return Promise.resolve( this.props.validateData( this.state.inputValues ) )
			.then( result => {
				this.validation.progressing = false;
				if ( this.validation.requested ) {
					this.validation.requested = false;
					this.runValidation();
					return;
				}

				if (
					result != null && typeof result === "object"
					&& Array.isArray( result.actions )
					&& result.messages != null && typeof result.messages === "object"
				) {
					this.setState( { actions: result.actions, messages: result.messages } );
				}
			} );
	}

	/**
	 * Wraps the given input component into a new div-container.
	 * A label-element will be added if requested.
	 */
	labelGenerator( fieldData, extraAttributes = {} ) {
		assert( fieldData != null && typeof fieldData === "object",
			"Invalid argument \"fieldData\"" );

		const { name, label, type, id } = fieldData;
		assert( typeof name === "string" && name !== "",
			`Invalid field property "name" (${name})` );
		assert( label == null || ( typeof label === "string" && label !== "" ),
			`Invalid field property "label" (${name}: ${label})` );
		assert( typeof type === "string" && type !== "",
			`Invalid field property "type" (${name}: ${type})` );
		assert( typeof id === "string" && id !== "",
			`Invalid field property "id" (${name}: ${id})` );

		const fieldProperties = {
			...extraAttributes,
			key:       `${name}-label`,
			className: `${label ? "label" : "nolabel"} ${type}`,
		};

		for ( const key in fieldProperties ) {
			if ( !fieldProperties[key] ) {
				delete fieldProperties[key];
			}
		}

		return label
			? React.createElement( Label, { ...fieldProperties, for: id }, label )
			: React.createElement( Col, fieldProperties );
	}

	/**
	 * If there is a message for the given input field,
	 * a matching component to show this text is composed.
	 *
	 * @param	{string}	inputName
	 */
	messageGenerator( inputName ) {
		assert( typeof inputName === "string" && inputName !== "", "Invalid argument" );

		return ( inputName === "submit" || this.state.touched[inputName] ) && this.state.messages[inputName]
			? <FormText key={`${inputName}-message`}>{this.state.messages[inputName]}</FormText>
			: null;
	}

	/**
	 *
	 * @param	{string}	name
	 */
	generateField( name ) {
		const data = this.fieldList[name];
		assert( data != null && typeof data === "object",
			`Invalid argument "name" (${name})` );
		assert( typeof data.type === "string" && typeof FormTypes[data.type] === "object",
			`Invalid field type (${data.type})` );

		const id = `${this.props.formClass || "form"}-${data.name}`;

		const label = this.labelGenerator( data, { sm: 3 } );
		const field = FormTypes[data.type].generateField.call( this, data, { id } );
		const message = this.messageGenerator( data.name );

		return <FormGroup row key={name}>
			{label}
			<Col sm={9}>
				{field}
				{message || ""}
			</Col>
		</FormGroup>;
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

		this.setState( { inputValues: { ...this.state.inputValues, [name]: value } }, () => {
			this.runValidation()
				.then( () => {
					if ( this.state.touched[name] !== true ) {
						this.setState( { touched: { ...this.state.touched, [name]: true } } );
					}
				} );
		} );
	}

	/**
	 * Handles events whenever a user clicks on one of the submit buttons
	 */
	onSubmit( event ) {
		event.preventDefault();

		if ( typeof this.props.handleSubmit === "function" ) {
			this.props.handleSubmit( this.state.inputValues );
		}
	}

	/**
	 * Composing output
	 */
	render() {
		if ( this.fieldList === null || typeof this.fieldList !== "object" ) {
			return <div className="empty-form"></div>;
		}

		const formGroups = [];
		const submitFields = [];
		for ( const name in this.fieldList ) {
			if ( typeof name === "string" && name !== "" ) {
				const data = this.fieldList[name];
				if ( data.type === "submit" ) {
					submitFields.push( FormTypes.submit.generateField.call( this, data ) );
				} else {
					const newField = this.generateField( name );
					if ( newField != null ) {
						formGroups.push( newField );
					}
				}
			}
		}

		if ( submitFields.length === 0 ) {
			submitFields.push( FormTypes.submit.generateField.call( this, { value: "Submit" } ) );
		}
		const submitMessage = this.messageGenerator( "submit" );

		return <ReactstrapForm
			className={this.props.formClass ? `form ${this.props.formClass}` : "form"}
			onSubmit={this.onSubmit}
		>
			{formGroups}
			<FormGroup row>
				<Col sm={{ size: 9, offset: 3 }}>
					{submitFields}
					{submitMessage}
				</Col>
			</FormGroup>
		</ReactstrapForm>;
	}
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
