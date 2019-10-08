/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
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
import ReactDOM from "react-dom";

import { shallow } from "enzyme";

import Form from "./Form";

describe( "Helper component Form -", () => {
	describe( "when rendering", () => {
		it( "with no properties - FAILS", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Form />, div );
			} ).toSucceedWithMessages();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - succeeds", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Form fields={{}} handleSubmit={() => null} />, div );
			} ).toSucceedWithoutMessages();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{}} handleSubmit={() => null} />`;
			const testElement = <Form fields={{}} handleSubmit={() => null} />;
			const filename = "Form";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );

		} );

		it( "with one input field - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{ text: { type: "input" } }} handleSubmit={() => null} />`;
			const testElement = <Form fields={{ text: { type: "input" } }} handleSubmit={() => null} />;
			const filename = "Form-input";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with a set of input fields - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{ first: { type: "input" }, second: { label: "second" }, third: {} }} handleSubmit={() => null} />`;
			const testElement = <Form fields={{ first: { type: "input" }, second: { label: "second" }, third: {} }} handleSubmit={() => null} />;
			const filename = "Form-input-set";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with one textarea field - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{ text: { type: "textarea" } }} handleSubmit={() => null} />`;
			const testElement = <Form fields={{ text: { type: "textarea" } }} handleSubmit={() => null} />;
			const filename = "Form-textarea";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with a set of textarea fields - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{ first: { type: "textarea" }, second: { type: "textarea", rows: 4, cols: 50, value: "Text input", label: "second" }, third: { type: "textarea", label: "third" } }} handleSubmit={() => null} />`;
			const testElement = <Form fields={{ first: { type: "textarea" }, second: { type: "textarea", rows: 4, cols: 50, value: "Text input", label: "second" }, third: { type: "textarea", label: "third" } }} handleSubmit={() => null} />;
			const filename = "Form-textarea-set";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with one radio button group - delivers expected result  (-> check snapshot)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Form fields={{ choose: { type: "radio", options: [ "one", "two", "three" ] } }} handleSubmit={() => null} />`;
			const testElement = <Form fields={{ choose: { type: "radio", options: [ "one", "two", "three" ] } }} handleSubmit={() => null} />;
			const filename = "Form-radio";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );
	} );
} );
