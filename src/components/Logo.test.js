/**
 * @prettier
 */

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
/* eslint-disable max-lines-per-function */

import path from "path";
const snapshotDir = path.resolve( __dirname, "__snapshots__" );

import React from "react";
import ReactDOM from "react-dom";

import { shallow } from "enzyme";

import Logo from "./Logo";

describe( "Component Logo", () => {
	describe( "when rendering", () => {
		it( "with no properties - FAILS", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Logo />, div );
			} ).toThrowWithSupressedOutput();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - doesn't crash", () => {
			const div = document.createElement( "div" );
			ReactDOM.render( <Logo text="" />, div );
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - results as expected  (-> check snapshot file)", () => {
			const component = shallow( <Logo text="" /> );
			expect( component.length ).toBeGreaterThan( 0 );
			expect( component ).toMatchSnapshot();
		} );

		it( "with example text 'CTS' - doesn't crash", () => {
			const div = document.createElement( "div" );
			ReactDOM.render( <Logo text="CTS" />, div );
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with example text 'CTS' - results as expected  (-> check HTML file)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" />`;
			const testElement = <Logo text="CTS" />;
			const wrapper = shallow( testElement );

			const html = `${wrapper.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;

			return expect( html ).toMatchNamedHTMLSnapshot( `${snapshotDir}/Logo-CTS.html` );
		} );

		it( "with styled text 'CTS' - results as expected  (-> check HTML file)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" />`;
			const testElement = <Logo text="CTS" background="black" color="white" />;
			const wrapper = shallow( testElement );

			const html = `${wrapper.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;

			return expect( html ).toMatchNamedHTMLSnapshot( `${snapshotDir}/Logo-CTS-styled.html` );
		} );

		it( "with styled text 'CTS' and zoom - results as expected  (-> check HTML file)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" zoom={5} />`;
			const testElement = <Logo text="CTS" background="black" color="white" zoom={5} />;
			const wrapper = shallow( testElement );

			const html = `${wrapper.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;

			return expect( html ).toMatchNamedHTMLSnapshot( `${snapshotDir}/Logo-CTS-styled-zoom.html` );
		} );

		it( "with styled text 'CTS' and ratio - results as expected  (-> check HTML file)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" ratio={1} />`;
			const testElement = <Logo text="CTS" background="black" color="white" ratio={1} />;
			const wrapper = shallow( testElement );

			const html = `${wrapper.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;

			return expect( html ).toMatchNamedHTMLSnapshot( `${snapshotDir}/Logo-CTS-styled-ratio.html` );
		} );

		it( "with styled text 'CTS', zoom and ratio - results as expected  (-> check SVG file)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" zoom={5} ratio={1} />`;
			const testElement = <Logo text="CTS" background="yellow" color="red" zoom={5} ratio={1} />;
			const wrapper = shallow( testElement );

			const html = `${wrapper.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;

			return expect( html ).toMatchNamedSnapshot( `${snapshotDir}/Logo-CTS-styled-zoom-ratio.html` );
		} );
	} );

	describe( "with static supports()", () => {
		it( "can determine supported texts", () => {
			expect( Logo.supports( "" ) ).toBe( true );
			expect( Logo.supports( "CTS" ) ).toBe( true );
			expect( Logo.supports( "CTS\nCTS" ) ).toBe( true );
			expect( Logo.supports( "CTS_\n2020" ) ).toBe( true );
			expect( Logo.supports( "CTSCTSCTSCTSCTSCTSCTSCTSCTS" ) ).toBe( true );

			expect( Logo.supports( "e" ) ).toBe( false );
			expect( Logo.supports( "ABCDEFGHIJKLMNOPQRSTUVWXZY" ) ).toBe( false );
		} );
	} );
} );
