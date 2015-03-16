window.respondto = (function (win) {
  'use strict';
  var responders = [];

  var o = {
    addResponder: function (r) {
      var self = this;

      r.mql = self.getMediaQueryList(r.query);

      r.applied = false;

      r.mqlListener = function () {
        // Ideally we would reuse the r.mql property, but this won't work with
        // the IE9 matchMedia()/addListener()/removeListener() polyfills
        var matches = self.getMediaQueryList(r.query).matches;
        self.triggerResponder(r, matches);
      };

      // Listen changes in browser conditions
      r.mql.addListener(r.mqlListener);

      // Push the new responder on the stack
      responders.push(r);

      // And check to see if the media query currently applies
      self.triggerResponder(r, r.mql.matches);
      return r;
    },

    removeResponder: function (r) {
      var i = responders.indexOf(r);
      if (i < 0) {
        throw 'Given responder is not registered.';
      } else {
        // kill its listener
        r.mql.removeListener(r.mqlListener);

        // remove the properties we added when initializing the responder
        delete r.mql;
        delete r.mqlListener;
        delete r.applied;

        // finally remove it from the stack
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

    triggerResponder: function (r, matches) {
      if (matches && r.apply && !r.applied) {
        // if the media query currently matches, and the user has specified
        // an apply callback, and the apply callback hasn't already been
        // applied then call the apply callback, and remember that we did so
        r.apply();
        r.applied = true;
      } else if (!matches) {
        // otherwise, if the media query doesn't match...
        if (r.unapply && r.applied) {
          // ... and  the user has specified an unapply callback, call the
          // unapply callback and forget that we called the apply callback
          r.unapply();
          r.applied = false;
        }
      }
      // in any event simply return the boolean passed in
      return matches;
    },

    responders: function () {
      // return the responder stack
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
