var yeoman = require('yeoman-generator');

var merge = Object.assign.bind(null, {});
var stringify = function stringify(obj) { return JSON.stringify(obj, null, 2); };
var parse = JSON.parse.bind(JSON);
var concat = function concat(arr1, arr2) { return [].concat(arr1, arr2); };
var prefixPresets = function prefixPresets(name) { return 'babel-preset-' + name; };

module.exports = yeoman.generators.Base.extend({
  constructor: function constructor() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('presets', { type: Array, required: false });
  },
  writing: {
    app: function app() {
      var optional = this.presets
        ? { presets: this.presets }
        : (this.options.config || {});
      var existing = this.fs.exists(this.destinationPath('.babelrc'))
            ? parse(this.fs.read(this.destinationPath('.babelrc')))
            : {};
      var defaults = parse(this.fs.read(this.templatePath('_babelrc')));
      var result = merge(existing, defaults, optional);
      this.devDepsToInstall = concat(
        ['babel-cli', 'babel-core'],
        result.presets.map(prefixPresets)
      );
      this.fs.write(
        this.destinationPath('.babelrc'),
        stringify(result) + '\n'
      );
    },
  },
  install: function install() {
    this.runInstall('npm', this.devDepsToInstall, { 'save-dev': true });
  },
});
