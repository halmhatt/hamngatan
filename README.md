Hamngatan
==============

A wrapper around Linkopings API for hamngatans air quality measurements written for Nodejs.

It is written in `es6` and compiled to `es5` to be used with `node`. Check the code if you want some inspiration.

This *tool/lib* helps you with:

1. Constructing the URI
2. Parse the **XML**
3. Check the returned data
4. Parse and format as *javascript* (The CLI outputs JSON)
5. Throws error on failures

[Information about the API (in swedish)](http://www.linkoping.se/open/Oppna-data1/Luftkvalitet/)

## Usage
You could use the lib like this:

```js
var Hamngatan = require('hamngatan');

var hamngatan = new Hamngatan('your api key');

hamntagan.get({
	from: '2015-05-12'
}, function(err, result) {
	if(err) throw err;

	console.log(result);
});
```

Or you can use `Promise`:
```js
var Hamngatan = require('hamngatan');

var hamngatan = new Hamngatan('your api key');

hamntagan.get({
		from: '2015-05-12'
	})
	.then(function(result) {
		console.log(result);
	})
	.catch(function(err) {
		throw err;
	});
```

## Use only the formatter
The formatter from *XML to javascript* can be used with the *static* function `Hamngatan.format(xmlString)`. This will format the XML to javascript. *The XML needs to be from this API as this only extracts the important parts of the response.*

## CLI
There is a CLI interface that is installed in `node_modules/.bin/hamngatan`. This makes it possible to use this tool on the command line. The CLI outputs `JSON` to `stdout` and you could save it by using `> filename.json` if you will.

With the flag `--help` it gives the help output:
```bash
  Usage: cli [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -k, --apikey [apikey]  API key for linkoping API
    --from [date]          From date
    --to [date]            To date
```

Example:
```bash
$ node_modules/.bin/hamngatan --apikey fdsjklsdfhsdfsk --from 2015-01-01
[
  {
    "SystemCodeNumber": "linkoping",
    "LastUpdated": "2015-01-15T09:45:00.000Z",
    "PM10": 3.719
  },
  {
    "SystemCodeNumber": "linkoping",
    "LastUpdated": "2015-01-15T09:30:00.000Z",
    "PM10": 4.006
  },
 ...
```

If you install it globally with `npm install -g hamngatan` you will not need the `node_modules/.bin/` part.

## Contribution
Hi awesome! Please contribute, use `es6` and the styling located in `.eslintrc` and lint your code. *Right now eslint does not support modules :(*
