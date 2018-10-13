(function() {
  var SublimeSelectEditorHandler, defaultCfg, inputCfg, key, mouseNumMap, os, packageName, selectKeyMap, value;

  packageName = "Sublime-Style-Column-Selection";

  os = require('os');

  SublimeSelectEditorHandler = require('./editor-handler.coffee');

  defaultCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          selectKeyName: 'Alt',
          mouseNum: 1,
          mouseName: "Left"
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
      default:
        return {
          selectKey: 'shiftKey',
          selectKeyName: 'Shift',
          mouseNum: 1,
          mouseName: "Left"
        };
    }
  })();

  mouseNumMap = {
    Left: 1,
    Middle: 2,
    Right: 3
  };

  selectKeyMap = {
    Shift: 'shiftKey',
    Alt: 'altKey',
    Ctrl: 'ctrlKey'
  };

  if (os.platform() === 'darwin') {
    selectKeyMap.Cmd = 'metaKey';
  }

  selectKeyMap.None = null;

  inputCfg = defaultCfg;

  module.exports = {
    config: {
      mouseButtonTrigger: {
        title: "Mouse Button",
        description: "The mouse button that will trigger column selection. If empty, the default will be used " + defaultCfg.mouseName + " mouse button.",
        type: 'string',
        "enum": (function() {
          var results;
          results = [];
          for (key in mouseNumMap) {
            value = mouseNumMap[key];
            results.push(key);
          }
          return results;
        })(),
        "default": defaultCfg.mouseName
      },
      selectKeyTrigger: {
        title: "Select Key",
        description: "The key that will trigger column selection. If empty, the default will be used " + defaultCfg.selectKeyName + " key.",
        type: 'string',
        "enum": (function() {
          var results;
          results = [];
          for (key in selectKeyMap) {
            value = selectKeyMap[key];
            results.push(key);
          }
          return results;
        })(),
        "default": defaultCfg.selectKeyName
      }
    },
    activate: function(state) {
      this.observers = [];
      this.editor_handler = null;
      this.observers.push(atom.config.observe(packageName + ".mouseButtonTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.mouseName = newValue;
          return inputCfg.mouseNum = mouseNumMap[newValue];
        };
      })(this)));
      this.observers.push(atom.config.observe(packageName + ".selectKeyTrigger", (function(_this) {
        return function(newValue) {
          inputCfg.selectKeyName = newValue;
          return inputCfg.selectKey = selectKeyMap[newValue];
        };
      })(this)));
      this.observers.push(atom.workspace.onDidChangeActivePaneItem(this.switch_editor_handler));
      this.observers.push(atom.workspace.onDidAddPane(this.switch_editor_handler));
      return this.observers.push(atom.workspace.onDidDestroyPane(this.switch_editor_handler));
    },
    deactivate: function() {
      var i, len, observer, ref, ref1;
      if ((ref = this.editor_handler) != null) {
        ref.unsubscribe();
      }
      ref1 = this.observers;
      for (i = 0, len = ref1.length; i < len; i++) {
        observer = ref1[i];
        observer.dispose();
      }
      this.observers = null;
      return this.editor_handler = null;
    },
    switch_editor_handler: (function(_this) {
      return function() {
        var active_editor, ref;
        if ((ref = _this.editor_handler) != null) {
          ref.unsubscribe();
        }
        active_editor = atom.workspace.getActiveTextEditor();
        if (active_editor) {
          _this.editor_handler = new SublimeSelectEditorHandler(active_editor, inputCfg);
          return _this.editor_handler.subscribe();
        }
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3Jqcy8uZG90ZmlsZXMvYXRvbS8uYXRvbS9wYWNrYWdlcy9TdWJsaW1lLVN0eWxlLUNvbHVtbi1TZWxlY3Rpb24vbGliL3N1YmxpbWUtc2VsZWN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsV0FBQSxHQUFjOztFQUVkLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCwwQkFBQSxHQUE2QixPQUFBLENBQVEseUJBQVI7O0VBRTdCLFVBQUE7QUFBYSxZQUFPLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBUDtBQUFBLFdBQ04sT0FETTtlQUVUO1VBQUEsU0FBQSxFQUFlLFFBQWY7VUFDQSxhQUFBLEVBQWUsS0FEZjtVQUVBLFFBQUEsRUFBZSxDQUZmO1VBR0EsU0FBQSxFQUFlLE1BSGY7O0FBRlMsV0FNTixRQU5NO2VBT1Q7VUFBQSxTQUFBLEVBQWUsUUFBZjtVQUNBLGFBQUEsRUFBZSxLQURmO1VBRUEsUUFBQSxFQUFlLENBRmY7VUFHQSxTQUFBLEVBQWUsTUFIZjs7QUFQUyxXQVdOLE9BWE07ZUFZVDtVQUFBLFNBQUEsRUFBZSxVQUFmO1VBQ0EsYUFBQSxFQUFlLE9BRGY7VUFFQSxRQUFBLEVBQWUsQ0FGZjtVQUdBLFNBQUEsRUFBZSxNQUhmOztBQVpTO2VBaUJUO1VBQUEsU0FBQSxFQUFlLFVBQWY7VUFDQSxhQUFBLEVBQWUsT0FEZjtVQUVBLFFBQUEsRUFBZSxDQUZmO1VBR0EsU0FBQSxFQUFlLE1BSGY7O0FBakJTOzs7RUFzQmIsV0FBQSxHQUNFO0lBQUEsSUFBQSxFQUFRLENBQVI7SUFDQSxNQUFBLEVBQVEsQ0FEUjtJQUVBLEtBQUEsRUFBUSxDQUZSOzs7RUFJRixZQUFBLEdBQ0U7SUFBQSxLQUFBLEVBQU8sVUFBUDtJQUNBLEdBQUEsRUFBTyxRQURQO0lBRUEsSUFBQSxFQUFPLFNBRlA7OztFQUlGLElBQWdDLEVBQUUsQ0FBQyxRQUFI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Q0FBQSxFQUZGOztNQUhxQjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F2Q3ZCOztBQTdDRiIsInNvdXJjZXNDb250ZW50IjpbInBhY2thZ2VOYW1lID0gXCJTdWJsaW1lLVN0eWxlLUNvbHVtbi1TZWxlY3Rpb25cIlxuXG5vcyA9IHJlcXVpcmUgJ29zJ1xuU3VibGltZVNlbGVjdEVkaXRvckhhbmRsZXIgPSByZXF1aXJlICcuL2VkaXRvci1oYW5kbGVyLmNvZmZlZSdcblxuZGVmYXVsdENmZyA9IHN3aXRjaCBvcy5wbGF0Zm9ybSgpXG4gIHdoZW4gJ3dpbjMyJ1xuICAgIHNlbGVjdEtleTogICAgICdhbHRLZXknXG4gICAgc2VsZWN0S2V5TmFtZTogJ0FsdCdcbiAgICBtb3VzZU51bTogICAgICAxXG4gICAgbW91c2VOYW1lOiAgICAgXCJMZWZ0XCJcbiAgd2hlbiAnZGFyd2luJ1xuICAgIHNlbGVjdEtleTogICAgICdhbHRLZXknXG4gICAgc2VsZWN0S2V5TmFtZTogJ0FsdCdcbiAgICBtb3VzZU51bTogICAgICAxXG4gICAgbW91c2VOYW1lOiAgICAgXCJMZWZ0XCJcbiAgd2hlbiAnbGludXgnXG4gICAgc2VsZWN0S2V5OiAgICAgJ3NoaWZ0S2V5J1xuICAgIHNlbGVjdEtleU5hbWU6ICdTaGlmdCdcbiAgICBtb3VzZU51bTogICAgICAxXG4gICAgbW91c2VOYW1lOiAgICAgXCJMZWZ0XCJcbiAgZWxzZVxuICAgIHNlbGVjdEtleTogICAgICdzaGlmdEtleSdcbiAgICBzZWxlY3RLZXlOYW1lOiAnU2hpZnQnXG4gICAgbW91c2VOdW06ICAgICAgMVxuICAgIG1vdXNlTmFtZTogICAgIFwiTGVmdFwiXG5cbm1vdXNlTnVtTWFwID1cbiAgTGVmdDogICAxLFxuICBNaWRkbGU6IDIsXG4gIFJpZ2h0OiAgM1xuXG5zZWxlY3RLZXlNYXAgPVxuICBTaGlmdDogJ3NoaWZ0S2V5JyxcbiAgQWx0OiAgICdhbHRLZXknLFxuICBDdHJsOiAgJ2N0cmxLZXknLFxuXG5zZWxlY3RLZXlNYXAuQ21kID0gJ21ldGFLZXknIGlmIG9zLnBsYXRmb3JtKCkgPT0gJ2Rhcndpbidcblxuc2VsZWN0S2V5TWFwLk5vbmUgPSBudWxsXG5cbmlucHV0Q2ZnID0gZGVmYXVsdENmZ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgY29uZmlnOlxuICAgIG1vdXNlQnV0dG9uVHJpZ2dlcjpcbiAgICAgIHRpdGxlOiBcIk1vdXNlIEJ1dHRvblwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbW91c2UgYnV0dG9uIHRoYXQgd2lsbCB0cmlnZ2VyIGNvbHVtbiBzZWxlY3Rpb24uXG4gICAgICAgIElmIGVtcHR5LCB0aGUgZGVmYXVsdCB3aWxsIGJlIHVzZWQgI3tkZWZhdWx0Q2ZnLm1vdXNlTmFtZX0gbW91c2UgYnV0dG9uLlwiXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZW51bTogKGtleSBmb3Iga2V5LCB2YWx1ZSBvZiBtb3VzZU51bU1hcClcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRDZmcubW91c2VOYW1lXG5cbiAgICBzZWxlY3RLZXlUcmlnZ2VyOlxuICAgICAgdGl0bGU6IFwiU2VsZWN0IEtleVwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaGUga2V5IHRoYXQgd2lsbCB0cmlnZ2VyIGNvbHVtbiBzZWxlY3Rpb24uXG4gICAgICAgIElmIGVtcHR5LCB0aGUgZGVmYXVsdCB3aWxsIGJlIHVzZWQgI3tkZWZhdWx0Q2ZnLnNlbGVjdEtleU5hbWV9IGtleS5cIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGVudW06IChrZXkgZm9yIGtleSwgdmFsdWUgb2Ygc2VsZWN0S2V5TWFwKVxuICAgICAgZGVmYXVsdDogZGVmYXVsdENmZy5zZWxlY3RLZXlOYW1lXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAb2JzZXJ2ZXJzID0gW11cbiAgICBAZWRpdG9yX2hhbmRsZXIgPSBudWxsXG5cbiAgICBAb2JzZXJ2ZXJzLnB1c2ggYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7cGFja2FnZU5hbWV9Lm1vdXNlQnV0dG9uVHJpZ2dlclwiLCAobmV3VmFsdWUpID0+XG4gICAgICBpbnB1dENmZy5tb3VzZU5hbWUgPSBuZXdWYWx1ZVxuICAgICAgaW5wdXRDZmcubW91c2VOdW0gPSBtb3VzZU51bU1hcFtuZXdWYWx1ZV1cblxuICAgIEBvYnNlcnZlcnMucHVzaCBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiI3twYWNrYWdlTmFtZX0uc2VsZWN0S2V5VHJpZ2dlclwiLCAobmV3VmFsdWUpID0+XG4gICAgICBpbnB1dENmZy5zZWxlY3RLZXlOYW1lID0gbmV3VmFsdWVcbiAgICAgIGlucHV0Q2ZnLnNlbGVjdEtleSA9IHNlbGVjdEtleU1hcFtuZXdWYWx1ZV1cblxuICAgIEBvYnNlcnZlcnMucHVzaCBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIEBzd2l0Y2hfZWRpdG9yX2hhbmRsZXJcbiAgICBAb2JzZXJ2ZXJzLnB1c2ggYXRvbS53b3Jrc3BhY2Uub25EaWRBZGRQYW5lICAgICAgICAgICAgICBAc3dpdGNoX2VkaXRvcl9oYW5kbGVyXG4gICAgQG9ic2VydmVycy5wdXNoIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmUgICAgICAgICAgQHN3aXRjaF9lZGl0b3JfaGFuZGxlclxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGVkaXRvcl9oYW5kbGVyPy51bnN1YnNjcmliZSgpXG4gICAgb2JzZXJ2ZXIuZGlzcG9zZSgpIGZvciBvYnNlcnZlciBpbiBAb2JzZXJ2ZXJzXG4gICAgQG9ic2VydmVycyA9IG51bGxcbiAgICBAZWRpdG9yX2hhbmRsZXIgPSBudWxsXG5cbiAgc3dpdGNoX2VkaXRvcl9oYW5kbGVyOiA9PlxuICAgIEBlZGl0b3JfaGFuZGxlcj8udW5zdWJzY3JpYmUoKVxuICAgIGFjdGl2ZV9lZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBhY3RpdmVfZWRpdG9yXG4gICAgICBAZWRpdG9yX2hhbmRsZXIgPSBuZXcgU3VibGltZVNlbGVjdEVkaXRvckhhbmRsZXIoYWN0aXZlX2VkaXRvciwgaW5wdXRDZmcpXG4gICAgICBAZWRpdG9yX2hhbmRsZXIuc3Vic2NyaWJlKClcbiJdfQ==
