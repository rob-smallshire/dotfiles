(function() {
  var Point, SublimeSelectEditorHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Point = require('atom').Point;

  module.exports = SublimeSelectEditorHandler = (function() {
    function SublimeSelectEditorHandler(editor, inputCfg) {
      this.onRangeChange = bind(this.onRangeChange, this);
      this.onBlur = bind(this.onBlur, this);
      this.onMouseEventToHijack = bind(this.onMouseEventToHijack, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.onMouseDown = bind(this.onMouseDown, this);
      this.editor = editor;
      this.inputCfg = inputCfg;
      this._resetState();
      this._setup_vars();
    }

    SublimeSelectEditorHandler.prototype.subscribe = function() {
      this.selection_observer = this.editor.onDidChangeSelectionRange(this.onRangeChange);
      this.editorElement.addEventListener('mousedown', this.onMouseDown);
      this.editorElement.addEventListener('mousemove', this.onMouseMove);
      this.editorElement.addEventListener('mouseup', this.onMouseEventToHijack);
      this.editorElement.addEventListener('mouseleave', this.onMouseEventToHijack);
      this.editorElement.addEventListener('mouseenter', this.onMouseEventToHijack);
      this.editorElement.addEventListener('contextmenu', this.onMouseEventToHijack);
      return this.editorElement.addEventListener('blur', this.onBlur);
    };

    SublimeSelectEditorHandler.prototype.unsubscribe = function() {
      this._resetState();
      this.selection_observer.dispose();
      this.editorElement.removeEventListener('mousedown', this.onMouseDown);
      this.editorElement.removeEventListener('mousemove', this.onMouseMove);
      this.editorElement.removeEventListener('mouseup', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('mouseleave', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('mouseenter', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('contextmenu', this.onMouseEventToHijack);
      return this.editorElement.removeEventListener('blur', this.onBlur);
    };

    SublimeSelectEditorHandler.prototype.onMouseDown = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        return false;
      }
      if (this._mainMouseAndKeyDown(e)) {
        this._resetState();
        this.mouseStartPos = this._screenPositionForMouseEvent(e);
        this.mouseEndPos = this.mouseStartPos;
        e.preventDefault();
        return false;
      }
    };

    SublimeSelectEditorHandler.prototype.onMouseMove = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        if (this._mainMouseDown(e)) {
          this.mouseEndPos = this._screenPositionForMouseEvent(e);
          if (this.mouseEndPos.isEqual(this.mouseEndPosPrev)) {
            return;
          }
          this._selectBoxAroundCursors();
          this.mouseEndPosPrev = this.mouseEndPos;
          return false;
        }
        if (e.which === 0) {
          return this._resetState();
        }
      }
    };

    SublimeSelectEditorHandler.prototype.onMouseEventToHijack = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        return false;
      }
    };

    SublimeSelectEditorHandler.prototype.onBlur = function(e) {
      return this._resetState();
    };

    SublimeSelectEditorHandler.prototype.onRangeChange = function(newVal) {
      if (this.mouseStartPos && !newVal.selection.isSingleScreenLine()) {
        newVal.selection.destroy();
        return this._selectBoxAroundCursors();
      }
    };

    SublimeSelectEditorHandler.prototype._resetState = function() {
      this.mouseStartPos = null;
      return this.mouseEndPos = null;
    };

    SublimeSelectEditorHandler.prototype._setup_vars = function() {
      if (this.editorElement == null) {
        this.editorElement = atom.views.getView(this.editor);
      }
      return this.editorComponent != null ? this.editorComponent : this.editorComponent = this.editorElement.component;
    };

    SublimeSelectEditorHandler.prototype._screenPositionForMouseEvent = function(e) {
      var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
      this._setup_vars();
      pixelPosition = this.editorComponent.pixelPositionForMouseEvent(e);
      targetTop = pixelPosition.top;
      targetLeft = pixelPosition.left;
      defaultCharWidth = this.editor.getDefaultCharWidth();
      row = Math.floor(targetTop / this.editor.getLineHeightInPixels());
      if (row > this.editor.getLastBufferRow()) {
        targetLeft = 2e308;
      }
      row = Math.min(row, this.editor.getLastBufferRow());
      row = Math.max(0, row);
      column = Math.round(targetLeft / defaultCharWidth);
      return new Point(row, column);
    };

    SublimeSelectEditorHandler.prototype._mainMouseDown = function(e) {
      return e.which === this.inputCfg.mouseNum;
    };

    SublimeSelectEditorHandler.prototype._mainMouseAndKeyDown = function(e) {
      if (this.inputCfg.selectKey) {
        return this._mainMouseDown(e) && e[this.inputCfg.selectKey];
      } else {
        return this._mainMouseDown(e);
      }
    };

    SublimeSelectEditorHandler.prototype._numCharsInScreenRange = function(screenRange) {
      var bufferRange, contentsOfRange;
      bufferRange = this.editor.bufferRangeForScreenRange(screenRange);
      contentsOfRange = this.editor.getTextInBufferRange(bufferRange);
      return contentsOfRange.length;
    };

    SublimeSelectEditorHandler.prototype._selectBoxAroundCursors = function() {
      var emptyRanges, finalRanges, i, isReversed, numChars, range, ranges, ref, ref1, row;
      if (this.mouseStartPos && this.mouseEndPos) {
        emptyRanges = [];
        ranges = [];
        for (row = i = ref = this.mouseStartPos.row, ref1 = this.mouseEndPos.row; ref <= ref1 ? i <= ref1 : i >= ref1; row = ref <= ref1 ? ++i : --i) {
          if (this.mouseEndPos.column < 0) {
            this.mouseEndPos.column = 0;
          }
          range = [[row, this.mouseStartPos.column], [row, this.mouseEndPos.column]];
          numChars = this._numCharsInScreenRange(range);
          if (numChars === 0) {
            emptyRanges.push(range);
          } else {
            ranges.push(range);
          }
        }
        finalRanges = ranges.length ? ranges : emptyRanges;
        if (finalRanges.length) {
          isReversed = this.mouseEndPos.column < this.mouseStartPos.column;
          return this.editor.setSelectedScreenRanges(finalRanges, {
            reversed: isReversed
          });
        }
      }
    };

    return SublimeSelectEditorHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3Jqcy8uZG90ZmlsZXMvYXRvbS8uYXRvbS9wYWNrYWdlcy9TdWJsaW1lLVN0eWxlLUNvbHVtbi1TZWxlY3Rpb24vbGliL2VkaXRvci1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7SUFDUyxvQ0FBQyxNQUFELEVBQVMsUUFBVDs7Ozs7O01BQ1gsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsV0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUpXOzt5Q0FNYixTQUFBLEdBQVcsU0FBQTtNQUNULElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLElBQUMsQ0FBQSxhQUFuQztNQUN0QixJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLFdBQWhDLEVBQStDLElBQUMsQ0FBQSxXQUFoRDtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsV0FBaEMsRUFBK0MsSUFBQyxDQUFBLFdBQWhEO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxTQUFoQyxFQUErQyxJQUFDLENBQUEsb0JBQWhEO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxZQUFoQyxFQUErQyxJQUFDLENBQUEsb0JBQWhEO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxZQUFoQyxFQUErQyxJQUFDLENBQUEsb0JBQWhEO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxhQUFoQyxFQUErQyxJQUFDLENBQUEsb0JBQWhEO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxFQUErQyxJQUFDLENBQUEsTUFBaEQ7SUFSUzs7eUNBVVgsV0FBQSxHQUFhLFNBQUE7TUFDWCxJQUFDLENBQUEsV0FBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLG1CQUFmLENBQW1DLFdBQW5DLEVBQWtELElBQUMsQ0FBQSxXQUFuRDtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsbUJBQWYsQ0FBbUMsV0FBbkMsRUFBa0QsSUFBQyxDQUFBLFdBQW5EO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxTQUFuQyxFQUFrRCxJQUFDLENBQUEsb0JBQW5EO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxZQUFuQyxFQUFrRCxJQUFDLENBQUEsb0JBQW5EO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxZQUFuQyxFQUFrRCxJQUFDLENBQUEsb0JBQW5EO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxhQUFuQyxFQUFrRCxJQUFDLENBQUEsb0JBQW5EO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxtQkFBZixDQUFtQyxNQUFuQyxFQUFrRCxJQUFDLENBQUEsTUFBbkQ7SUFUVzs7eUNBZWIsV0FBQSxHQUFhLFNBQUMsQ0FBRDtNQUNYLElBQUcsSUFBQyxDQUFBLGFBQUo7UUFDRSxDQUFDLENBQUMsY0FBRixDQUFBO0FBQ0EsZUFBTyxNQUZUOztNQUlBLElBQUcsSUFBQyxDQUFBLG9CQUFELENBQXNCLENBQXRCLENBQUg7UUFDRSxJQUFDLENBQUEsV0FBRCxDQUFBO1FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLDRCQUFELENBQThCLENBQTlCO1FBQ2pCLElBQUMsQ0FBQSxXQUFELEdBQWlCLElBQUMsQ0FBQTtRQUNsQixDQUFDLENBQUMsY0FBRixDQUFBO0FBQ0EsZUFBTyxNQUxUOztJQUxXOzt5Q0FZYixXQUFBLEdBQWEsU0FBQyxDQUFEO01BQ1gsSUFBRyxJQUFDLENBQUEsYUFBSjtRQUNFLENBQUMsQ0FBQyxjQUFGLENBQUE7UUFDQSxJQUFHLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCLENBQUg7VUFDRSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixDQUE5QjtVQUNmLElBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLElBQUMsQ0FBQSxlQUF0QixDQUFWO0FBQUEsbUJBQUE7O1VBQ0EsSUFBQyxDQUFBLHVCQUFELENBQUE7VUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUE7QUFDcEIsaUJBQU8sTUFMVDs7UUFNQSxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsQ0FBZDtpQkFDRSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBREY7U0FSRjs7SUFEVzs7eUNBYWIsb0JBQUEsR0FBc0IsU0FBQyxDQUFEO01BQ3BCLElBQUcsSUFBQyxDQUFBLGFBQUo7UUFDRSxDQUFDLENBQUMsY0FBRixDQUFBO0FBQ0EsZUFBTyxNQUZUOztJQURvQjs7eUNBS3RCLE1BQUEsR0FBUSxTQUFDLENBQUQ7YUFDTixJQUFDLENBQUEsV0FBRCxDQUFBO0lBRE07O3lDQUdSLGFBQUEsR0FBZSxTQUFDLE1BQUQ7TUFDYixJQUFHLElBQUMsQ0FBQSxhQUFELElBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBakIsQ0FBQSxDQUF2QjtRQUNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBakIsQ0FBQTtlQUNBLElBQUMsQ0FBQSx1QkFBRCxDQUFBLEVBRkY7O0lBRGE7O3lDQVNmLFdBQUEsR0FBYSxTQUFBO01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUI7YUFDakIsSUFBQyxDQUFBLFdBQUQsR0FBaUI7SUFGTjs7eUNBSWIsV0FBQSxHQUFhLFNBQUE7O1FBQ1gsSUFBQyxDQUFBLGdCQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCOzs0Q0FDbEIsSUFBQyxDQUFBLGtCQUFELElBQUMsQ0FBQSxrQkFBbUIsSUFBQyxDQUFBLGFBQWEsQ0FBQztJQUZ4Qjs7eUNBS2IsNEJBQUEsR0FBOEIsU0FBQyxDQUFEO0FBQzVCLFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBO01BQ0EsYUFBQSxHQUFtQixJQUFDLENBQUEsZUFBZSxDQUFDLDBCQUFqQixDQUE0QyxDQUE1QztNQUNuQixTQUFBLEdBQW1CLGFBQWEsQ0FBQztNQUNqQyxVQUFBLEdBQW1CLGFBQWEsQ0FBQztNQUNqQyxnQkFBQSxHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQUE7TUFDbkIsR0FBQSxHQUFtQixJQUFJLENBQUMsS0FBTCxDQUFXLFNBQUEsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsQ0FBdkI7TUFDbkIsSUFBK0IsR0FBQSxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBQSxDQUFyQztRQUFBLFVBQUEsR0FBbUIsTUFBbkI7O01BQ0EsR0FBQSxHQUFtQixJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsRUFBYyxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQUEsQ0FBZDtNQUNuQixHQUFBLEdBQW1CLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEdBQVo7TUFDbkIsTUFBQSxHQUFtQixJQUFJLENBQUMsS0FBTCxDQUFZLFVBQUQsR0FBZSxnQkFBMUI7YUFDbkIsSUFBSSxLQUFKLENBQVUsR0FBVixFQUFlLE1BQWY7SUFYNEI7O3lDQWM5QixjQUFBLEdBQWdCLFNBQUMsQ0FBRDthQUNkLENBQUMsQ0FBQyxLQUFGLEtBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQztJQURQOzt5Q0FHaEIsb0JBQUEsR0FBc0IsU0FBQyxDQUFEO01BQ3BCLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFiO2VBQ0UsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBaEIsQ0FBQSxJQUF1QixDQUFFLENBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLEVBRDNCO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQWhCLEVBSEY7O0lBRG9COzt5Q0FNdEIsc0JBQUEsR0FBd0IsU0FBQyxXQUFEO0FBQ3RCLFVBQUE7TUFBQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxXQUFsQztNQUNkLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixXQUE3QjthQUNsQixlQUFlLENBQUM7SUFITTs7eUNBTXhCLHVCQUFBLEdBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLFdBQXZCO1FBQ0UsV0FBQSxHQUFjO1FBQ2QsTUFBQSxHQUFTO0FBRVQsYUFBVyx1SUFBWDtVQUNFLElBQTJCLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixDQUFqRDtZQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixFQUF0Qjs7VUFDQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUQsRUFBTSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQXJCLENBQUQsRUFBK0IsQ0FBQyxHQUFELEVBQU0sSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFuQixDQUEvQjtVQUNSLFFBQUEsR0FBVyxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsS0FBeEI7VUFDWCxJQUFHLFFBQUEsS0FBWSxDQUFmO1lBQ0UsV0FBVyxDQUFDLElBQVosQ0FBaUIsS0FBakIsRUFERjtXQUFBLE1BQUE7WUFHRSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFIRjs7QUFKRjtRQVNBLFdBQUEsR0FBaUIsTUFBTSxDQUFDLE1BQVYsR0FBc0IsTUFBdEIsR0FBa0M7UUFDaEQsSUFBRyxXQUFXLENBQUMsTUFBZjtVQUNFLFVBQUEsR0FBYSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFBQyxDQUFBLGFBQWEsQ0FBQztpQkFDbEQsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxXQUFoQyxFQUE2QztZQUFDLFFBQUEsRUFBVSxVQUFYO1dBQTdDLEVBRkY7U0FkRjs7SUFEdUI7Ozs7O0FBbkg3QiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFN1YmxpbWVTZWxlY3RFZGl0b3JIYW5kbGVyXG4gICAgY29uc3RydWN0b3I6IChlZGl0b3IsIGlucHV0Q2ZnKSAtPlxuICAgICAgQGVkaXRvciA9IGVkaXRvclxuICAgICAgQGlucHV0Q2ZnID0gaW5wdXRDZmdcbiAgICAgIEBfcmVzZXRTdGF0ZSgpXG4gICAgICBAX3NldHVwX3ZhcnMoKVxuXG4gICAgc3Vic2NyaWJlOiAtPlxuICAgICAgQHNlbGVjdGlvbl9vYnNlcnZlciA9IEBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSBAb25SYW5nZUNoYW5nZVxuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgICBAb25Nb3VzZURvd25cbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsICAgQG9uTW91c2VNb3ZlXG4gICAgICBAZWRpdG9yRWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgICAgIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2VsZWF2ZScsICBAb25Nb3VzZUV2ZW50VG9IaWphY2tcbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlZW50ZXInLCAgQG9uTW91c2VFdmVudFRvSGlqYWNrXG4gICAgICBAZWRpdG9yRWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsICAgICAgICBAb25CbHVyXG5cbiAgICB1bnN1YnNjcmliZTogLT5cbiAgICAgIEBfcmVzZXRTdGF0ZSgpXG4gICAgICBAc2VsZWN0aW9uX29ic2VydmVyLmRpc3Bvc2UoKVxuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgICBAb25Nb3VzZURvd25cbiAgICAgIEBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsICAgQG9uTW91c2VNb3ZlXG4gICAgICBAZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdtb3VzZXVwJywgICAgIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2VsZWF2ZScsICBAb25Nb3VzZUV2ZW50VG9IaWphY2tcbiAgICAgIEBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlZW50ZXInLCAgQG9uTW91c2VFdmVudFRvSGlqYWNrXG4gICAgICBAZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnYmx1cicsICAgICAgICBAb25CbHVyXG5cbiAgICAjIC0tLS0tLS1cbiAgICAjIEV2ZW50IEhhbmRsZXJzXG4gICAgIyAtLS0tLS0tXG5cbiAgICBvbk1vdXNlRG93bjogKGUpID0+XG4gICAgICBpZiBAbW91c2VTdGFydFBvc1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGlmIEBfbWFpbk1vdXNlQW5kS2V5RG93bihlKVxuICAgICAgICBAX3Jlc2V0U3RhdGUoKVxuICAgICAgICBAbW91c2VTdGFydFBvcyA9IEBfc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGUpXG4gICAgICAgIEBtb3VzZUVuZFBvcyAgID0gQG1vdXNlU3RhcnRQb3NcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgb25Nb3VzZU1vdmU6IChlKSA9PlxuICAgICAgaWYgQG1vdXNlU3RhcnRQb3NcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIEBfbWFpbk1vdXNlRG93bihlKVxuICAgICAgICAgIEBtb3VzZUVuZFBvcyA9IEBfc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGUpXG4gICAgICAgICAgcmV0dXJuIGlmIEBtb3VzZUVuZFBvcy5pc0VxdWFsIEBtb3VzZUVuZFBvc1ByZXZcbiAgICAgICAgICBAX3NlbGVjdEJveEFyb3VuZEN1cnNvcnMoKVxuICAgICAgICAgIEBtb3VzZUVuZFBvc1ByZXYgPSBAbW91c2VFbmRQb3NcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgZS53aGljaCA9PSAwXG4gICAgICAgICAgQF9yZXNldFN0YXRlKClcblxuICAgICMgSGlqYWNrIGFsbCB0aGUgbW91c2UgZXZlbnRzIHdoaWxlIHNlbGVjdGluZ1xuICAgIG9uTW91c2VFdmVudFRvSGlqYWNrOiAoZSkgPT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgIG9uQmx1cjogKGUpID0+XG4gICAgICBAX3Jlc2V0U3RhdGUoKVxuXG4gICAgb25SYW5nZUNoYW5nZTogKG5ld1ZhbCkgPT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zIGFuZCAhbmV3VmFsLnNlbGVjdGlvbi5pc1NpbmdsZVNjcmVlbkxpbmUoKVxuICAgICAgICBuZXdWYWwuc2VsZWN0aW9uLmRlc3Ryb3koKVxuICAgICAgICBAX3NlbGVjdEJveEFyb3VuZEN1cnNvcnMoKVxuXG4gICAgIyAtLS0tLS0tXG4gICAgIyBNZXRob2RzXG4gICAgIyAtLS0tLS0tXG5cbiAgICBfcmVzZXRTdGF0ZTogLT5cbiAgICAgIEBtb3VzZVN0YXJ0UG9zID0gbnVsbFxuICAgICAgQG1vdXNlRW5kUG9zICAgPSBudWxsXG5cbiAgICBfc2V0dXBfdmFyczogLT5cbiAgICAgIEBlZGl0b3JFbGVtZW50ID89IGF0b20udmlld3MuZ2V0VmlldyBAZWRpdG9yXG4gICAgICBAZWRpdG9yQ29tcG9uZW50ID89IEBlZGl0b3JFbGVtZW50LmNvbXBvbmVudFxuXG4gICAgIyBJIGhhZCB0byBjcmVhdGUgbXkgb3duIHZlcnNpb24gb2YgQGVkaXRvckNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZyb21Nb3VzZUV2ZW50XG4gICAgX3NjcmVlblBvc2l0aW9uRm9yTW91c2VFdmVudDogKGUpIC0+XG4gICAgICBAX3NldHVwX3ZhcnMoKVxuICAgICAgcGl4ZWxQb3NpdGlvbiAgICA9IEBlZGl0b3JDb21wb25lbnQucGl4ZWxQb3NpdGlvbkZvck1vdXNlRXZlbnQoZSlcbiAgICAgIHRhcmdldFRvcCAgICAgICAgPSBwaXhlbFBvc2l0aW9uLnRvcFxuICAgICAgdGFyZ2V0TGVmdCAgICAgICA9IHBpeGVsUG9zaXRpb24ubGVmdFxuICAgICAgZGVmYXVsdENoYXJXaWR0aCA9IEBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gICAgICByb3cgICAgICAgICAgICAgID0gTWF0aC5mbG9vcih0YXJnZXRUb3AgLyBAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpKVxuICAgICAgdGFyZ2V0TGVmdCAgICAgICA9IEluZmluaXR5IGlmIHJvdyA+IEBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpXG4gICAgICByb3cgICAgICAgICAgICAgID0gTWF0aC5taW4ocm93LCBAZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSlcbiAgICAgIHJvdyAgICAgICAgICAgICAgPSBNYXRoLm1heCgwLCByb3cpXG4gICAgICBjb2x1bW4gICAgICAgICAgID0gTWF0aC5yb3VuZCAodGFyZ2V0TGVmdCkgLyBkZWZhdWx0Q2hhcldpZHRoXG4gICAgICBuZXcgUG9pbnQocm93LCBjb2x1bW4pXG5cbiAgICAjIG1ldGhvZHMgZm9yIGNoZWNraW5nIG1vdXNlL2tleSBzdGF0ZSBhZ2FpbnN0IGNvbmZpZ1xuICAgIF9tYWluTW91c2VEb3duOiAoZSkgLT5cbiAgICAgIGUud2hpY2ggaXMgQGlucHV0Q2ZnLm1vdXNlTnVtXG5cbiAgICBfbWFpbk1vdXNlQW5kS2V5RG93bjogKGUpIC0+XG4gICAgICBpZiBAaW5wdXRDZmcuc2VsZWN0S2V5XG4gICAgICAgIEBfbWFpbk1vdXNlRG93bihlKSBhbmQgZVtAaW5wdXRDZmcuc2VsZWN0S2V5XVxuICAgICAgZWxzZVxuICAgICAgICBAX21haW5Nb3VzZURvd24oZSlcblxuICAgIF9udW1DaGFyc0luU2NyZWVuUmFuZ2U6IChzY3JlZW5SYW5nZSkgLT5cbiAgICAgIGJ1ZmZlclJhbmdlID0gQGVkaXRvci5idWZmZXJSYW5nZUZvclNjcmVlblJhbmdlKHNjcmVlblJhbmdlKVxuICAgICAgY29udGVudHNPZlJhbmdlID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShidWZmZXJSYW5nZSlcbiAgICAgIGNvbnRlbnRzT2ZSYW5nZS5sZW5ndGhcblxuICAgICMgRG8gdGhlIGFjdHVhbCBzZWxlY3RpbmdcbiAgICBfc2VsZWN0Qm94QXJvdW5kQ3Vyc29yczogLT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zIGFuZCBAbW91c2VFbmRQb3NcbiAgICAgICAgZW1wdHlSYW5nZXMgPSBbXVxuICAgICAgICByYW5nZXMgPSBbXVxuXG4gICAgICAgIGZvciByb3cgaW4gW0Btb3VzZVN0YXJ0UG9zLnJvdy4uQG1vdXNlRW5kUG9zLnJvd11cbiAgICAgICAgICBAbW91c2VFbmRQb3MuY29sdW1uID0gMCBpZiBAbW91c2VFbmRQb3MuY29sdW1uIDwgMFxuICAgICAgICAgIHJhbmdlID0gW1tyb3csIEBtb3VzZVN0YXJ0UG9zLmNvbHVtbl0sIFtyb3csIEBtb3VzZUVuZFBvcy5jb2x1bW5dXVxuICAgICAgICAgIG51bUNoYXJzID0gQF9udW1DaGFyc0luU2NyZWVuUmFuZ2UocmFuZ2UpXG4gICAgICAgICAgaWYgbnVtQ2hhcnMgPT0gMFxuICAgICAgICAgICAgZW1wdHlSYW5nZXMucHVzaCByYW5nZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJhbmdlcy5wdXNoIHJhbmdlXG5cbiAgICAgICAgZmluYWxSYW5nZXMgPSBpZiByYW5nZXMubGVuZ3RoIHRoZW4gcmFuZ2VzIGVsc2UgZW1wdHlSYW5nZXNcbiAgICAgICAgaWYgZmluYWxSYW5nZXMubGVuZ3RoXG4gICAgICAgICAgaXNSZXZlcnNlZCA9IEBtb3VzZUVuZFBvcy5jb2x1bW4gPCBAbW91c2VTdGFydFBvcy5jb2x1bW5cbiAgICAgICAgICBAZWRpdG9yLnNldFNlbGVjdGVkU2NyZWVuUmFuZ2VzIGZpbmFsUmFuZ2VzLCB7cmV2ZXJzZWQ6IGlzUmV2ZXJzZWR9XG4iXX0=
