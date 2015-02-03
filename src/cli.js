#!/usr/bin/env node

import 'core-js/shim';

import program from'commander';
import Hamngatan from './hamngatan.js';

program
	.version('1.0.0')
	.option('-k, --apikey [apikey]', 'API key for linkoping API')
	.option('--from [date]', 'From date')
	.option('--to [date]', 'To date')
	.parse(process.argv);

// If no argument is given, output help
if(process.argv.length === 2) {
	program.help();
}

// API key needs to be present
if(!program.apikey) {
	console.error('You need to specify an apikey');
	console.error('Obtain one at: http://www.linkoping.se/open/Oppna-data1/Luftkvalitet/');
	return;
}

let options = {};
if(program.from) {
	options.from = program.from;
} else {
	console.error('You need to specify a date from where you want data, with --from');
	return;
}

if(program.to) {
	options.to = program.to;
}

let hamngatan = new Hamngatan(program.apikey);

// Output everything as JSON
hamngatan.get(options)
	.then((result) => {
		console.log(JSON.stringify(result, null, '  ', true));
	})
	.then((err) => {throw err});