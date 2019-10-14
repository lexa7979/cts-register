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

import "./Form.scss";

const propTypes = {
	formClass:    PropTypes.string,
	fields:       PropTypes.object.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	validateData: PropTypes.func,
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
 *		- "radio"
 *		- "hidden"
 *		- "submit"
 */
export class Form extends React.Component {
	/**
	 * Initialising component
	 */
	constructor( props ) {
		super( props );

		if (
			this.props.fields == null
			|| typeof this.props.fields !== "object"
			|| typeof this.props.handleSubmit !== "function"
		) {
			return;
		}

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
				if ( typeof this[`${type}FieldGenerator`] !== "function" ) {
					throw new Error( `Unsupported field type "${type}" (${name})` );
				}
				this.fieldList[name] = { ...this.props.fields[name], name, type };
				this.state.inputValues[name] = value;
			}
		}

		const { actions, messages } = typeof this.props.validateData === "function"
			? this.props.validateData( this.state.inputValues )
			: { actions: [ "submit" ], messages: {} };
		if ( Array.isArray( actions ) ) {
			this.state.actions = actions;
		}
		if ( messages != null && typeof messages === "object" ) {
			this.state.messages = messages;
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
	 * Delivers the components for a new text field.
	 *
	 * @param	{null|string}	data.label
	 * @param	{string}	data.name
	 * @param	{null|string}	data.value
	 * @param	{null|string}	data.placeholder
	 */
	inputFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

		const allProperties = {
			key:         data.name,
			className:   "field input",
			type:        "text",
			name:        data.name,
			value:       this.state.inputValues[data.name] || "",
			placeholder: data.placeholder,
			autoFocus:   data.focus ? "autofocus" : null,
			onChange:    this.handleInputChange,
		};

		const fieldProperties = {};
		for ( const key in allProperties ) {
			if ( allProperties[key] != null ) {
				fieldProperties[key] = allProperties[key];
			}
		}

		return React.createElement( "input", fieldProperties );
	}

	/**
	 * Delivers the components for a new multiline text field.
	 *
	 * @param	{null|string}	data.label
	 * @param	{string}	data.name
	 * @param	{null|string}	data.value
	 * @param	{null|string}	data.placeholder
	 * @param	{null|number}	data.cols
	 * @param	{null|number}	data.rows
	 */
	textareaFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

		const allProperties = {
			key:         data.name,
			name:        data.name,
			className:   "field textarea",
			onChange:    this.handleInputChange,
			value:       this.state.inputValues[data.name] || "",
			placeholder: data.placeholder,
			cols:        data.cols,
			rows:        data.rows,
		};

		const fieldProperties = {};
		for ( const key in allProperties ) {
			if ( allProperties[key] != null ) {
				fieldProperties[key] = allProperties[key];
			}
		}

		return React.createElement( "textarea", fieldProperties );
	}

	/**
	 * Delivers the components for a new select box.
	 *
	 * @param	{object}	data
	 * /
	selectFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );
	}

	/**
	 * Delivers the components for a new checkbox field.
	 *
	 * @param {*} data
	 * /
	checkboxFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );
	}

	/**
	 * Delivers the components for a new group of radio buttons.
	 *
	 * @param	{*}	data
	 */
	radioFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

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

	/**
	 * Delivers the components for a new hidden field.
	 *
	 * @param	{*}	data
	 * /
	hiddenFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

		return <input type="hidden" key={data.name} name={data.name} value={data.value} />;
	}

	/**
	 * Delivers the component for a new submit button.
	 *
	 * @param	{*}	data
	 */
	submitFieldGenerator( data ) {
		assert( data !== null && typeof data === "object", "Invalid argument" );

		const { name = "submit", value = "Submit" } = data;

		const allProperties = {
			key:       name,
			type:      "submit",
			name,
			value,
			className: "field submit",
			disabled:  this.state.actions.indexOf( name ) >= 0 ? null : "disabled",
		};

		const fieldProperties = {};
		for ( const key in allProperties ) {
			if ( allProperties[key] != null ) {
				fieldProperties[key] = allProperties[key];
			}
		}

		return React.createElement( "input", fieldProperties );
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

		if ( typeof this.props.validateData === "function" ) {
			const { actions, messages } = this.props.validateData( stateUpdate.inputValues );
			if ( Array.isArray( actions ) ) {
				stateUpdate.actions = actions;
			}
			if ( messages != null && typeof messages === "object" ) {
				stateUpdate.messages = messages;
			}
		}

		this.setState( stateUpdate );
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
				submitFields.push( this.submitFieldGenerator( data ) );
			} else if ( typeof this[`${data.type}FieldGenerator`] === "function" ) {
				formFields.push( Form.labelGenerator( data.name, data.label, data.type, data.required ) );
				formFields.push( this[`${data.type}FieldGenerator`]( data ) );
			} else {
				formFields.push( Form.labelGenerator( data.name, data.label, data.type, data.required ) );
				formFields.push( Form[`${data.type}FieldGenerator`]( data ) );
			}

			const message = this.messageGenerator( data.name );
			if ( message ) {
				formFields.push( message );
			}
		}

		if ( submitFields.length === 0 ) {
			submitFields.push( this.submitFieldGenerator( { value: "Submit" } ) );
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
