// =============================================================================
// Gulp 4 File
// =============================================================================

// Version:         1.0.1

const importFresh = require('import-fresh');
const { src, dest, series, watch } = require("gulp");
const { existsSync } = require("fs");
const { join, resolve } = require('path');
const del = require("del");
const chalk = require('chalk');
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const gulpDebug = require('gulp-debug');
const iconfont = require('gulp-iconfont');
const htmlmin = require("gulp-htmlmin");
const htmlPretty = require('gulp-pretty-html');
const rename = require("gulp-rename");
const when = require("gulp-if");
const minifyCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const util = require("util")
const log = console.log;
const exec = require('child_process').exec;
const deepmerge = require("deepmerge");
const webpack = require("webpack");
const userConfig = existsSync("./gulp.config.js") ? require("./gulp.config.js") : {};
const timestamp = Math.round(Date.now()/1000);
const defaults = {
  iconfont: {
    enabled: false,
    options: {
      src: "./_build/iconfont/*.svg",
      dest: "./public/fonts",
      watch: "./_build/iconfont/*.svg",
      pluginOptions: {
        fontName: 'iconfont',
        prependUnicode: true,
        formats: ['ttf', 'eot', 'woff'],
      },
      onGlyphs: null // Optional callback when the generator creates the font (argument: glyphs)
    }
  },
  browserSync: {
    enabled: false,
    options: {
      init: {
        server: {
          baseDir: "./public/"
        }
      }  
    }
  },
  images: {
    enabled: false,
    options: {
      src: "./_build/images/**/*",
      dest:"./public/images",
      watch: "./_build/images/**/*",
    }
  },
  imagemin: {
    enabled: false,
    options: {}
  },
  less: {
    enabled: false,
    options: {
      src: "./_build/less/styles.less",
      dest: "./public/css/",
      watch: "./_build/less/**/*",
      filename: 'styles.css',
      less: null, // For compiler
      formatLogs: true, // Use internal function to cleanup less error output
      formatLogsSimplePaths: true // Trim path in errors to current directory omitting HD root folder, etc
    }
  },
  lessFramework: {
    enabled: false,
    options: {
      pathCore: "_build/less/core",
      pathSite: "_build/less/site",
      pathJavascript: "_build/_unused/less/_less-includes.js",
      filename: "styles.css",
      consoleLogs: false,
      consoleLogsDev: false
    }
  },
  autoprefixer: {
    enabled: true,
    options: {
      cascade: false,
      remove: false
    }
  },
  html: {
    enabled: false,
    options: {
      src: "./public/*.html",
      dest: "./public"
    }
  },
  htmlmin: {
    enabled: false,
    options: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      preserveLineBreaks: true
    }
  },
  htmlPretty: {
    enabled: false,
    options: {
      indent_size: 2,
      indent_char: ' '
    }
  },
  hugo: {
    enabled: false,
    options: {
      command: 'hugo',
      outputDir: './public',
      afterBuild: false, // Callback
      watch: [
        "./content/**/*", 
        "./layouts/**/*",
        "./data/**/*"
      ]
    }
  },
  webpack: {
    enabled: false,
    options: {
      watch: "./_build/js/**/*",
      config: {
        entry: join(__dirname, "_build", "js", "index.js"),
        output: {
          path: join(__dirname, "public", "js"),
          filename: 'scripts.js'
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
          ]
        },
        devtool: 'source-map'
      }
    },
  }
};
// Merge user configuration (optionally pass merge options)
const config = deepmerge(defaults, userConfig, userConfig._mergeOptions || {});
// Quick Functions to aid in accessing the config
const enabled = k => config[k].enabled;
const configurableTask = name => name in config;
const getOptions = k => config[k].options;
// Runtime Flags
let isServe = false;
let isServing = false;
// Optional reference used between tasks when enabled
let lessFramework;
// Output Debug Information
debugToConsole('Config', config);
if (enabled('webpack')) debugToConsole('Webpack Config', config.webpack.options.config);
// Main Task Object 
const tasks = {
  less(done) {
    const options = getOptions('less');
    let opts;
    let optLess = options.less;
    let optSrc = options.src;

    if (enabled('lessFramework')) {
      opts = initLessFramework();
      if (!opts) return done(); // Error
      optLess = opts.lessOptions;
      optSrc = opts.src;
    }

    return src(optSrc, { sourcemaps: true })
      .pipe(srcDebug('less'))
      .pipe(plumber())
      .pipe(less(optLess))
      .on('error', lessError)
      .pipe(when(enabled('autoprefixer'), autoprefixer(getOptions('autoprefixer'))))
      .pipe(when(!isServe, minifyCss()))
      .pipe(rename(options.filename))
      .pipe(dest(options.dest, { sourcemaps: '.' }))
      .pipe(when(isServing, browserSync.stream()));
  },
  webpack(done) {
    const options = getOptions('webpack');
    return new Promise((resolve, reject) => {
      webpack(options.config, (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (stats.hasErrors()) {
          return reject(new Error(stats.compilation.errors.join('\n')));
        }
        resolve();
      });
    });
  },
  images(done) {
    const options = getOptions('images');
    del.sync(options.dest);
    return src(options.src)
      .pipe(srcDebug('images'))
      .pipe(when(enabled('imagemin'), imagemin()))
      .pipe(dest(options.dest));
  },
  iconfont(done) {
    const options = getOptions('iconfont');
    const pluginOptions = { ...options.pluginOptions, timestamp };
    return src(options.src)
      .pipe(srcDebug('iconfont'))
      .pipe(iconfont(pluginOptions))
      .on('glyphs', onIconFontGlyphs)
      .pipe(dest(options.dest));
  },
  hugo(done) {
    const options = getOptions('hugo');
    // Remove previous build
    if (!isServing) del.sync(options.outputDir);
    // Have hugo build again
    exec(options.command, (stdout, stderr) => {
      // stderr = string | stdout= object
      debugHeader('Hugo Build:');
      if (stdout) {
        debugNote('Standard Output (stdout):');
        log(hugoLog(stdout.toString()));                                 
      }
      if (stderr) {
        debugNote('Standard Error (stderr):');
        log(hugoLog(stderr));                                 
      }              
      // Allow user to hook in                       
      if (options.afterBuild) {
        options.afterBuild.call(done);                         
      } else {
        done();
      }
    });
  },
  html(done) {
    const options = getOptions('html');
    return src(options.src)
      .pipe(srcDebug('html'))
      .pipe(when(enabled('htmlmin'), htmlmin(getOptions('htmlmin'))))
      .pipe(when(enabled('htmlPretty'), htmlPretty(getOptions('htmlPretty'))))
      .pipe(dest(options.dest));
  },
  reload(done) {
    if (enabled('browserSync')) {
      browserSync.reload();
    }
    done();
  },
  develop() {
    isServing = true;
    if (enabled('browserSync')) {
      browserSync.init(getOptions('browserSync').init);
    }
    // Merge in framework watch paths
    const lessWatchOptions = enabled('lessFramework') ? lessFramework.pathList : getOptions('less');
    // Set all watchers
    createWatch('less',     [ tasks.less ], lessWatchOptions);
    createWatch('images',   [ tasks.images, tasks.reload ]);
    createWatch('iconfont', [ tasks.iconfont, tasks.less, tasks.reload ]);
    createWatch('webpack',  [ tasks.webpack, tasks.reload ]);
    createWatch('hugo',     [ tasks.generate, tasks.reload ]);
  },
  // Sets flag so that other tasks know how to behave
  setServe(done) {
    isServe = true;
    done();
  }
};

