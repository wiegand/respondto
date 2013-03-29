# respondto()

A simple JavaScript API for applying (and unapplying) DOM changes based on defined mediaquery conditions.

## Usage

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

Build:

	$ grunt