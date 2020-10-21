// =============================================================================
// Get
// =============================================================================

// Description:     Plugin will get the first item with passed key.

// Syntax:          @defaults: { H: "hello" }
//                  @other:    { X: "world" }
//                  @val: _get('H', @other, @defaults)
//                  --> Would @val would get "hello" because the prop 
//                      isn't set on @other

registerPlugin({
  install: function(less, pluginManager, functions) {

    functions.add('_get', function(key, test, ...vars) {

      var rule = false;
      // console.log(test, 'var');
      vars.find((v) => {
        // console.log(v, 'ruleset');
        if (v && v.ruleset) {
          rule = v.ruleset.rules.find((r) => {
            console.log(r, 'rule', r.name === key.value, r.value.type);
            return r.name === key.value;
          });
          return rule;
        }
      });
      // console.log(rule);
      if (rule.type === "Anonymous") {
        return new Dimension(rule.value);
      } 
      return rule;
    });
  }
});

// Planned usage
// =============================================================================

// @columns:                   _get("@attribute-child", @hellow,  @o, @d);

// @data-grid-defaults: {
//   @columns:                   12;
//   @breakpoint:                @tablet-up;
//   @gutter:                    20px;
//   @attribute-parent:          "data-grid";
//   @test: { hello: "world" };
//   @attribute-child:           "data-grid-item";
// };