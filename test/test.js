describe('responto', function () {
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

	it('throws an error when called with a bad media query', function() {
		expect(function () {
			respondto({
				query: 'max-width: wtf'
			});
		}).toThrow('Bad input');
	});
});

