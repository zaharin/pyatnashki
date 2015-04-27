var
    gulp = require('gulp')
    , plugins = require('../plugins')
    , config = require('../config')
    ;

var defaults = {
    deps: [],

    src: config.pathDest + '/**/*.html'
};

var options = plugins.extend({}, defaults, config.reload);

gulp.task('reload', options.deps, function () {
    return gulp.src(options.src)
        .pipe(plugins.connect.reload());
});