// =============================================================================
// Gulp Configuration
// =============================================================================

// Version 1.0.0 (Use with Gulp 4 File) 

// const { join } = require('path');
const enabled = true;
const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const chalk = require('chalk');
const { join } = require('path');
const { src, dest } = require("gulp");
const markdown = require('markdown-it')();

module.exports = {
  _mergeOptions: false,
  _debug: false,
  _before(done) {
    // Copy font awesome icon fonts
    return src(`./node_modules/@fortawesome/fontawesome-free/webfonts/**/*.{ttf,woff,woff2,eot,svg}`)
      .pipe(dest("./fonts"));
  },
  twig: {
    enabled,
    options: {
      dest: "./",
      config: {},
      getData() {
        const data = {};
        console.log(chalk.green.bold('Gathering Site Data...'));
        try {
          data.site = yaml.load(readFileSync('./_data/site.yaml', 'utf8'));
          data.webinars = yaml.load(readFileSync('./_data/webinars.yaml', 'utf8'));
        } catch (error) {
          console.error(chalk.red('Twig Data YAML Parse Error:'), error);
        }
        // Parse markdown fields
        try {
          data.webinars.forEach(w => {
            if (w.body) w.body = markdown.render(w.body);
          });
        } catch (error) {
          console.error(chalk.red('Markdown Parse Error:'), error);
        }
        return data;
      },
      watch: [
        "./_build/twig/**/*.twig",
        "./_data/**/*.yaml",
      ]
    }
  },
  webpack: {
    enabled,
    options: {
      config: {
        output: {
          path: join(__dirname, "js"),
          filename: 'scripts.js'
        },
      }
    }
  },
  autoprefixer: {
    enabled
  },
  less: {
    enabled,
    options: {
      dest: "./css/",
      less: {
        paths: [
          join(__dirname, 'node_modules')
        ]
      }
    }
  },
  lessFramework: {
    enabled
  },
  // hugo: {
  //   enabled
  // },
  // htmlmin: {
  //   enabled
  // },
  // htmlPretty: {
  //   enabled
  // },
  browserSync: {
    enabled,
    options: {
      init: {
        server: {
          baseDir: "./"
        }
      }  
    }
  },
  images: {
    enabled,
    options: {
      src: "./_build/images/**/*",
      dest:"./images",
      watch: "./_build/images/**/*",
    }
    // options: {}
  },
  imagemin: {
    enabled
  },
  // iconfont: {
  //   enabled,
  //   options: {
  //     onGlyphs(glyphs) {
  //       const glyphNames = glyphs.map(glyph => glyph.name);
  //       fs.writeFileSync('./data/icons.json', JSON.stringify(glyphNames));
  //     }
  //   }
  // }
};