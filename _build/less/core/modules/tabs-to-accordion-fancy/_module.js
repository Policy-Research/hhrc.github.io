// =============================================================================
// Module Configuration File - Required
// =============================================================================

// Description:     This is the module configuration file which is interpreted
//                  by the node script when figuring out dependencies. It
//                  is required for the module to be included regardless of 
//                  whether it requires anything. An empty object can be passed.
//                  More information on how to include these modules can be found 
//                  in the site/readme.md

// Options          - require: (array) 
//                        The require key receives an array of modules 
//                        required for this module to work. In LESS we allow 
//                        circular dependencies so this module can require a   
//                        module that requires it!
//                  - import: (array) 
//                        Array of other files to import (local to module)
//                  - version: (string) 
//                        Version number to be used for labeling and is 
//                        printed in css comments
//                  - description: (string)  
//                        Description to be used for labeling
//                        and is printed in css comments

//  Files:          Every module can have the following files:
//                  - vars.less    |   Variables used in the module
//                  - mixins.less  |   Mixins for the module
//                  - styles.less  |   CSS Styles for the module
//                  - Custom File  |   See import option above
  

module.exports = {
  version: "3.0.0",
  require: ["tabs-to-accordion", "tabs-fancy", "accordion-fancy"]
};