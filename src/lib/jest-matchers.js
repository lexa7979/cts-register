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

import fs from "fs";
import path from "path";

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
export function toThrowWithSupressedOutput( callback ) {
	let pass = true;

	try {
		// eslint-disable-next-line no-console
		console.error = jest.fn();
		expect( callback ).toThrow();
		// // eslint-disable-next-line no-console
		// expect( console.error ).toHaveBeenCalled();
	} catch ( error ) {
		pass = false;
	}

	return {
		message: () => `expected callback "${callback.toString()}" to ${pass ? "fail" : "succeed"}`,
		pass,
	};
}

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
 * @param	{null|string}	template
 *		Null if content shall not be changed; or
 *		"html" if content shall be wrapped into body of a new HTML document.
 *
 * @returns	{Promise<object>}
 *		Resolves after the snapshot file was checked or written, respectively.
 * @throws
 *		An error is thrown in case of an unexpected file system error
 *		or if the found content doesn't match the given string.
 */
export function toMatchNamedSnapshot( content, filename, template = null ) {
	// eslint-disable-next-line no-invalid-this
	const { utils } = this;

	const fullContent = template === "html"
		? `<!DOCTYPE html>\n<html><head></head><body>\n${content}\n</body></html>`
		: content;
	const basename = path.basename( filename );

	let fileExisted = true;
	let fileData = null;
	return fs.promises.readFile( filename, "utf8" )
		.catch( error => {
			expect( error.code ).toEqual( "ENOENT" );
			fileExisted = false;

			return fs.promises.writeFile( filename, fullContent )
				.then( () => fs.promises.readFile( filename, "utf8" ) );
		} )
		.then( data => {
			fileData = data;
			expect( data ).toBe( fullContent );

			return {
				pass:    true,
				message: fileExisted
					? () => `ERROR: Old content of file "${basename}" was expected to differ from new content`
					: () => `ERROR: File "${basename}" was expected to already exist with some different content`,
			};
		} )
		.catch( () => {
			const diffString = utils.printDiffOrStringify(
				fullContent.substr( 0, 250 ) + ( fullContent.length > 250 ? "..." : "" ),
				fileData.substr( 0, 250 ) + ( fileData.length > 250 ? "..." : "" ),
				"New content",
				"Old content",
				true
			);

			return {
				pass:    false,
				message: () => `ERROR: Old content of file "${basename}" was expected`
					+ ` to equal the new content:\n${diffString}`,
			};
		} );
}
