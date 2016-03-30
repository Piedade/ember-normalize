/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
  name: 'ember-normalize',

	init: function(app) {
    // Enable ES7 decorators via Babel
    // https://www.npmjs.com/package/ember-computed-decorators#setup-with-addon
    this.options = this.options || {};
    this.options.babel = this.options.babel || {};
    this.options.babel.optional = this.options.babel.optional || [];
    if (this.options.babel.optional.indexOf('es7.decorators') === -1) {
      this.options.babel.optional.push('es7.decorators');
    }
  },


	included: function(app, parentAddon) {
    // Quick fix for add-on nesting
    // https://github.com/ember-cli/ember-cli/issues/3718
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    if (typeof app.import !== 'function' && app.app) {
      this.app = app = app.app;
    }

    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.call(this, app);

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);
    target.options = target.options || {}; // Ensures options exists for Scss/Less below
    // var options = target.options['ember-font-awesome'] || {};

		var normalizePath = path.join(target.bowerDirectory, 'normalize-css');

		if (!fs.existsSync(normalizePath)){
      throw new Error(
        this.name + ': normalize.css is not available from bower (' + normalizePath + '), ' +
        'install it into your project by running `bower install normalize.css --save`'
      );
    }

		target.import(path.join(normalizePath, 'normalize.css'));
	}
};

