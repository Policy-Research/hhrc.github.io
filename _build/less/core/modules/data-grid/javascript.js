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
