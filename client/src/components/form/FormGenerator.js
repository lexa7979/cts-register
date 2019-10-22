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
import { Alert, Form, FormGroup, Col, Label, FormText } from "reactstrap";

import FieldTypes from "./field-types";

const propTypes = {
	fields:       PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	formClass:    PropTypes.string,
	validateData: PropTypes.func,
};

const defaultProps = {};

const initialState = {
	inputValues: {},
	touched:     {},
	messages:    {},
	actions:     [ "submit" ],
	alert:       null,
};

/**
 * Component which contains an input form
 */
export class FormGenerator extends React.Component {
	/**
	 * Initialising component
	 */
	constructor( props ) {
		super( props );

		this.state = { ...initialState };

		this.fieldList = [];
		for ( const name in this.props.fields ) {
			if ( typeof name === "string" && name !== "" ) {
				const { type = "input", value = "" } = this.props.fields[name];
				assert(
					FieldTypes[type] != null
					&& typeof FieldTypes[type] === "object"
					&& typeof FieldTypes[type].generateField === "function",
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

		this.mounted = false;
		this.alertTimeout = null;

		this.handleInputChange = this.handleInputChange.bind( this );
		this.runValidation = this.runValidation.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleReset = this.handleReset.bind( this );
	}

	/**
	 * Actions to take when component is ready
	 */
	componentDidMount() {
		this.mounted = true;
		this.runValidation();
	}

	/**
	 * Actions to take before component will be removed
	 */
	componentWillUnmount() {
		this.mounted = false;
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
		if ( typeof this.props.validateData !== "function" || !this.mounted ) {
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
					this.mounted
					&& result != null && typeof result === "object"
					&& Array.isArray( result.actions )
					&& result.messages != null && typeof result.messages === "object"
				) {
					this.setState( { actions: result.actions, messages: result.messages } );
				}
			} );
	}

	/**
	 * Creates a React component
	 * if a global alert-message shall be shown.
	 *
	 * The information message automatically hide after some seconds.
	 *
	 * @returns	{object}
	 *		New React component representing the information-message.
	 */
	generateAlert() {
		if ( this.state.alert != null && this.alertTimeout == null ) {
			this.alertTimeout = setTimeout( () => {
				this.alertTimeout = null;
				if ( this.mounted ) {
					this.setState( { alert: null } );
				}
			}, 7000 );
		}

		return <Alert key="form-alert" color="success" isOpen={this.state.alert != null}>{this.state.alert}</Alert>;
	}

	/**
	 * Create a React component
	 * which represents a label related to the given input field.
	 *
	 * @param	{object}	fieldData
	 * @param	{string}	fieldData.name
	 * @param	{string}	fieldData.type
	 * @param	{string}	fieldData.id
	 * @param	{null|string}	fieldData.label
	 *
	 * @param	{object}	extraAttributes
	 *		Optional: Additional attributes which shall be included in the main-tag
	 *		of the new component.
	 *
	 * @returns	{object}
	 *		New React component
	 */
	generateLabel( fieldData, extraAttributes = {} ) {
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
	 * Creates a React component
	 * if there is an error-message related to the input field with the given name.
	 *
	 * @param	{string}	fieldName
	 *
	 * @returns	{object|null}
	 *		New React component representing the error-message; or
	 *		Null if there is no related error.
	 */
	generateMessage( fieldName ) {
		assert( typeof fieldName === "string" && fieldName !== "", "Invalid argument" );

		return ( fieldName === "submit" || this.state.touched[fieldName] ) && this.state.messages[fieldName]
			? <FormText key={`${fieldName}-message`} color="danger">{this.state.messages[fieldName]}</FormText>
			: null;
	}

	/**
	 * Creates a React component
	 * which contains buttons to submit or reset the form input.
	 *
	 * @returns	{object}
	 *		New React component
	 */
	generateFinalRow() {
		const buttons = {};

		[ "submit", "reset" ].forEach( type => {
			const allTypeFields = Object.keys( this.fieldList )
				.filter( name => this.fieldList[name].type === type );
			const activeTypeFields = allTypeFields
				.filter( name => this.state.actions.includes( name ) );

			if ( activeTypeFields.length > 0 ) {
				buttons[type] = FieldTypes[type].generateField.call( this, this.fieldList[activeTypeFields[0]] );
			} else if ( allTypeFields.length > 0 ) {
				buttons[type] = FieldTypes[type].generateField.call( this, this.fieldList[allTypeFields[0]] );
			} else if ( type === "submit" ) {
				buttons[type] = FieldTypes[type].generateField.call( this, {} );
			}
		} );

		const submitMessage = this.generateMessage( "submit" );

		return <FormGroup key="form-final" row>
			<Col sm={{ size: 9, offset: 3 }}>
				{buttons.submit}{" "}{buttons.reset}
				{submitMessage}
			</Col>
		</FormGroup>;
	}

	/**
	 * Creates a React component
	 * which represent the input field with the given name
	 *
	 * @param	{string}	name
	 *
	 * @returns	{object}
	 *		New React component
	 */
	generateField( name ) {
		const data = this.fieldList[name];

		assert( data != null && typeof data === "object",
			`Invalid argument "name" (${name})` );
		assert( typeof data.type === "string" && typeof FieldTypes[data.type] === "object",
			`Invalid field type (${data.type})` );

		const id = `${this.props.formClass || "form"}-${data.name}`;

		const label = this.generateLabel( data, { sm: 3 } );
		const field = FieldTypes[data.type].generateField.call( this, data, { id } );
		const message = this.generateMessage( data.name );

		return <FormGroup row key={name}>
			{label}
			<Col sm={9}>
				{field}
				{message || ""}
			</Col>
		</FormGroup>;
	}

	/**
	 * Handles events
	 * whenever an input field of the form is changed
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
	 * Handles events
	 * whenever a user clicks on one of the form's submit buttons
	 */
	handleSubmit( event = null ) {
		if ( event != null ) {
			event.preventDefault();
		}

		if ( typeof this.props.handleSubmit === "function" ) {
			return Promise.resolve(
				this.props.handleSubmit( this.state.inputValues, event ? event.target.name : null )
			)
				.then( alert => {
					if ( this.mounted ) {
						const stateChange = { ...initialState };
						if ( typeof alert === "string" && alert !== "" ) {
							stateChange.alert = alert;
						}

						this.setState( stateChange, this.runValidation );
					}
				} );
		}

		return null;
	}

	/**
	 * Handles events
	 * whenever a user clicks a button to reset the form's input data.
	 */
	handleReset( event = null ) {
		if ( event != null ) {
			event.preventDefault();
		}

		this.setState( { ...initialState }, () => this.runValidation() );
	}

	/**
	 * Composing output
	 */
	render() {
		if ( this.fieldList === null || typeof this.fieldList !== "object" ) {
			return <div className="empty-form"></div>;
		}

		const formFields = Object.keys( this.fieldList )
			.filter( name => [ "submit", "reset" ].includes( this.fieldList[name].type ) === false )
			.map( name => this.generateField( name ) )
			.filter( component => component != null );

		return React.createElement(
			Form,
			this.props.formClass ? { className: this.props.formClass } : {},
			[ this.generateAlert(), ...formFields, this.generateFinalRow() ]
		);
	}
}

FormGenerator.propTypes = propTypes;
FormGenerator.defaultProps = defaultProps;

export default FormGenerator;
