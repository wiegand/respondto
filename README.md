# respondto.js

A simple and lightweight JavaScript API for applying (and unapplying) DOM changes (or any arbitray JS code) based on defined media query conditions.

Or, as I like to say: *media queries for JavaScript!*

## Usage

respondto.js exposes one property on the `window` object. As you'd probably guess, it's named `respondto`. It allows you to register (and unregister) media query conditions around which you can create JavaScript based behavior. I call these *responders*.

### Responders

`respondto.addResponder` takes a single parameter representing the responder. A responder is any object with two required properties, `query` and `apply`, and one optional callback property, `unapply`.

The `query` property is a string representing a valid media query. For example: `'(max-width: 500px)'`

### Applying and unapplying

The remaining two properties, `apply` and `unapply` are callback functions that will be executed accordingly.

Each time a new responder is registered (remember, this happens by calling `respondto.addResponder`), the system checks to see if the given `query` currently applies --- e.g. given a `query` value of `max-width: 500px` the system will immediately test whether the media query's condition is currently met in the browser, i.e. if the window's width is <= 500px. If the condition is met, the `apply` callback (if it has been defined) is called. If the `apply` callback was called, the system makes a note of this (this will become clear why in a bit).

Additionally, upon registering a new responder, an event listener is attached which listens for changes in applicability to the specified media query. To further the example above, if the browser's window width is less than 500px at the time the responder was registered, and then it later changes such that it is larger than 500px, the `unapply` callback will be called.

A few things to note about the `unapply` callback:

- it is optional
- it will only ever be called if the `apply` callback has been called first, in other words: `unapply` will only be called at a maximum once for each time `apply` has been called, and only of course if the conditions of its responder's `query` no longer apply.
- it will never be called if the conditions specified by its responder's `query` do not change

This system is designed to work much like CSS based media queries. If a condition is met, apply *something*. If that *something* has been applied, but the condition is no longer valid, unapply that *something*.

### Cleanup & resetting

If your wish to remove a responder object that you previously added via `respondto.addResponder`, simply pass the responder object along to `respondto.removeResponder`. This will remove it from the list of registered responders, remove the additional properties added to the responder after it was registered, and remove its media query event listener.

As a convenience, if you'd like to remove all of the responders you've initialized, use: `respondto.reset()`.

### Example

	window.respondto.addResponder({
		query: 'only screen and (max-width: 500px)',
		apply: function () {
			// e.g.
			// mobileNav.show();
			// desktopNav.hide();
		},
		unapply: function () {
			// e.g.
			// mobileNav.hide();
			// desktopNav.show();
		}
	});

## Support (Native)

Desktop:

- Chrome 9+
- Firefox 6+
- Internet Explorer 10+
- Safari 5.1+

Mobile:

- iOS 5.0+
- Android 4.0+

## Support for older, non-compliant browsers

If you need broader support, have no fear. Thanks to Scott Jehl, Paul Irish, and Nicholas Zakas's wonderful [`matchMedia` and `matchMedia.addListener` polyfills](https://github.com/paulirish/matchMedia.js/) respondto.js should work everywhere CSS media queries are supported --- e.g. Internet Explorer 9.


## Contribution

Test:

	$ grunt test

Build:

	$ grunt build

or just

	$ grunt