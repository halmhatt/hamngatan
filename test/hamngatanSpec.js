require('core-js/shim');

var sinon = require('sinon');
var Hamngatan = require('../lib/hamngatan.js');
var fs = require('fs');
var request = require('request');
var expect = require('chai').expect;

describe('hamngatan', function() {
	var hamngatan;

	before(function() {
		sinon
			.stub(request, 'get')
			.yields(null, null, fs.readFileSync(__dirname + '/test-request.xml'));
	});

	after(function() {
		request.get.restore();
	});

	beforeEach(function() {
		hamngatan = new Hamngatan('no-real-key');
	})

	it('should convert a xml to javascript', function(done) {
		hamngatan.get({from: '2015-01-01'}, function(err, result) {

			expect(request.get.called).to.be.equal(true);
			expect(result).to.not.be.empty;
			expect(result).to.have.length(1);

			expect(result[0]).to.deep.equal({
				SystemCodeNumber: 'linkoping',
				LastUpdated: '2015-01-31T23:00:00.000Z',
				PM10: 0.619
			});

			done();
		});
	});

	it('should work with promises', function(done) {
		hamngatan.get({from: '2015-01-01'})
			.then(function(result) {
				expect(result).to.have.length(1);
			})
			.then(done);
	});

	it('should work with callback', function(done) {
		hamngatan.get({from: '2015-01-01'}, function(err, result) {
			expect(result).to.have.length(1);
			done();
		});
	});

	it('should throw for not specifying from', function() {
		expect(function() {
			hamngatan.get();
		}).to.throw(Error, /specify from/);
	});
});