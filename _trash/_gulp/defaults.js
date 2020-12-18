const { join } = require('path');
const chalk = require('chalk');

module.exports = {
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
    webpackHotReload: false,
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
  scss: {
    enabled: false,
    options: {
      src: "./_build/scss/styles.scss",
      dest: "./public/css/",
      watch: "./_build/scss/**/*",
      filename: 'styles.css',
      scss: null, // For compiler options
      compiler: null // Pass compiler node-sass / dart-sass (defaults if nothing is set)
    }
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
  twig: {
    enabled: false,
    options: {
      src: "./_build/twig/index.twig",
      dest: "./public/",
      data: null, // Use for dynamic data (data that should be refreshed on twig re-run) 
      watch: [
        "./_build/twig/**/*.twig"
      ],
      config: {
        base: "./_build/twig/",
        onError(error) {
          console.error(chalk.red('Twig Parse Error Details:'), error);
        }
      } // Pass configuration to template renderer gulp-twig
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