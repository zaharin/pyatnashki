var
    gulp = require('gulp')
    , plugins = require('../plugins')
    , config = require('../config')
    ;

var defaults = {
    deps: ['connect', 'ts', 'scss'],

    watchlist: [
        {
            name: 'scss',
            glob: config.pathSrc + 'scss/**/*.scss',
            // tasks or cb
            tasks: ['scss']
        }
        , {
            name: 'html',
            glob: config.pathDest + '**/*.html',
            // tasks or cb
            tasks: ['reload']
        }
        , {
            name: 'js',
            glob: config.pathDest + '**/*.js',
            // tasks or cb
            tasks: ['reload']
        }
        , {
            name: 'ts',
            glob: config.pathSrc + 'scripts/**/*.ts',
            tasks: ['ts']
        }
    ]
};

var options = plugins.extend(null, {}, defaults, config.watch);

gulp.task('watch', options.deps, function () {
    options.watchlist.forEach(function (item) {
        gulp.watch(item.glob, item.tasks);

        console.log('watch... ' + item.name);
    });
});