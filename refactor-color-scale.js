$(document).ready(function () {
  
  /* ------------------------------------------------------- MODEL*/
  var model = {

    init: function() {
      this.numSteps = 1;
      this.centerColor = '#a4899d';
      this._updateColorScales();
    },

    _updateColorScales: function () {      
      this.darkColor = chroma(this.centerColor).darken().hex();
      this.lightColor = chroma(this.centerColor).brighten().hex();

      this.darkScale = chroma.scale([this.darkColor, this.centerColor]);
      this.lightScale = chroma.scale([this.centerColor, this.lightColor]);

      console.log(this.darkColor);
      console.log(this.centerColor);
      console.log(this.lightColor);

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
      // [.] make $elements
      // [ ] addEventListeners to add,sub,random,colpick,save
      // [x] render self


      this.$centerCell = $('.cell-middle');
      this.$darkContainer = $('.dark-scale');
      this.$lightContainer = $('.light-scale');

      this.$addBtn = $('#add-cell-btn');
      this.$subBtn = $('#sub-cell-btn');

      this.render();


      $('#add-cell-btn').click(function() {
        controller.addCell();
      });

      $('#sub-cell-btn').click(function() {
        controller.subCell();
      });

      $('#random-color').click(function () {
        controller.randomizeColor();
      })


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

    render: function () {
      // [x] color center cell
      // [ ] add appropriate number of cells to left and right
      // [ ] color said cells
      var n = controller.getNumSteps();

      this._addCells(n);
      this._setCellColor(this.$centerCell,controller.getCenterColor());


      // set the cell widths so they all fit in a row
      $('.playground .cell').css('width',(1/((n*2)+1)*100).toString() + '%');

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
      for (var i=n-1; i>0; i++) {
        $jq = this.$lightContainer.children('.cell:nth-child('+(i+1).toString()+')');
        c = lightScale((n-i)/(n)).hex();
        this._setCellColor($jq, c);
      }
    }
  };

  controller.init();
});