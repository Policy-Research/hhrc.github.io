// node --inspect-brk /Users/joe/.nvm/versions/node/v8.11.3/bin/gulp srv

registerPlugin({
  install: function(less, pluginManager, functions) {
    functions.add('_mergeRulesets', function(...objects) {

      // if (!objects) return;

      // var merged = {},
      //     name, 
      //     hashName;

      // objects.forEach((o) => {

      //   if (o.ruleset && o.ruleset.rules) {

      //     o.ruleset.rules.forEach((rule) => {

      //       name = rule.name;

      //       if (name) {
      //         if (typeof name === "string") {
      //           hashName = name;
      //         } else if (name[0] && name[0].value) {
      //           hashName = name[0].value;
      //         }

      //         // Add to lookup table
      //         if (hashName) {
      //           merged[hashName] = rule;
      //         }
      //       }

      //     });
      //   }
      // });


      // if (Object.keys(merged).length) {
      //   // Create ruleset
      // }
      
      // Temporary until I figure out how to return
      // a new ruleset
      // return objects[0];
    });
  }
});

