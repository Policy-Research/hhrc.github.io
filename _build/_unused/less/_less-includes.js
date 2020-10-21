// =============================================================================
// Javascript - LESS Framework
// =============================================================================

// NOTE: THIS IS A DYNAMICALLY GENERATED FILE. DO NOT EDIT.

// This file is a contcatoned version of any javascript that was included by a 
// LESS module.

								// =============================================================================
// Data Grid - Javascript 
// =============================================================================

// Simple javascript calls needed for data grid rules functionality

_modules.interact('Equal Height', function() {
  this.add({
      selection: '[data-grid]',
      onParent: true,
      perParent: true,
      minHeight: true,
      propertyOnChild: false,
      byRows: true,
      includeMargin: false,
      debug: false,
      isFallback: function() {
        return Modernizr && Modernizr.flexbox && Modernizr.flexwrap;
      }
    });
});