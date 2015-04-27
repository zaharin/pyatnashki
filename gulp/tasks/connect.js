var
    gulp = require('gulp')
    , plugins = require('../plugins')
    , config = require('../config')
    ;

var defaults = {
    deps: [],

    options: {
        root: config.pathDest,
        livereload: true
    }
};

var options = plugins.extend({}, defaults, config.connect);

gulp.task('connect', options.deps, function() {
    plugins.connect.server(options.options);
});