// Create Dynamic Tasks
tasks.generate = createSeries('hugo', 'html');
tasks.build = createSeries('generate', 'less', 'webpack', 'images', 'iconfont');
tasks.serve = createSeries('setServe', 'build', 'develop');
tasks.default = tasks.build;

// Export Gulp Interface
module.exports = tasks;


// Utility Functions
// =============================================================================

/**
 *   Consumes array of task names, checks if they're enabled and returns 
 *   a gulp series with only the tasks that are enabled.
 *   @param  {...String}   names    Names of tasks
 *   @return {Function}             Gulp Series function or false no task
 */
function createSeries(...names) {
  // If a configurable task it needs to be checked if it's enabled
  // else it's a system non-configurable tasks which should run
  const enabledNames = names.filter(n => configurableTask(n) ? enabled(n) : true);
  // Filtering out false tasks, tasks that are set to false were set
  // by this function only and it means they are composed tasks that had no 
  // enabled tasks
  const enabledTasks = enabledNames.map(n => tasks[n]).filter(t => t !== false);
  // If there are enabled tasks to run put them in an array, else pass 
  // false so the task doesn't run if included in other createSeries
  return enabledTasks.length ? series(...enabledTasks) : false
}
/**
 *   Sets a Gulp watch conditionally
 *   @param  {String} key     Task key
 *   @param  {Array} tasks   Array of tasks to execute on watch change
 *   @param  {Object} options Optionally use passed options over those set in config for that task key
 */
