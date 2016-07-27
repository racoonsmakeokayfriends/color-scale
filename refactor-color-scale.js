$(document).ready(function () {
  
  /* ------------------------------------------------------- MODEL*/
  var model = {

    init: function() {
      this.numSteps = 2;
      this.centerColor = '#a4899d';
      this._updateColorScales();
    },

    _updateColorScales: function () {      
      this.darkColor = chroma(this.centerColor).darken().hex();
      this.lightColor = chroma(this.centerColor).brighten().hex();

      this.darkScale = chroma.scale([this.darkColor, this.centerColor]);
      this.lightScale = chroma.scale([this.lightColor, this.centerColor]);

    },

    getDarkScale: function () {
      return this.darkScale;
    },
    
    getLightScale: function () {
      return this.lightScale;
    },

    getCenterColor: function () {
      return this.centerColor;
    },

    getNumSteps: function () {
      return this.numSteps;
    },




    setCenterColor: function(c) {
      this.centerColor = c;
      this._updateColorScales();
    },

    randomizeCenterColor: function () {      
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      this.centerColor = color;
      this._updateColorScales();
    },

    addStep: function () {
      this.numSteps += 1;
    },

    subStep: function () {
      if (this.numSteps > 1) {
        this.numSteps -= 1;
      }
      else {
        this.numSteps = 1;
      }
    }

  };



  /* -------------------------------------------------- CONTROLLER*/
  var controller = {
    init: function () {
      model.init();
      view.init();
    },

    getCenterColor: function () {
      return model.getCenterColor();
    },

    getNumSteps: function () {
      return model.getNumSteps();
    },

    getDarkScale: function () {
      return model.getDarkScale();
    },

    getLightScale: function () {
      return model.getLightScale();
    },

    randomizeColor: function() {
      model.randomizeCenterColor();
      view.render();
    },

    setCenterColor: function (color) {
      model.setCenterColor(color);
      view.render();
    },
    subCell: function () {
      model.subStep();
      view.render();
    },
    addCell: function () {
      model.addStep();
      view.render();
    }
  };




  /* -------------------------------------------------------- VIEW*/
  var view = {
    init: function () {
      this.$centerCell = $('.cell-middle');
      this.$darkContainer = $('.dark-scale');
      this.$lightContainer = $('.light-scale');

      this.render();


      $('#add-cell-btn').click(function() {
        controller.addCell();
      });

      $('#sub-cell-btn').click(function() {
        controller.subCell();
      });

      $('#random-color').click(function () {
        controller.randomizeColor();
      });

      $('#save-scale-btn').click(function () {
        // put oopy in saved list
        var $sc = $('#playground-scale-container').clone();
        $sc.children('.cell-middle').children('.cell-menu').remove();
        var saveHtml = '</li class="saved-scale">' + $sc.html() + '</li>'
        $('#saved-scales').append(saveHtml);
      });

      $('#clear-saved-btn').click(function() {
        $('#saved-scales').html('');
      })

      // set color-picker dialog
      $('.cell-middle #picked-color').colpick({
        color:controller.getCenterColor(),
        submit: 0,
        colorScheme:'dark',
        onChange:function(hsb,hex,rgb,el,bySetColor) {
          color = '#'+ hex;
          controller.setCenterColor(color);  
        }
      });


    },

    _setCellColor: function ($ele, color) {
      $ele.css('background-color', color);
      $ele.children('.color-code').html(color);
    },

    _addCells: function (num) {
      // [ ] add cells to the right and left
      var html_str = '';
      for(var i=0;i<num;i++) {
        html_str += '<div class="cell">';
        html_str += '<div class="color-code"></div>';
        html_str += '</div>';
      }

      this.$darkContainer.html(html_str);
      this.$lightContainer.html(html_str);
    },

    _fill_scales: function (n) {
      // color the newly created cells in dark
      var darkScale = controller.getDarkScale();
      var c;
      for (var i=0; i<n; i++) {
        $jq = this.$darkContainer.children('.cell:nth-child('+(i+1).toString()+')');
        c = darkScale(i/n).hex();
        this._setCellColor($jq, c);
      }


      // color the newly created cells in light
      var lightScale = controller.getLightScale();
      var c;
      for (var i=0; i<n; i++) {
        $jq = this.$lightContainer.children('.cell:nth-child('+(n-i).toString()+')');
        c = lightScale(i/n).hex();
        this._setCellColor($jq, c);
      }
    },

    render: function () {
      var n = controller.getNumSteps();

      this._addCells(n);
      this._setCellColor(this.$centerCell,controller.getCenterColor());


      // set the cell widths so they all fit in a row
      $('.playground .cell').css('width',(1/((n*2)+1)*100).toString() + '%');
      this._fill_scales(n);

    }
  };

  controller.init();
});