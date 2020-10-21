// =============================================================================
// NOT WORKING - Helpers Plugin
// =============================================================================

// Description:     This plugin will allow dynamic variables in LESS
registerPlugin({
  install: function(less, pluginManager, functions) {
    var cacheValues = {};

    functions.add('varGet', function(key) {
      console.log('ok', cacheValues[key.value], key.value);
      return cacheValues[key];
    });
    functions.add('varSet', function(key, value) {
      console.log('Setting', key, value);
      cacheValues[key.value] = value;
      return value;
    });
  }
});