function createWatch(key, tasks, options) {
  if (!enabled(key)) return;
  if (!options) options = getOptions(key);
  const watcher = watch(options.watch, series(...tasks));
  // If debug is enabled tell the user which files are triggering watcher
  if (config._debug) {
    watcher.on('all', (event, path) => {
      debugHeader(`Watcher Triggered (${ key })`);
      console.log('Watcher (event):', event);
      console.log('Watcher (path):', path);
    });
  }
}
/**
 *   Handles starting the Less Framework scripts
 *   @return  {Object}    Configuration to merge into Less task's options
 */
function initLessFramework() {
  const options = getOptions('lessFramework');
  const LessLists = require('less-plugin-lists');
  const LessFramework = importFresh(resolve(options.pathCore, 'node_modules', 'less-framework.js'));
  const framework = lessFramework = LessFramework({
    ...options, 
    baseDir: __dirname, 
    rootRequire: require,
    id: "styles"
  }); 
  if (!framework.checkPaths()) return false;
  framework.modulesInit();
  return {
    src: framework.paths.stylesheet,
    lessOptions: {
      paths: framework.pathList.resolve,
      plugins: [(new LessLists)],
      globalVars: {
        "wysiwyg-stylesheet": false, // Not supporting right now
        "pathSite" : `"${ framework.paths.site }"`,
        "pathCore" : `"${ framework.paths.core }"`
      }
    }
  };
}
/**
 * Handles the system and optional user callbacks
 * for the iconfont task when new glyphs have been created
 * @param {Array} glyphs 
 */
function onIconFontGlyphs(glyphs) {
  const options = getOptions('iconfont');
  // Let the framework handle creating 
  // less mixins for glyphs
  if (enabled('lessFramework') && lessFramework) {
    lessFramework.iconsFontInit(glyphs);
  } 
  // Without lessFramework or in combination with
  // User can do something by passing a callback
  if (options.onGlyphs)  {
    options.onGlyphs(glyphs);
  }
}
/**
 * Returns a new instance of gulp debug with a relevant title
 * if the user has debug enabled
 * @param {String} title The title for the debug src files list
 */
function srcDebug(title) {
  return when(config._debug, gulpDebug({ title }));
}
/**
 *   [debugHeader description]
 *   @param  {[type]} msg [description]
 *   @return {[type]}     [description]
 */
function debugHeader(msg) {
  log('\n' + chalk.bold.yellow("# " + msg));
}
/**
 *   Sends a console log if the user's config has debug enabled
 *   @param  {String}    title Title of the line sent to the console
 *   @param  {*} msgs    Anything you want to send to the console
 */
