window.respondto = (function (win) {
	'use strict';
	var responders = [],

		o = {
			addResponder: function (r) {
				var self = this;

				r.mql = self.getMediaQueryList(r.query);

				r.applied = false;

				r.mqlListener = function () {
					self.triggerResponder(r);
				};

				r.mql.addListener(r.mqlListener);

				responders.push(r);
				self.triggerResponder(r);
				return r;
			},

			removeResponder: function (r) {
				var i = responders.indexOf(r);
				if (i < 0) {
					throw 'Given responder is not registered.';
				} else {
					r.mql.removeListener(r.mqlListener);
					responders.splice(i,1);
				}
			},

			getMediaQueryList: function (media) {
				var mql = win.matchMedia(media);

				if (mql.media === 'invalid') {
					throw 'Bad input';
				} else {
					return mql;
				}
			},

			triggerResponder: function (r) {
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

			responders: function () {
				return responders;
			},

			reset: function () {
				// remove all respsonders
				while (responders.length > 0) {
					var r = responders[0];
					this.removeResponder(r);
				}
			}
		};

	return o;

}(window));
