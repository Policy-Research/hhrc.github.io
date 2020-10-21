functionRegistry.addMultiple({
    _SELF: function(n) {
        return n;
    },
    extract: function(values, index) {
        index = index.value - 1; // (1-based index)

        return getItemsFromNode(values)[index];
    },
    length: function(values) {
        return new Dimension(getItemsFromNode(values).length);
    },
    each: function(list, rs) {
        var i = 0, rules = [], newRules, iterator;

        if (list.value) {
            if (Array.isArray(list.value)) {
                iterator = list.value;
            } else {
                iterator = [list.value];
            }
        } else if (list.ruleset) {
            iterator = list.ruleset.rules;
        } else if (Array.isArray(list)) {
            iterator = list;
        } else {
            iterator = [list];
        }

        var valueName = '@value',
            keyName = '@key',
            indexName = '@index';

        if (rs.params) {
            valueName = rs.params[0] && rs.params[0].name;
            keyName = rs.params[1] && rs.params[1].name;
            indexName = rs.params[2] && rs.params[2].name;
            rs = rs.rules;
        } else {
            rs = rs.ruleset;
        }
        
        iterator.forEach(function(item) {
            i = i + 1;
            var key, value;
            if (item instanceof Declaration) {
                key = typeof item.name === 'string' ? item.name : item.name[0].value;
                value = item.value;
            } else {
                key = new Dimension(i);
                value = item;
            }

            newRules = rs.rules.slice(0);
            if (valueName) {
                newRules.push(new Declaration(valueName,
                    value,
                    false, false, this.index, this.currentFileInfo));
            }
            if (indexName) {
                newRules.push(new Declaration(indexName,
                    new Dimension(i),
                    false, false, this.index, this.currentFileInfo));
            }
            if (keyName) {
                newRules.push(new Declaration(keyName,
                    key,
                    false, false, this.index, this.currentFileInfo));
            }
        
            rules.push(new Ruleset([ new(Selector)([ new Element("", '&') ]) ],
                newRules,
                rs.strictImports,
                rs.visibilityInfo()
            ));
        });

        return new Ruleset([ new(Selector)([ new Element("", '&') ]) ],
                rules,
                rs.strictImports,
                rs.visibilityInfo()
            ).eval(this.context);

    }
});