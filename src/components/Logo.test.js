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

import path from "path";

import React from "react";
import ReactDOM from "react-dom";

import { shallow } from "enzyme";

import Logo from "./Logo";

// eslint-disable-next-line max-lines-per-function
describe( "Component <Logo />", () => {
	it( "FAILS to render when no properties are given", () => {
		const div = document.createElement( "div" );
		expect( () => {
			ReactDOM.render( <Logo />, div );
		} ).toThrowWithSupressedOutput();
		ReactDOM.unmountComponentAtNode( div );
	} );

	it( "can determine supported texts without creating an instance", () => {
		expect( Logo.supports( "" ) ).toBe( true );
		expect( Logo.supports( "CTS" ) ).toBe( true );
		expect( Logo.supports( "CTS\nCTS" ) ).toBe( true );
		expect( Logo.supports( "CTS_\n2020" ) ).toBe( true );
		expect( Logo.supports( "CTSCTSCTSCTSCTSCTSCTSCTSCTS" ) ).toBe( true );
		expect( Logo.supports( "e" ) ).toBe( false );
		expect( Logo.supports( "ABCDEFGHIJKLMNOPQRSTUVWXZY" ) ).toBe( false );
	} );

	it( "renders without crashing when minimal properties are given", () => {
		const div = document.createElement( "div" );
		ReactDOM.render( <Logo text="" />, div );
		ReactDOM.unmountComponentAtNode( div );
	} );

	it( "renders as expected when minimal properties are given (check SNAP file)", () => {
		const component = shallow( <Logo text="" /> );
		expect( component.length ).toBeGreaterThan( 0 );
		expect( component ).toMatchSnapshot();
	} );

	it( "renders without crashing when example text 'CTS' is given", () => {
		const div = document.createElement( "div" );
		ReactDOM.render( <Logo text="CTS" />, div );
		ReactDOM.unmountComponentAtNode( div );
	} );

	it( "renders as expected when example text 'CTS' is given (check HTML file)", () => {
		const wrapper = shallow( <Logo text="CTS" background="black" color="white" zoom={5} /> );
		const file = path.resolve( __dirname, "__snapshots__/Logo.CTS.html" );

		return expect( wrapper.html() ).toMatchNamedHTMLSnapshot( file );
	} );
} );
