// =============================================================================
// Gulp Configuration
// =============================================================================

// Version 1.0.0 (Use with Gulp 4 File) 

// const { join } = require('path');
const enabled = true;
const fs = require('fs');

module.exports = {
  _mergeOptions: false,
  _debug: false,
  // webpack: {
  //   enabled,
  // },
  autoprefixer: {
    enabled
  },
  less: {
    enabled,
    options: {
      dest: "./css/"
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