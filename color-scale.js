$(document).ready(function() {
  var color = '#21313e';

  function update_scale() {
    var num_cells = $('#test .cell').length;
    console.log(color);
    // adjust colors
    var dark = chroma(color).darken();
    var light = chroma(color).brighten();
    
    // check if the lightness of the end colors requires a 'dark' menu
/*    if (chroma(color).luminance() > 0.7) {
      $('#test #center_color .cell_menu').addClass('dark');
    }
    else {
      $('#test #center_color .cell_menu').removeClass('dark');
    }*/
    
    // adjust widths
    $('#test .cell').css('width',(1/num_cells*100).toString() + '%');
    
    var dark_scale = chroma.scale([dark, color]);
    var light_scale = chroma.scale([color, light]);
    var scale = chroma.scale([dark,light]);
    var $jq,c;
    for (var i=0;i<num_cells;i++) {
      $jq = $('#test .cell:nth-child('+(i+1).toString()+')');
      $jq.css("background", dark_scale(i / (num_cells-1)).hex());
      $jq.children('.cell_code').html(dark_scale(i / (num_cells-1)).hex());
    }
  }
  
  function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function init() {
    update_scale();
  }
  
  init();  

  // add a cell
  $('#add_cell').click(function() {    
    var cell_html = '<div class="cell">';
    cell_html += '<div class="cell_code"></div>';
    cell_html += '</div>';
    $('#test .cell:last').before(cell_html);
    $('#test .cell:first').after(cell_html);
    update_scale();
  });

  // remove a cell
  $('#sub_cell').click(function() {
    if ($('#test .cell').length > 3) {
      $('#test .cell:nth-last-child(2)').remove();
      $('#test .cell:nth-child(2)').remove();
      update_scale();
    }    
  });

  // get output
  $('.output').click(function() {
    var output_txt = '';
    var scale = [];
    var $self = $(this);
    $('#test .cell').each(function() {
      var cell_hex = chroma($(this).css('background-color')).hex();
      scale.push(cell_hex);
    });
    
    // scss
    if ($self.attr('id') == 'out-scss') {
      for (var i=0;i<scale.length;i++) {
        output_txt += '$c'+i.toString()+': '+scale[i]+';';
      }      
    }
    
    // dashed
    if ($self.attr('id') == 'out-dash') {
      for (var i=0;i<scale.length;i++) {
        output_txt += scale[i].slice(1,scale[i].length)+'-';
      }
      output_txt = output_txt.slice(0,output_txt.length - 1);      
    }
    
    // list of strings
    if ($self.attr('id') == 'out-list') {
      for (var i=0;i<scale.length;i++) {
        output_txt += '"'+scale[i]+'",';
      }
      output_txt = output_txt.slice(0,output_txt.length - 1);
    }
    
    $('#scale-output').val(output_txt);
  });
      
  // 'save' a scale
  $('#save_scale').click(function() {
    var $scale = $('#test').clone().removeAttr('id');
    $scale.children('#center_color').children('.cell_menu').remove();
    $('#saved_scales').append($scale);    
  }); 
  
  // randomize colors
  $('#test .cell .randomize').click(function() {
    color = get_random_color();
    update_scale();
  });
  
  // creates a color picker dialog
  $('#test .cell .pick_color').colpick({
    color:color,
    submit: 0,
    colorScheme:'dark',
    onChange:function(hsb,hex,rgb,el,bySetColor) {
      color = '#'+ hex;
      update_scale();  
	  }
  });
  
  
});

