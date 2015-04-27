var
    gulp = require('gulp')
    , plugins = require('../plugins')
    , config = require('../config')
    ;

var defaults = {
    deps: [],

    src: config.pathSrc + 'scss/main.scss',
    dest: config.pathDest
};

var options = plugins.extend({}, defaults, config.scss);

gulp.task('scss', options.deps, function () {
    return gulp.src(options.src)
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(options.dest))
        .pipe(plugins.connect.reload());
});