var
    gulp = require('gulp')
    , plugins = require('../plugins')
    , config = require('../config')
    , es = require('event-stream')
    , fs     = require('fs')
    , path = require('path')
    //, os = require('os')
    ;

var defaults = {
    deps: [],

    src: config.pathSrc + 'scripts/main.ts',
    dest: config.pathDest,
    tsproject: plugins.typescript.createProject({
        declarationFiles: false,
        removeComments: false,
        target: 'ES5',
        noExternalResolve: false,
        noImplicitAny: false,
        sortOutput: true
    })
};

var options = plugins.extend({}, defaults, config.ts);

function injectReference() {

    const PLUGIN_NAME = 'gulp-inject-reference';

    var files = [];
    var regExpReference = /[\/]{3} *<reference +path=['"](\S*)['"] *(?:\/>|>).*/g;

    function getFileContent(file) {
        if (!fs.existsSync(file) )
            throw new plugins.PluginError(PLUGIN_NAME, 'File not found: ' + file);

        return fs.readFileSync(file, { encoding: 'utf8' });
    }

    function execute(file, content) {
        files = [];
        return processing(file, content, 1);
    }

    function processing(file, content, depth) {
        if (files.indexOf(file) > -1) return '';
        files.push(file);

        return content.replace(regExpReference, function (match, fileReference) {
            var fullFileReference = path.normalize(path.dirname(file) + path.sep + fileReference);
            //console.log(fullFileReference.slice(-5));
            if (fullFileReference.slice(-5) === '.d.ts') return match;

            if (files.indexOf(fullFileReference) > -1) return '';

            return processing(fullFileReference, getFileContent(fullFileReference), depth + 1);//'//BEGIN INJECT depth ' + depth + ' ' + fileReference + os.EOL
                /*+*/
                //+ os.EOL + '//END INJECT depth ' + depth + ' ' + fileReference + os.EOL;
        });
    }

    function inject(file, callback) {
        if (file.isStream()) {
            this.emit('error', new plugins.PluginError(PLUGIN_NAME, 'stream not supported'));
            return callback(null, file);
        }

        if (file.isBuffer()) {
            var content = execute(path.normalize(file.path), file.contents.toString('utf8'));
            fs.writeFileSync(file.path + '.tmp', content);
            file.contents = new Buffer(content);
        }

        //console.log(files);

        return callback(null, file);
    }

    return es.map(inject);
}

gulp.task('ts', options.deps, function () {
    return gulp.src(options.src)
        .pipe(injectReference())
        //.pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(options.tsproject))
        .on('error', plugins.errorLog)
        .js
        //.pipe(plugins.renameMain())
        //.pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(options.dest));
/*
    typescriptResult.dts.pipe(gulp.dest('release/definitions'));
    return typescriptResult.js.pipe();*/
});