window.respondto = (function (win) {
	'use strict';
	var Responders = [],

	addResponder = function (r) {
		var mediaQuery;

		mediaQuery = translateInputToMediaQuery(r.query);
		r.mql = getMediaQueryList(mediaQuery);

		r.applied = false;

		r.mqlListener = function () {
			triggerResponder(r);
		};

		r.mql.addListener(r.mqlListener);

		Responders.push(r);
		return r;
	},

	translateInputToMediaQuery = function (input) {
		// If given a plain number instead of a query, treat this as shorthand.
		if (typeof input === 'number' || input.match(/^\d+$/)) {
			return 'only screen and (max-width: ' + input + 'px)';
		} else if (typeof input === 'string') {
			return input;
		} else {
			throwBadInput();
		}
	},

	getMediaQueryList = function (media) {
		var mql = win.matchMedia(media);

		if (mql.media === 'invalid') {
			throwBadInput();
		} else {
			return mql;
		}
	},

	throwBadInput = function () {
		throw 'Bad input';
	},

	triggerResponder = function (r) {
		var matches = r.mql.matches;

		if (matches && r.apply && !r.applied) {
			r.apply();
			r.applied = true;
		} else if (!matches) {
			if (r.fail) {
				r.fail();
			}
			if (r.unapply && r.applied) {
				r.unapply();
				r.applied = false;
			}
		}

		if (r.triggered) {
			r.triggered();
		}

		return matches;
	},

	reset = function () {
		var i, r;
		// remove all respsonder mql listeners
		for (i = Responders.length - 1; i >= 0; i--) {
			r = Responders[i];
			r.mql.removeListener(r.mqlListener);
		}
		// clear responder stack
		Responders = [];
	};

	return function (c) {
		if (typeof c === 'string') {
			switch (c) {
			case 'reset':
				reset();
				break;
			default:
				throw 'Bad input';
			}
		}
		else if (typeof c === 'object' && c.query) {
			var r = addResponder(c);
			triggerResponder(r);
		}
		else {
			throwBadInput();
		}
	};

}(window));
