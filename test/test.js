/* jshint strict: false, expr: true */
/* global describe, it, afterEach, require */

var respondto = window.respondto,
	sinon = require('sinon'),

	matchMediaMock = function () {
		return {
			media: true,
			matches: true,
			addListener: function () {
			},
			removeListener: function () {
			}
		};
	},
	matchMediaMockNoMatch = function () {
		return {
			media: false,
			matches: false,
			addListener: function () {
			},
			removeListener: function () {
			}
		};
	};

describe('respondto', function () {
	afterEach(function () {
		window.matchMedia = matchMediaMock;
		respondto.reset();
	});

	describe('#responders()', function () {
		it('should return an empty array before any responders are added', function () {
			respondto.responders().should.be.empty;
		});
	});

	describe('#addResponder()', function () {
		it('should add the responder it\'s given to the stack', function () {
			var responder = {
				query: '(max-width: 500px)'
			};
			respondto.addResponder(responder);
			respondto.responders().length.should.equal(1);
			respondto.responders()[0].should.equal(responder);
		});

		it('should register a mediaquery based event', function (done) {
			var responder = {
				query: '(max-width: 500px)'
			};


			window.matchMedia = function () {
				return {
					media: true,
					removeListener: function () {},
					addListener: function (callback) {
						callback.should.equal(responder.mqlListener);
						done();
					}
				};
			};

			respondto.addResponder(responder);
		});

		it('should call the responder\'s apply callback when its query matches, but not call its unapply callback', function () {
			var applyCallback = sinon.spy(),
				unapplyCallback = sinon.spy(),
				responder = {
					query: '(max-width: 500px)',
					apply: applyCallback,
					unapply: unapplyCallback
				};
			respondto.addResponder(responder);
			applyCallback.callCount.should.equal(1);
			unapplyCallback.callCount.should.equal(0);
		});

		it('should not call the responder\'s apply or unapply callback when its query does not match', function () {
			var applyCallback = sinon.spy(),
				unapplyCallback = sinon.spy(),
				responder = {
					query: '(max-width: 500px)',
					apply: applyCallback,
					unapply: unapplyCallback
				};
			window.matchMedia = matchMediaMockNoMatch;
			respondto.addResponder(responder);
			applyCallback.callCount.should.equal(0);
			unapplyCallback.callCount.should.equal(0);
		});
	});

	describe('#removeResponder()', function () {
		it('should remove the responder it\'s given', function () {
			var responder = {
				query: '(max-width: 500px)'
			};
			respondto.addResponder(responder);
			respondto.responders().length.should.equal(1);
			respondto.removeResponder(responder);
			respondto.responders().length.should.equal(0);
		});

		it('should remove any properties added by #addResponder', function () {
			var responder = {query: '(max-width: 500px)'};
			respondto.addResponder(responder);
			respondto.removeResponder(responder);
			responder.should.not.have.property('mql');
			responder.should.not.have.property('mqlListener');
			responder.should.not.have.property('applied');
		});

		it('should deregister the responder it\'s given\'s mediaquery based event', function (done) {
			var responder = {
				query: '(max-width: 500px)'
			};


			window.matchMedia = function () {
				return {
					media: true,
					addListener: function () {},
					removeListener: function (callback) {
						callback.should.equal(responder.mqlListener);
						done();
					}
				};
			};

			respondto.addResponder(responder);
			respondto.removeResponder(responder);
		});
	});

	describe('#reset()', function () {
		it('should remove all responders', function () {
			var responder1 = {
				query: '(max-width: 500px)'
			},
			responder2 = {
				query: '(max-width: 600px)'
			},
			callback = sinon.spy();


			window.matchMedia = function () {
				return {
					media: true,
					addListener: function () {},
					removeListener: callback
				};
			};

			respondto.addResponder(responder1);
			respondto.addResponder(responder2);
			respondto.reset();
			respondto.responders().should.be.empty;
			callback.callCount.should.equal(2);
		});
	});

	describe('#triggerResponder()', function () {
		it('should call the responder\'s unapply callback after the apply callback has been called and query no longer matches', function () {
			var applyCallback = sinon.spy(),
				unapplyCallback = sinon.spy(),
				responder = {
					query: '',
					apply: applyCallback,
					unapply: unapplyCallback
				};

			// should apply because it matches, and NOT unapply
			respondto.addResponder(responder);
			applyCallback.callCount.should.equal(1);
			unapplyCallback.callCount.should.equal(0);

			// no longer matches...
			// so it should unapply, but NOT apply
			respondto.triggerResponder(responder, false);
			applyCallback.callCount.should.equal(1);
			unapplyCallback.callCount.should.equal(1);

			// When retriggering and nothing has changed, no callbacks fire
			respondto.triggerResponder(responder, false);
			applyCallback.callCount.should.equal(1);
			unapplyCallback.callCount.should.equal(1);

			// Matches again, apply is called, but NOT unapply
			respondto.triggerResponder(responder, true);
			applyCallback.callCount.should.equal(2);
			unapplyCallback.callCount.should.equal(1);

			// Again, when retriggering and nothing has changed, no callbacks fire
			respondto.triggerResponder(responder, true);
			applyCallback.callCount.should.equal(2);
			unapplyCallback.callCount.should.equal(1);
		});
	});
});
