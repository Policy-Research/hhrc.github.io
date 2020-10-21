================================================================================
# LESS Framework - Readme
================================================================================

Version:            3.0.1

Contents:           1. Setup
                    2. Stylesheet Order
                    3. Overriding the Core
                    4. Modules


## 1. Setup
--------------------------------------------------------------------------------

- Copy the core and the site folder to your new site
- Make sure the gulp-config.js file paths for "lessFramework" are pointed  
  to these folders.
- The system should be ready to go


## 2. Stylesheet Order
--------------------------------------------------------------------------------

- Base
  - Normalize
  - General HTML elements
  - Layout Classes
  - Icon Classes
- Modules
- Components
  * Custom components for the Site
- Bottom of Stylesheet
  Use the following mixin to add styles to this area
    .mix-bottom-stylesheet() {
      // Your code
    }


## 3. Overriding the Core
--------------------------------------------------------------------------------

Every part the framework can be overwritten by including the same filename in
the site folder.

For example overriding the table styles:
/core/base/tables.less
/site/base/tables.less <-- your custom file

Overriding a modules file:
/core/modules/buttons/styles.less
/site/modules/buttons/styles.less  <-- Your changes


## 4. Modules
--------------------------------------------------------------------------------

The framework by itself is just the base now. Most components of the system are
set up as modules. See "modules/_example/_module.js" for information on module 
development. The following just discusses setup of modules within a site and 
general information.

To include a module:
----------------------------------------

- Open the _config.js  file in the site folder
- Add a property to the config module "require"
- Add an array of module names. The module's name is the name of the directory 
  for that module(.ie buttons -is- /core/modules/buttons/ )
- All dependent modules for a module will be included in the site's css.

Module Files
----------------------------------------

Each module can contain the following optional files: 
- Vars.less
- Mixins.less
- Styles.less
- *Custom files (.less)*


Every file in the module will be copied to the site modules folder and given the 
prefix of default. (ie. default.styles.less) for reference or quickly overriding. 
These files are commented out for convenience when you choose to overwrite them.

The exception is the vars.less file which will be renamed to site-overrides.less
and will be commented out. This file can be used to override the module's 
variables and can also contain custom css for the site relating to that module.

Module Stylesheet Order
----------------------------------------

- Vars.less
- Mixins.less
- Styles.less
- *Custom files (.less)*
- Site-Overrides.less   <-- Imported after so it can override files above









