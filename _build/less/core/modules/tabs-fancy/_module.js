// =============================================================================
// Module Configuration File - Required
// =============================================================================

// Description:     This is the module configuration file which is interpreted
//                  by the node script when figuring out dependencies. It
//                  is required for the module to be included regardless of 
//                  whether it requires anything. An empty object can be passed.

//                  Require: The require key receives an array of modules 
//                  required for this module to work. In LESS we allow circular
//                  dependencies so this module can require a module that 
//                  requires it!

// Other Files:     Every module can have the following files:
//                  - vars.less  |   Variables used in the module (exposed globally)
//                  - mixins.less  |   Mixins for the module (exposed globally)
//                  - styles.less  |   Mixins for the module (exposed globally)

// More info:       More information on how to include these modules can be found 
//                  in the site's config file

module.exports = {
  version: "3.0.0",
  require: ["tabs"]
};