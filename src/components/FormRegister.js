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

import React from "react";
import PropTypes from "prop-types";
import Axios from "axios";

import assert from "assert";

import { Form } from "./form";

const propTypes = {
	serverAvailable: PropTypes.bool,
};

const defaultProps = {};

/**
 * Component which will be used by users to register for the event.
 */
export class FormRegister extends React.Component {
	/**
	 * Initialising component
	 */
	constructor( props ) {
		super( props );

		this.formFields = {
			firstname: {
				type:        "input",
				label:       "Firstname:",
				placeholder: "Type in your firstname.",
				required:    true,
				focus:       true,
			},
			lastname: {
				type:        "input",
				label:       "Lastname:",
				placeholder: "Type in your lastname.",
			},
			attending: {
				type:    "radio",
				label:   "Are you going to attend the conference?",
				options: [ "Yes", "No", "Maybe" ],
			},
			submit: {
				type:  "submit",
				label: "Submit",
			},
			update: {
				type:  "submit",
				label: "Update",
			},
		};

		this.validateData = this.validateData.bind( this );
	}

	/**
	 * Checks if the data of the input form is valid,
	 * also by contacting the database server.
	 *
	 * @param	{object}	inputData
	 *		Current data of the input form
	 *
	 * @returns	{Promise<object>}
	 *		Resolves with an object stating errors and possible submit-actions
	 */
	validateData( inputData ) {
		const messages = {
			firstname: inputData.firstname.trim() ? null : "Missing input: Firstname",
			lastname:  inputData.lastname.trim() ? null : "Missing input: Lastname",
			attending: inputData.attending ? null : "Choose one of the alternatives",
			submit:    this.props.serverAvailable
				? null
				: "Can't connect to the database server - please try again, later",
		};
		if ( Object.keys( messages ).filter( key => messages[key] != null ).length > 0 ) {
			return Promise.resolve( { actions: [], messages } );
		}

		return Axios.get(
			`/attendee/${inputData.firstname.trim()}/${inputData.lastname.trim()}`,
			{ validateStatus: null }
		)
			.then( response => {
				if ( response.status === 200 ) {
					const { success, item, code } = response.data;
					if ( success ) {
						if ( item.attending.toLowerCase() === inputData.attending.toLowerCase() ) {
							return {
								actions:  [],
								messages: { submit: "You answer was already saved, before." },
							};
						}
						return {
							actions:  [ "update" ],
							messages: { submit: "Do you want to change your previous answer?" },
						};
					}
					if ( code === "NOTFOUND" ) {
						return { actions: [ "submit" ], messages: {} };
					}
				}

				return { actions: [], messages: { submit: response.data.error || response.data } };
			} );
	}

	/**
	 *
	 *
	 * @param	{object}	inputData
	 */
	handleSubmit( inputData ) {
		return this.validateData( inputData )
			.then( result => {
				assert( Array.isArray( result.actions ) && result.actions.length > 0 );
				const data = {
					firstname: inputData.firstname,
					lastname:  inputData.lastname,
					attending: inputData.attending,
				};
				return Axios.put( "/attendee", data, { validateStatus: null } );
			} )
			.then( response => {
				console.log( "Form was submitted", response );
			} );
	}

	/**
	 * Composing output
	 */
	render() {
		return <Form
			formClass="register"
			fields={this.formFields}
			handleSubmit={this.handleSubmit}
			validateData={this.validateData}
		/>;
	}
}

FormRegister.propTypes = propTypes;
FormRegister.defaultProps = defaultProps;

export default FormRegister;
