/* jshint strict: false, expr: true */
/* global describe, it, afterEach, require */

var respondto = window.respondto,
	sinon = require('sinon'),

	matchMediaMock = function () {
		return {
			media: true,
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
	});

	describe('#removeResponder()', function () {
		it('should remove a responder it\'s given', function () {
			var responder = {
				query: '(max-width: 500px)'
			};
			respondto.addResponder(responder);
			respondto.responders().length.should.equal(1);
			respondto.removeResponder(responder);
			respondto.responders().length.should.equal(0);
		});

		it('should deregister a responder it\'s given\'s mediaquery based event', function (done) {
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
});


// 	describe('respondto#apply', function () {
// 		it('calls responder\'s apply callback when its query matches', function () {
// 			var responder = {query: MATCHING_QUERY, apply: function () {}};
// 			spyOn(responder, 'apply');
// 			respondto(responder);

// 			expect(responder.apply).toHaveBeenCalled();
// 		});
// 		it('does not call responder\'s apply callback when its query does not match', function () {
// 			var responder = {query: UNMATCHING_QUERY, apply: function () {}};
// 			spyOn(responder, 'apply');
// 			respondto(responder);

// 			expect(responder.apply).not.toHaveBeenCalled();
// 		});
// 	});

// 	describe('respondto#reset', function () {
// 		it('when there is one responder, and reset is called, there will be zero responders', function () {
// 			respondto(VALID_MATCHING_RESPONDER);
// 			expect(respondto('responders').length).toEqual(1);
// 			respondto('reset');
// 			expect(respondto('responders').length).toEqual(0);
// 		});
// 	});
// });

