// =============================================================================
// Helpers Plugin
// =============================================================================

// Description:     This plugin will offer helpers...



registerPlugin({
  install: function(less, pluginManager, functions) {

    var tree = less.tree,
          Expression = tree.Expression,
          Operation  = tree.Operation,
          Anonymous  = tree.Anonymous,
          Value      = tree.Value,
          Node       = tree.Node,
          isArray    = Array.isArray;

    var cacheArray = {};

    functions.add('debug', function(title, value) {
      console.log(title.value, value);
      return false;
    });
    functions.add('arrayAdd', function(key, value) {
      
      if (cacheArray[key]) {
        cacheArray[key].push(value);
      } else {
        cacheArray[key] = [value];
      }

      return false;
    });
    functions.add('arrayGet', function(key) {
      return new Value(cacheArray[key] || []);
    });
  }
});

