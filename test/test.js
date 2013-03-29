describe('responto', function () {
	beforeEach(function () {
		respondto('reset');
	});

	describe('invokation with responder object', function () {
		it('defines the responto method', function() {
			expect(respondto).toBeDefined;
		});

		it('throws an error when called without responder', function() {
			expect(respondto).toThrow('Bad input');
		});

		it('throws an error when called without query property', function() {
			expect(function () {
				respondto({});
			}).toThrow('Bad input');
		});

		it('does not throw an error when called with a valid media query', function() {
			expect(function () {
				respondto({
					query: '(max-width: 500px)'
				});
			}).not.toThrow();
		});

		it('throws an error when called with a bad media query', function() {
			expect(function () {
				respondto({
					query: 'max-width: wtf'
				});
			}).toThrow('Bad input');
		});
	});

	describe('invokation with command string', function () {
		it('throws an error when called with an unknown command', function() {
			expect(function () {
				respondto('wtf');
			}).toThrow('Bad input');
		});

		it('does not throw an error when called with a defined command', function() {
			expect(function () {
				respondto('responders');
				respondto('reset');
			}).not.toThrow('Bad input');
		});
	});

	describe('respondto#responders', function () {
		it('returns an empty array before registering any responders', function() {
			var responders = respondto('responders');
			expect(responders.length).toEqual(0);
		});

		it('returns an array with one object when registering one responder', function() {
			var responder = {query: '(max-width: 500px)'},
				responders = respondto('responders');
			respondto(responder);
			expect(responders.length).toEqual(1);
		});

		it('returns an array with two object when registering two responders', function() {
			var responder = {query: '(max-width: 500px)'},
				responders = respondto('responders');
			respondto(responder);
			respondto(responder);
			expect(responders.length).toEqual(2);
		});

		it('returns an array with one object and that object is the responder', function() {
			var responder = {query: '(max-width: 500px)'},
				responders = respondto('responders');
			respondto(responder);
			expect(responders.length).toEqual(1);
			expect(responders[0]).toEqual(responder);
		});
	});
});

