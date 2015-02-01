Hamngatan
==============

A wrapper around Linkopings API for hamngatans air quality measurements written for Nodejs.

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

The wrapper is written in `es6` and if you use it you could use promises. 

```js
import Hamngatan from 'hamngatan';

let hamngatan = new Hamngatan('you api key');

hamngatan.get({from: '2015-05-12'})
	.then((result) => {
		console.log(reuslt);
	})
	.catch(err => console.error(err));

```