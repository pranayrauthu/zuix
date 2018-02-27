var gulp = require('gulp');
var compiler = require('gulp-closure-compiler');
module.exports = function() {
    // Compile/Minify zuix.js
    return gulp.src('dist/js/zuix.js', {base: 'dist/js/'})
        .pipe(compiler({
            fileName: 'zuix.min.js',  // outputs single file
            compilerFlags: {
                //debug: true, // <-- DO NOT ACTIVATE, causes errors in generated js
                warning_level: 'QUIET',
//              useTypesForOptimization: true,
                compilation_level: 'SIMPLE',
                language_in: 'ECMASCRIPT5_STRICT',
//                define: [
//                    "goog.DEBUG=false"
//                ],
                create_source_map: 'dist/js/zuix.min.js.map',
                source_map_location_mapping: 'dist/js/|./',
                output_wrapper: "%output%\n//# sourceMappingURL=zuix.min.js.map"
            }
        }))
        .pipe(gulp.dest('dist/js'));
};