function debugToConsole(title, ...msgs) {
  if (config._debug) {
    debugHeader(`Gulpfile Debug (${ title }):`);
    log.apply(null, msgs);
  }
}
/**
 *   Creates a yellow debug line
 *   @param  {String} msg  Message line to output to console
 */
function debugNote(msg) {
  log(chalk.yellow('\n' + msg));
  log(chalk.dim.yellow("---"));
}
// 
/**
 *   Function for formatting the error output from hugo
 *   @param  {String}   msg   STD out from terminal
 *   @return {String}         Formated string with color highlighting
 */
function hugoLog(msg) {

  // If users preference is not to format
  if (typeof msg !== "string" || !config.hugo.formatLogs) return msg;

  // Determine if this if the log has keywords
  var hasError = msg.search(/error/i),
      hasWarning = msg.search(/warn/i),
      hasInfo = msg.search(/info/i);

  // If none are found exit (bypass)
  if (Math.max(hasError, hasWarning, hasInfo) < 0) {
    return msg;
  }

  // Expression related to warnings
  var warnTimestamp = /WARN\s\d{4}([\/.-])\d{2}\1\d{2}\s\d{2}([:])\d{2}([:])\d{2}\s/g,
      warning = /WARNING:/g;

  // Expressions relating to errors
  var errorTimestamp = /ERROR\s\d{4}([\/.-])\d{2}\1\d{2}\s\d{2}([:])\d{2}([:])\d{2}\s/g,
      error = /Error:/gi,
      bullet = '\n ' + chalk.yellow('-') + ' ',
      indent = '\n   ',
      whiteSpace = /\n\s*\n/g,
      fnName = /<[a-z0-9]+>:/g;

  var infoTimestamp = /INFO\s\d{4}([\/.-])\d{2}\1\d{2}\s\d{2}([:])\d{2}([:])\d{2}\s/g;

  // Replacements in the string
  var formatted = msg
    .replace(errorTimestamp, chalk.red('\nError') + bullet)
    .replace(error, chalk.red('\nError') + bullet)
    .replace('Building sites … ', '')
    .replace(fnName, function(match) {
      return  indent + chalk.red(match);
    })
    .replace('wrong number of args', chalk.red.dim('wrong number of args'))
    .replace('template:', indent + chalk.red('Template:'))
    .replace(warning, chalk.keyword('brown')('\nWarning') + bullet)
    .replace(warnTimestamp, chalk.keyword('brown')('\nWarning') + bullet)
    .replace(infoTimestamp, '\nInformation' + bullet)
  ;

  // Include the original message grayed out in case needed or if 
  // this function was to remove something meaningful
  var original =  '\nOriginal Log:' +
      chalk.dim.yellow('\n---\n') +
      chalk.dim.gray(msg);

  return formatted + original + '\n';
}
/**
 *   Enhances Less Error Output
 *   @param  {Error} error Error object from less
 */
function lessError(error) {

  var original = error.toString(),
      output = original;

  const options = getOptions('less');

  if (options.formatLogs) {

    var pathConvert = options.formatLogsSimplePaths,
        currentDir = pathConvert ? __dirname : '';

    var colonLev1 = /\n[a-z]*:/gi,
        colonLev2 = /\n\s{2,}\w*:/gi,
        pathURL = /\/.*?\.\S*/gi;

    output = original
      .replace(colonLev1, match => {
        return  chalk.gray('\n---') + chalk.yellow(match);
      })
      .replace(colonLev2, match => {
        return chalk.cyan(match)
      })
      .replace(pathURL, match => {
        var simplePath = match.replace(currentDir, '');
        return chalk.gray(simplePath);
      });
  }

  debugHeader('LESS Error');
  log('\n' + output);
  this.emit('end');
}    


