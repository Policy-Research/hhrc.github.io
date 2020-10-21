// =============================================================================
// Module Configuration File - Required
// =============================================================================

module.exports = {
  version: "3.0.0",
  description: `This module holds all custom code to display demos of less 
                framework modules on the codekit site`,
  require: [
    "grid",
    "legacy--grid-fluid",
    "lists",
    "atomic",
    "atomic--type",
    "overlays",
    "dropdowns",
    "tabs",
    "tabs-fancy",
    "accordion",
    "accordion-fancy",
    "tabs-to-accordion",
    "tabs-to-accordion-fancy",
    "modals",
    "modals-fancy",
    "data-grid"
  ],
  import: [
    "example--grid.less",
    "example--grid-fluid.less",
    "example--list.less",
    "example--atomic.less",
    "example--overlays",
    "example--data-grid"
  ]
};