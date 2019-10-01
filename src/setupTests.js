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

// Configure Enzyme:
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure( { adapter: new Adapter() } );

// Enable Enzyme to be used with Jest's snapshots:
import { createSerializer } from "enzyme-to-json";
expect.addSnapshotSerializer( createSerializer( { mode: "deep" } ) );

// Add some useful matchers to Jest:
import { toThrowWithSupressedOutput, toMatchNamedSnapshot } from "./lib/jest-matchers";
expect.extend( {
	/**
	 * Checks that the given callback fails, hides any error output of the callback.
	 *
	 * @param	{function} 	callback
	 *		Callback function which shall be checked
	 *
	 * @returns	{object}
	 *
	 * @throws
	 *		Fails if the callback function DOESN'T produce any error message.
	 */
	toThrowWithSupressedOutput( callback ) {
		return toThrowWithSupressedOutput.call( this, callback );
	},

	/**
	 * Reads the given file and checks if the content matches the given string (if file exists); or
	 * Writes the given string into a new file with the given name (if file doesn't exist)
	 *
	 * Please note:
	 *		The automatic snapshot-update of Jest has no effect on the files generated
	 *		by this matcher. Please remove the files by hand in case you want them to be rebuilt.
	 *
	 * @param	{string}	content
	 *		Expected content of the snapshot-file
	 * @param	{string}	filename
	 *		Path and name of the snapshot-file
	 *
	 * @returns	{Promise<object>}
	 *		Resolves after the snapshot file was checked or written, respectively.
	 * @throws
	 *		An error is thrown in case of an unexpected file system error
	 *		or if the found content doesn't match the given string.
	 */
	toMatchNamedSnapshot( content, filename ) {
		return toMatchNamedSnapshot.call( this, content, filename );
	},

	/**
	 * Firstly, the given string is wrapped into the body of a new HTML-document.
	 *
	 * Reads the given file and checks if the content matches the given string (if file exists); or
	 * Writes the given string into a new file with the given name (if file doesn't exist)
	 *
	 * Please note:
	 *		The automatic snapshot-update of Jest has no effect on the files generated
	 *		by this matcher. Please remove the files by hand in case you want them to be rebuilt.
	 *
	 * @param	{string}	content
	 *		Expected HTML body of the snapshot-file
	 * @param	{string}	filename
	 *		Path and name of the snapshot-file
	 *
	 * @returns	{Promise<object>}
	 *		Resolves after the snapshot file was checked or written, respectively.
	 * @throws
	 *		An error is thrown in case of an unexpected file system error
	 *		or if the found content doesn't match the given string.
	 */
	toMatchNamedHTMLSnapshot( content, filename ) {
		return toMatchNamedSnapshot.call( this, content, filename, "html" );
	},
} );
