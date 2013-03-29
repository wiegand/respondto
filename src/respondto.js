window.respondto = (function (win) {
	'use strict';
	var Responders = [],

	addResponder = function (r) {
		// If given a plain number instead of a query, treat this as shorthand.
		if (typeof r.query === 'number' || r.query.match(/^\d+$/)) {
			r.query = 'only screen and (max-width: ' + r.query + 'px)';
		}
		r.mql = win.matchMedia(r.query);
		r.applied = false;
		r.mqlListener = function () {
			triggerResponder(r);
		};
		r.mql.addListener(r.mqlListener);
		Responders.push(r);
		return r;
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
			throw 'Bad input';
		}
	};

}(window));
