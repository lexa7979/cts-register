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

import assert from "assert";

import React from "react";
import PropTypes from "prop-types";

import FormTypes from "./types";

import "./Form.scss";

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
				console.log( result );

				if (
					result != null && typeof result === "object"
					&& Array.isArray( result.actions )
					&& result.messages != null && typeof result.messages === "object"
				) {
					this.setState( { actions: result.actions, messages: result.messages } );
				}

				this.validation.progressing = false;
				if ( this.validation.requested ) {
					this.validation.requested = false;
					this.runValidation();
				}
			} );
	}

	/**
	 * Wraps the given input component into a new div-container.
	 * A label-element will be added if requested.
	 *
	 * @param	{string} 	inputName
	 * @param	{null|string} 	label
	 * @param	{null|string}	cssClasses
	 */
	static labelGenerator( inputName, label, cssClasses ) {
		assert( typeof inputName === "string" && inputName !== "", "Invalid argument" );
		assert( label == null || ( typeof label === "string" && label !== "" ), "Invalid argument" );
		assert( cssClasses == null || typeof cssClasses === "string", "Invliad argument" );

		if ( label ) {
			return <label key={`${inputName}-label`}
				className={`label ${cssClasses || ""}`}
				htmlFor={inputName}
			>{label}</label>;
		}

		return <div key={`${inputName}-nolabel`}
			className={`nolabel ${cssClasses || ""}`}
		></div>;
	}

	/**
	 * If there is a message for the given input field,
	 * a matching component to show this text is composed.
	 *
	 * @param	{string}	inputName
	 */
	messageGenerator( inputName ) {
		assert( typeof inputName === "string" && inputName !== "", "Invalid argument" );

		if ( !this.state.touched[inputName] || !this.state.messages[inputName] ) {
			return null;
		}

		return <div	key={`${inputName}-message`} className="message">
			{this.state.messages[inputName]}
		</div>;
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

		const stateUpdate = {
			inputValues: {
				...this.state.inputValues,
				[name]: value,
			},
		};

		if ( this.state.touched[name] !== true ) {
			stateUpdate.touched = {
				...this.state.touched,
				[name]: true,
			};
		}

		this.setState( stateUpdate, () => {
			this.runValidation();
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

		const formFields = [];
		const submitFields = [];
		for ( const name in this.fieldList ) {	// eslint-disable-line guard-for-in
			const data = this.fieldList[name];
			if ( data.type === "submit" ) {
				submitFields.push( FormTypes.submit.generateField.call( this, data ) );
			} else if ( typeof FormTypes[data.type] === "object" ) {
				formFields.push( Form.labelGenerator( data.name, data.label, data.type, data.required ) );
				formFields.push( FormTypes[data.type].generateField.call( this, data ) );
			}

			const message = this.messageGenerator( data.name );
			if ( message ) {
				formFields.push( message );
			}
		}

		if ( submitFields.length === 0 ) {
			submitFields.push( FormTypes.submit.generateField.call( this, { value: "Submit" } ) );
		}

		return <form
			className={this.props.formClass ? `form ${this.props.formClass}` : "form"}
			onSubmit={this.onSubmit}
		>
			<div className="fields">
				{formFields}
			</div>
			<div className="final">
				{submitFields}
			</div>
		</form>;
	}
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
