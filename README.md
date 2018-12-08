# Marathon

A browser extension that's built for long-term productivity.

## Development

This plugin is built as a WebExtension - a standard for browser plugins currently supported in both Chrome and Firefox.

To build for either browser, clone the repository and then run:

    make dev

If everything is successful, check the `build` folder for the extension contents. You can load the `build` directory into either Chrome or Firefox as an _unpacked_ or _temporary_ extension. See the instructions for [Chrome](https://developer.chrome.com/extensions/getstarted#unpacked) or [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

Running `make dev` will watch for changes and recompile, however each time you make changes you'll need to tell the browser to reload the temporary extension.

To build a distributable `.zip` for production, just run:

    make

The extension package can be found in the `dist` folder.

## Todo
[] Block youtube recommended section

[] Conditional blocking based on time (i.e. allow reddit on weekends)

## Credits

Forked from [jordwest/news-feed-erasdicator](https://github.com/jordwest/news-feed-eradicator)
