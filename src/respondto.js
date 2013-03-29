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
		r.mql.addListener(function () {
			triggerResponder(r);
		});
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
		Responders = [];
		//todo: kill events
	};

	return function (c) {
		if (typeof c === 'string') {
			switch (c) {
			case 'reset':
				reset();
				break;
			case 'trigger':
				// trigger();
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
