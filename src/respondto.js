window.respondto = (function (win) {
	'use strict';
	var Responders = [],

	addEvent = function(elem, type, eventHandle) {
		if (elem === null || elem === undefined) {
			return;
		}
		if (elem.addEventListener) {
			elem.addEventListener(type, eventHandle, false);
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + type, eventHandle);
		}
	},

	addResponder = function (r) {
		// If given a plain number instead of a query, treat this as shorthand.
		if (typeof r.query === 'number' || r.query.match(/^\d+$/)) {
			r.query = 'only screen and (max-width: ' + r.query + 'px)';
		}
		r.applied = false;
		Responders.push(r);
		return r;
	},

	triggerResponder = function (r) {
		var matches = win.matchMedia(r.query).matches;

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

	triggerResponders = function (responders) {
		var i;
		for (i = responders.length - 1; i >= 0; i -= 1) {
			triggerResponder(responders[i]);
		}
	},

	trigger = function () {
		triggerResponders(Responders);
	},

	winResizeCallback = function () {
		trigger();
	},

	reset = function () {
		Responders = [];
	};

	// Re-run the responders if the window is resized.
	// In practice this probably won't happen often,
	// but to keep the spirit of media queries...
	addEvent(win, 'resize', winResizeCallback);

	return function (c) {
		if (typeof c === 'string') {
			switch (c) {
			case 'reset':
				reset();
				break;
			case 'trigger':
				trigger();
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
