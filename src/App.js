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

import "./App.scss";

import { FormRegister, Logo } from "./components";

/**
 * Base component which hosts everything else.
 */
export class App extends React.Component {
	// eslint-disable-next-line class-methods-use-this,require-jsdoc
	render() {
		return (
			<div className="app">
				{/* <h1>Cygni Tech Summit 2020</h1> */}
				<Logo
					text={"CYGNI\nTECH\nSUMMIT\n 2020_"}
					background="#323232"
					color={[ "white", "white", "white", "#8cc63f" ]}
					zoom={3}
					ratio={1}
					animation="running-point:#0099ff"
				/>
				<FormRegister />
				<Logo text="LEXA" background="white" color="lightgreen" zoom={2} animation="running-point:red" />
			</div>
		);
	}
}

export default App;
