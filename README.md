# Example React.js application

I build an example app to enhance my skills with React.js.
The user interface contains nothing more than a form
which could be used to let users register for the CTS conference in year 2020.

My work includes:

* A component "FormGenerator" which dynamically generates input forms which can be validated while the user inputs data.
* A component "Logo" which dynamically generates SVG-graphics containing animated text based on dot-matrix characters.
* External package `@lexa79/jest-matchers` to improve the unit testings made with Jest:
  * The generated snapshots are put into separate files with user-defined names.
  * The snapshots can be wrapped into a HTML skeleton so that the content can be checked directly in a browser, too.
    (Especially useful in connection with the generated SVG-files.)

## Start the client (development mode)

``` sh
cd client
npm install
npm start
```

The client can be accessed using http://localhost:3012

## Start the database server

``` sh
cd server
npm install
npm start
```

The server API can be tested using http://localhost:3011/health or http://localhost:3011/attendee
