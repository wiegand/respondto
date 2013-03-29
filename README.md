# respondto.js

A simple and lightweight JavaScript API for applying (and unapplying) DOM changes (or any arbitray JS code) based on defined media query conditions.

Or, as I like to say: *media queries for JavaScript!*

## Usage

respondto.js exposes one method on the `window` object. As you'd probably guess, it's named `respondto`. It allows you to register media query conditions around which you can create JavaScript based behavior. I call these *responders*.

### Responders

`respondto` takes a single parameter representing the responder. A responder is an object with one required property, `query`, and two optional callback properties, `apply` and `unapply`.

The `query` property is typically a string representing a valid media query, but it can also be an integer that will be translated to a `max-width` based media query. For example, if we define the query property to be `500` then the following media query would be generated:

	only screen and (max-width: 500px)

This is provided as a shorthand, as I find myself frequently defining max-width pixel based media queries.

### Applying and unapplying

The remaining two properties, `apply` and `unapply` are callbacks that will be executed accordingly.

Each time a new responder is registered (remember, this happens by calling `respondto`), the system checks to see if the given `query` currently applies --- e.g. given a `query` value of `max-width: 500px` the system will immediately test whether the media query's condition is currently met in the browser, i.e. if the window's width is <= 500px. If the condition is met, the `apply` callback (if it has been defined) is called. If the `apply` callback was called, the system makes a note of this (this will become clear why in a bit).

Additionally, upon registering a new responder, an event listener is attached which listens for changes in applicability to the specified media query. To further the example above, if the browser's window width is less than 500px at the time the responder was registered, and then it later changes such that it is larger than 500px, the `unapply` callback will be called.

A few things to note about the `unapply` callback:

- it is optional
- it will only ever be called if the `apply` callback has been called first, in other words: `unapply` will only be called at a maximum once for each time `apply` has been called, and only of course if the conditions of its responder's `query` no longer apply.
- it will never be called if the conditions specified by its responder's `query` do not change

This system is designed to work much like CSS based media queries. If a condition is met, apply *something*. If that *something* has been applied, but the condition is no longer valid, unapply that *something*.

### Example

	window.respondto({
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

## Support

Chrome 9+, Firefox 6+, Internet Explorer 10+, Safari 5.1+

## Contribution

Test:

	$ grunt test

Build:

	$ grunt build

or just

	$ grunt