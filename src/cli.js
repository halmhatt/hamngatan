#!/usr/bin/env node
import 'core-js/shim';

var program = require('commander');
var Hamngatan = require('./hamngatan.js');

program
	.version('1.0.0')
	.option('-k, --apikey [apikey]', 'API key for linkoping API')
	.option('--from [date]', 'From date')
	.option('--to [date]', 'To date')
	.parse(process.argv);

if(!program.apikey) {
	console.error('You need to specify an apikey');
	return;
}

var options = {};
if(program.from) {
	options.from = program.from;
} else {
	console.error('You need to specify a date from where you want data, with --from');
	return;
}

if(program.to) {
	options.to = program.to;
}

var hamngatan = new Hamngatan(program.apikey);

// Output everything as JSON
hamngatan.get(options)
	.then((result) => {
		console.log(JSON.stringify(result, null, '  ', true));
	})
	.then((err) => {throw err});