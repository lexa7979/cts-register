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

import React from "react";
import ReactDOM from "react-dom";

import { shallow } from "enzyme";

import Logo from "./Logo";

describe( "Component Logo", () => {
	describe( "using static supports()", () => {
		it( "- confirms supported texts", () => {
			expect( Logo.supports( "" ) ).toBe( true );
			expect( Logo.supports( "CTS" ) ).toBe( true );
			expect( Logo.supports( "CTS\nCTS" ) ).toBe( true );
			expect( Logo.supports( "CTS_\n2020" ) ).toBe( true );
			expect( Logo.supports( "CTSCTSCTSCTSCTSCTSCTSCTSCTS" ) ).toBe( true );
		} );

		it( "- denies unsupported texts", () => {
			expect( Logo.supports( "e" ) ).toBe( false );
			expect( Logo.supports( "ABCDEFGHIJKLMNOPQRSTUVWXZY" ) ).toBe( false );
		} );
	} );

	describe( "when rendering", () => {
		it( "with no properties - FAILS", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Logo />, div );
			} ).toSucceedWithMessages();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - succeeds", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Logo text="" />, div );
			} ).toSucceedWithoutMessages();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with minimal properties - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="" />`;
			const testElement = <Logo text="" />;
			const filename = "Logo";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with example text 'CTS' - succeeds", () => {
			const div = document.createElement( "div" );
			expect( () => {
				ReactDOM.render( <Logo text="CTS" />, div );
			} ).toSucceedWithoutMessages();
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with example text 'CTS' - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" />`;
			const testElement = <Logo text="CTS" />;
			const filename = "Logo-CTS";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with two lines text 'CTS 2020' - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text={"CTS\\n2020"} background="black" color="red" />`;
			const testElement = <Logo text={"CTS\n2020"} background="black" color="red" />;
			const filename = "Logo-CTS2020";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with styled text 'CTS 2020' - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text={"CTS\\n2020"} background="black" color={[ "white", "green" ]} />`;
			const testElement = <Logo text={"CTS\n2020"} background="black" color={[ "white", "green" ]} />;
			const filename = "Logo-CTS2020-styled";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with styled text 'CTS' and zoom - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" zoom={5} />`;
			const testElement = <Logo text="CTS" background="black" color="white" zoom={5} />;
			const filename = "Logo-CTS-styled-zoom";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with styled text 'CTS' and ratio - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text="CTS" background="black" color="white" ratio={1} />`;
			const testElement = <Logo text="CTS" background="black" color="white" ratio={1} />;
			const filename = "Logo-CTS-styled-ratio";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );

		it( "with styled text 'CTS', zoom and ratio - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<Logo text={"C\\nT\\nS"} background="yellow" color="brown" zoom={5} ratio={1} />`;
			const testElement = <Logo text={"C\nT\nS"} background="yellow" color="brown" zoom={5} ratio={1} />;
			const filename = "Logo-CTS-styled-zoom-ratio";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );
	} );
} );
