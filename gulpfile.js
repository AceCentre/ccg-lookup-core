const gulp = require('gulp')
const named = require('vinyl-named');
const less = require('gulp-less')
const sourcemaps = require('gulp-sourcemaps')
const through = require('through2')
const gutil = require('gulp-util')
const path = require('path')
const util = require('util')
const _ = require('lodash')
const del = require('del')
const browserSync = require('browser-sync').create();
const webpackstream = require('webpack-stream');
const webpack = webpackstream.webpack

let src_dir = './html'
let less_dir = `${src_dir}/less`
let dist_dir = './html'
let dist_maps_dir = `${dist_dir}/maps`

// tasks
function build_less() {
  return gulp.src(less_dir+"/main.less")
    .pipe(sourcemaps.init())
    .pipe(less({ paths: [less_dir] }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(`${dist_dir}/css/`));
}
function build_script() {
  return gulp.src(`${src_dir}/jsx/main.js`, { base: src_dir })
    .pipe(named())
    .pipe(webpackstream({
      devtool: 'source-map',
      output: {
        filename: `js/main.js`,
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ["env", {
                    targets: {
                      "browsers": ["last 2 versions"]
                    },
                    useBuiltins: true
                  }]
                ],
                plugins: ["transform-runtime"]
              }
            }
          }
        ]
      },
      resolve: {
        modules: [
          `${src_dir}/jsx`,
          "node_modules"
        ]
      },
      plugins: [
        /*
        new webpack.ProvidePlugin({
          '_babeldummy': 'babel-polyfill'
        })*/
      ]
    }))
    .pipe(through.obj(function (file, enc, cb) {
      // Dont pipe through any source map files, it will be handled
      // by gulp-sourcemaps
      var isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) {
        // remove source-map link
        var idx = file.contents.lastIndexOf('//# sourceMappingURL=')
        var idx2 = file.contents.lastIndexOf('\n', file.contents.length - 2)
        if(idx != -1 && idx > idx2)
          file.contents = file.contents.slice(0, idx)
        file.contents = Buffer.concat([file.contents, Buffer.from('//# sourceMappingURL=../maps/'+path.relative('js', file.relative)+'.map')]);
      } else {
        file.path = path.resolve(file.base, "maps", path.relative('js', file.relative));
      }
      cb(null, file);
    }))
    .pipe(gulp.dest(dist_dir));
}
function clean(done) {
  del([dist_dir+"/maps/*",
       `${dist_dir}/js/main.js`,
       `${dist_dir}/css/style.css`])
    .then(() => done())
    .catch((err) => done(err || new Error("Unknown error")));
}
function watch() {
  gulp.watch(src_dir+'/less/**/*.less', build_less);
  gulp.watch(src_dir+'/jsx/**/*.js', build_script);
}
function browser_sync() {
  browserSync.init({
    files: [`${dist_dir}/**/*.{html|js|css}`],
    server: {
      baseDir: dist_dir
    },
    open: false
  });
}

gulp.task('clean', clean)
gulp.task('build', gulp.series(clean, build_script, build_less))
gulp.task('watch', gulp.series('build', watch))
gulp.task('dev', gulp.series('build', gulp.parallel(watch, browser_sync)))
