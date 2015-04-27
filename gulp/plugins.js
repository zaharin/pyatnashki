function lazy(moduleName) {
    return function () {
        var module = require(moduleName);
        var args = Array.prototype.slice.call(arguments, 0);

        return module.apply(module, args);
    };
}

function lazyDefaults(moduleName) {
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        var locArgs = args;
        var module = require(moduleName);

        if (arguments.length)
            locArgs = arguments;

        return module.apply(module, locArgs);
    };
}

function logError(error) {
    console.log([
        '',
        '----------ERROR MESSAGE START----------',
        '[' + error.name + " in " + error.plugin + ']',
        error.message,
        '----------ERROR MESSAGE END----------',
        ''
    ].join('\n'));
}

exports.errorLog     = function errorLog(error) {
    console.error.bind(error);
    this.emit('end');
};

exports.errorStop    = require('pipe-error-stop');
exports.errorStopWrap = function () {

};
exports.extend       = lazy('extend');

exports.autoprefixer = lazyDefaults('gulp-autoprefixer', {
    browsers: ['last 2 versions'],
    cascade: false
});
exports.connect      = require('gulp-connect');
exports.concat       = lazy('gulp-concat');
exports.minifyCSS    = lazy('gulp-minify-css');
exports.rename       = lazy('gulp-rename');
exports.renameMain   = function () {
    return exports.rename(function (path) {
        path.basename = 'main';
    });
};
exports.renameMin    = function () {
    return exports.rename(function (path) {
        path.basename += '.min';
    });
};
exports.sass         = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    return exports.errorStop(require('gulp-sass').apply(module, args), { eachErrorCallback: logError })
};
exports.twig         = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    return exports.errorStop(require('gulp-twig').apply(module, args), { eachErrorCallback: logError })
};
exports.typescript   = require('gulp-typescript');
exports.sourcemaps   = require('gulp-sourcemaps');
exports.includeJs    = lazy('gulp-browser-js-include');
exports.PluginError  = require('gulp-util').PluginError;
