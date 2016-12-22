/**
 * Created by tangxl on 16-12-20.
 */
var canvasMap = function() {
  var self = this;
  self.init = function(canvas_ele) {
    if (canvas_ele === null) {
      return false;
    }
    self.ele = $(canvas_ele);
    var $parent = self.ele.parent();
    var eleW = $parent.width();
    var eleH = $parent.height();
    self.ele.attr({
      width: eleW,
      height: eleH
    });
    self.context = canvas_ele.getContext('2d');
  };
  self.horizontal_line = function(option) {
    this.default_option = {
      strokeStyle:'#000',
      lineWidth: 1,
      lineCap: 'square',
      data:[]
    };
    this.new_option = $.extend({}, this.default_option, option);
    self.context.strokeStyle= this.new_option.strokeStyle;
    self.context.lineWidth= this.new_option.lineWidth;
    self.context.lineCap= this.new_option.lineCap;
    _.each(this.new_option.data, function(point_data) {
      self.context.beginPath();
      self.context.moveTo(point_data.start.x, point_data.start.y);
      self.context.lineTo(point_data.end.x, point_data.end.y);
      self.context.stroke();
      self.context.closePath();
    });
  }
};


