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

import React from "react";
import ReactDOM from "react-dom";

import { shallow } from "enzyme";

import FormRegister from "./FormRegister";

describe( "Component FormRegister -", () => {
	describe( "when rendering", () => {
		it( "with no properties - succeeds", () => {
			const div = document.createElement( "div" );
			ReactDOM.render( <FormRegister />, div );
			ReactDOM.unmountComponentAtNode( div );
		} );

		it( "with no properties - delivers expected result  (-> check snapshot, too)", () => {
			// eslint-disable-next-line quotes
			const testString = `<FormRegister />`;
			const testElement = <FormRegister />;
			const filename = "FormRegister";

			const component = shallow( testElement );
			expect( component.exists() ).toBe( true );

			const html = `${component.html()}<br/><br/>${testString.replace( "<", "&lt;" ).replace( ">", "&gt;" )}`;
			return expect( html ).toAsyncMatchNamedHTMLSnapshot( filename );
		} );
	} );
} );