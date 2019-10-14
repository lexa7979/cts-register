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

import "./App.scss";

import { FormRegister, Logo } from "./components";

/**
 * Base component which hosts everything else.
 */
export class App extends React.Component {
	/**
	 * Composing output
	 */
	render() {	// eslint-disable-line class-methods-use-this
		return (
			<div className="app">
				<div className="header">
					<Logo
						text={"CYGNI TECH SUMMIT\n2020_"}
						background="#333"
						color={[ "white", "#9c4" ]}
						zoom={2}
						animation="running-point:#09f"
					/>
				</div>
				<div className="main">
					<FormRegister />
				</div>
				<div className="footer">
					<Logo
						text="BY LEXA"
						background="#333"
						color="#9c4"
						zoom={2}
						animation="running-point:#333"
					/>
				</div>
			</div>
		);
	}
}

export default App;
