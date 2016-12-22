/**
 * Created by tangxl on 16-12-6.
 */
var index = {
  ready_init:function() {
    var self = this;
    var $manage_money_radius = $('#manage-money-radius');
/*    var $manage_money_tpl = $.trim(self.manage_money_tpl());
    $manage_money_radius.html($manage_money_tpl);*/
/*    self.img_rotate();
    self.icon_box();
    index.init_ajax('china');
    $('.progress-visit').css('display', 'none');
    self.small_bg();*/
/*    self.map_bg();*/
  },

  small_bg: function() {
    var self = this;
    var option_data = {
      lineWidth: 0.5,
      lineCap: 'butt',
      strokeStyle:'rgba(63,63,63,0.2)',
      data:[]
    };
    var space = 20;
    var $small_bg = $('#small-bg');
    var $right_content = $('.right-content');
    var width = $small_bg.parent().width() - 2 * space;
    var height = $small_bg.parent().height();
    var horizontal_num = Math.ceil(width / space);
    var more_left = width - Math.floor(width / space) * 20;
    var more_bottom = height - Math.floor(height / space) * 20;
    var right_width = Math.floor(horizontal_num*2/3) * space;
    var left_width = width - right_width;
    $('.map-content').css({
      right: left_width + 'px'
    });
    $right_content.css({
      left: right_width + 'px'
    });
    $('.body-content').css({
      'margin-right': space + more_left + 'px',
      'margin-bottom': space + more_bottom + 'px'
    });
    $('.content').css({
      'padding-right': space + more_left + 'px',
      'padding-bottom': space + more_bottom + 'px'
    });
    var right_content_height = $right_content.height();
    var right_content_num = Math.ceil(right_content_height / space);
    var right_top = Math.floor(right_content_num*2/3) * space;
    var right_bottom = right_content_height - right_top;
    $('.meter-box').css({
      bottom: right_top + 'px'
    });
    $('.manage-box').css({
      top: right_bottom + 'px'
    });
    self.canvas_line(option_data, 'small-bg', space);
  },

  map_bg: function() {
    var self = this;
    var option_data = {
      lineWidth: 0.5,
      lineCap: 'butt',
      strokeStyle:'#192e34',
      data:[]
    };
    var height_meter = parseInt($('.manage-box').css('top'));
    self.canvas_line(option_data, 'map-bg', height_meter, true);
  },

  canvas_line: function(option_data, ele_id, space, border) {
    var canvas_ele = new canvasMap();
    var horizontal_option = $.extend({}, option_data);
    var vertical_option = $.extend({}, option_data);
    var $parent = $('#' + ele_id).parent();
    var width = $parent.width();
    var height = $parent.height();
    var horizontal_num = Math.ceil(width / space);
    var vertical_num = Math.ceil(height / space);
    _(vertical_num).times(function(n) {
      if (border) {
        if (space*n <  height && n === vertical_num-1) {
          horizontal_option.data.push({
            start:{x:0, y:height},
            end:{x:width, y:height}
          });
        }
        n -= 1;
      }
      horizontal_option.data.push({
        start:{x:0, y:(n+1)*space},
        end:{x:width, y:(n+1)*space}
      });

    });
    _(horizontal_num).times(function(n) {
      if (border) {
        if (space*n <  width && n === horizontal_num-1) {
          var last_space = width - space*n;
          vertical_option.data.push({
            start:{x:width, y:0},
            end:{x:width, y:height}
          });
        }
        n -= 1;
      }
      vertical_option.data.push({
        start:{x:(n+1)*space, y:0},
        end:{x:(n+1)*space, y:height}
      });
    });
    canvas_ele.init(document.getElementById(ele_id));
    canvas_ele.horizontal_line(horizontal_option);
    canvas_ele.horizontal_line(vertical_option);
  },

  icon_box: function() {
    $('.icon-box').each(function() {
      var $ele = $(this);
      var height = $ele.outerHeight();
      $ele.css('width', height + 'px');
    });
  },

  select_con_text: function($obj) {
    var self =this;
    var id = $obj.attr('id');
    var text = $obj.text().replace('：', '');
    var reg_id = Number(id.replace(/\w+_/, ''));
    var map_text;
    var $header_title = $('.header-title');
    var $total_hospital_num = $('.total-hospital-num');
    var $manage_money_radius = $('#manage-money-radius');
    var $body = $('body');
    $body.find('.hospital-alert').remove();
    $obj.closest('.map-select-content').find('.select-con-text').removeClass('active');
    $obj.addClass('active');
    $('.map-select-text').text(text).data('id', id);
     if(id === 'china') {
       map_text = 'china';
       var $manage_money_tpl = self.manage_money_tpl();
       $manage_money_radius.html($manage_money_tpl);
       $('.progress-visit').css('display', 'none');
    }
    else {
       $('.progress-visit').css('display', 'block');
       if(!isNaN(reg_id)) {
         _.each(GVR.JSON.provinceArray, function(province, key) {
           if (province === text) {
             map_text = 'province_' + GVR.JSON.provinceJson[key];
             return false;
           }

         });
       }
       else {
         map_text = id + '.geo';
       }
       var $manage_status_tpl = self.manage_status_tpl();
       $manage_money_radius.html($manage_status_tpl);
    }
    index.init_ajax(map_text);
    $header_title.text(text + '进度总览');
    $total_hospital_num.text(text + '医院总数');
  },

  img_rotate: function() {
    var scale = 284/168;
    var arrow_scale = 163/26;
    var arrow_sector_scale = 284 / 200;
    var $parent_ele = $('.meter-img');
    var box_height = $parent_ele.height();
    var box_width = $parent_ele.width();
    var $meter_arrow = $('.meter-arrow');
    var $half_rect_1 = $('.half-rect-1');
    $('.img-rotate').each(function(index, dom) {
      var $ele = $(dom);
      var width = $ele.width();
      var height;
      var left;
      if (width > box_height) {
        width = box_height;
        left = (box_width - 2 * width) / 2;
      }
      else {
        width = box_width * 0.45;
        left = '5%';
      }
      height = width / scale;
      $ele.css({'width': width + 'px', 'height':height+ 'px', left: left});
      if (index === 0 ){
        var arrow_width = width / arrow_sector_scale;
        var arrow_height = arrow_width / arrow_scale;
        var arrow_left = (box_width - 2 * arrow_width) / 2;
        $meter_arrow.css({'width': arrow_width + 'px', 'height':arrow_height+ 'px', left: (arrow_left-5)+ 'px'});
        var rect_width_1 = width*2/3 ;
        var react_left_1 = (box_width -  rect_width_1) / 2;
        $half_rect_1.css(
          {
            height: (rect_width_1/2) + 'px',
            width: rect_width_1 + 'px',
            left: react_left_1 + 'px',
            'border-radius': (rect_width_1/2) + 'px ' + (rect_width_1/2) + 'px ' + '0 0'
          });
        $('.half-react').each(function (index, dom) {
          if (index > 0) {
            var width_half = rect_width_1*0.85;
            var width_half_1 = width_half*0.8;
            var width_half_left = (rect_width_1 -  width_half) / 2;
            var half_left_1 = (width_half -  width_half_1) / 2;
            if( index === 1 ) {
              $(dom).css(
                {
                  height: (width_half/2) + 'px',
                  width: width_half + 'px',
                  left: width_half_left + 'px',
                  'border-radius': (width_half/2) + 'px ' + (width_half/2) + 'px ' + '0 0'
                });
            }
            else if( index === 2 ) {
              $(dom).css(
                {
                  'line-height': (width_half_1/2 + 8) + 'px',
                  height: (width_half_1/2) + 'px',
                  width: width_half_1 + 'px',
                  left: half_left_1 + 'px',
                  'border-radius': (width_half_1/2) + 'px ' + (width_half_1/2) + 'px ' + '0 0'
                });
            }
          }
        })
      }
    })
  },

  init_ajax: function(area) {
    var self = this;
    var hospital_num = {};
    var manage_money = 0;
    var manage_num = 0;
    var province_path = /province_/.test(area);
    var china_path = /china/.test(area);
    var province_replace = area.replace(/province_/, '');
    var hospital_classify = {
      palaver:[],
      purpose:[],
      arrange:[],
      train:[],
      use:[]
    };
    var status_data = {
      palaver:{
        name: '洽谈中',
        data:[],
        point:[],
        color:'#f1635e'
      },
      purpose:{
        name: '确定意向',
        data:[],
        point:[],
        color:'#ffc528'
      },
      arrange:{
        name: '部署中',
        data:[],
        point:[],
        color:'#6bd8ea'
      },
      train:{
        name: '培训中',
        data:[],
        point:[],
        color:'#00d991'
      },
      use:{
        name: '使用中',
        data:[],
        point:[],
        color:'#939fdf'
      }
    };
    var data_ajax = {
      lend_data: ['洽谈中', '确定意向', '部署中', '培训中', '使用中'],
      lend_selected: {
        '洽谈中':false,
        '确定意向':false,
        '部署中': false,
        '培训中': false,
        '使用中':true
      },
      max:0,
      series:[]
    };
    var $init_url = $('#init-url');
    var url = '<%=base%>' + $init_url.attr('url');
    COMMON_FUNC.ajax_get($init_url, {}, url, function(data) {
      var last_hospitals_name;
      _.each(data, function(hospital, index) {
        if (province_path) {
          var province_text = hospital.province.replace(/[\u5e02|\u7701]/,'');
          var province_array_text;
          _.each(GVR.JSON.provinceJson, function(provinceJson, province_index) {
            if (province_replace === provinceJson) {
              province_array_text = GVR.JSON.provinceArray[province_index];
            }
          });
          if (province_text !== province_array_text) {
            return true;
          }
        }
        else if (china_path) {
          if (hospital.total_price) {
            manage_money += parseInt(hospital.total_price);
          }
        }
        else {
          var area_replace = area.replace('.geo', '');
          if (hospital.district !== GVR.JSON.area_json[area_replace][0] + '区') {
            return true;
          }
        }
        manage_num += hospital.total_num;
        var random = parseInt(Math.random()*10);
        while (random > 4 ) {
          random = parseInt(Math.random()*10);
        }
        var status = data_ajax.lend_data[random];
        var hospital_json = {
          district: hospital.district,
          province: hospital.province,
          status:status
        };
        var point_json = {
          name: hospital.hospitals_name,
          coord: [hospital.lon, hospital.lat],
          value: hospital.hospitals_id
        };
        switch (hospital_json.status) {
          case '洽谈中':
            hospital_classify.palaver.push(hospital_json);
            status_data.palaver.point.push(point_json);
            break;
          case '确定意向':
            hospital_classify.purpose.push(hospital_json);
            status_data.purpose.point.push(point_json);
            break;
          case '部署中':
            hospital_classify.arrange.push(hospital_json);
            status_data.arrange.point.push(point_json);
            break;
          case '培训中':
            hospital_classify.train.push(hospital_json);
            status_data.train.point.push(point_json);
            break;
          case '使用中':
            hospital_classify.use.push(hospital_json);
            status_data.use.point.push(point_json);
            break;
          default:
            break;
        }
      });
      hospital_num = {
        palaver_num: hospital_classify.palaver.length,
        purpose_num: hospital_classify.purpose.length,
        arrange_num: hospital_classify.arrange.length,
        train_num: hospital_classify.train.length,
        use_num: hospital_classify.use.length
      };
      GVR.JSON.hospital_num = hospital_num;
      if (china_path) {
        _.each(hospital_classify,function(classify, classify_key) {
          var area_num = {
            db: 0,
            hb: 0,
            hd: 0,
            hn: 0,
            hz: 0,
            xb: 0,
            xn: 0
          };
          _.each(classify, function(hospital, hospital_key) {
            _.each(GVR.JSON.area_json, function(areaJson, area_key) {
              if (hospital.district === areaJson[0] + '区' ) {
                area_num[area_key] = area_num[area_key] + 1;
                if(data_ajax.max < area_num[area_key]) {
                  data_ajax.max = area_num[area_key];
                }
              }
            });
          });
          status_data[classify_key].data.push(area_num);
        });
        data_ajax.series = status_data;
        COMMON_FUNC.animate_num($('#money-text'), 0, manage_money);
      }
      else if (province_path) {
        data_ajax.series = status_data;
      }
      else {
        _.each(hospital_classify,function(classify, classify_key) {
          var province_num = {};
          _.each(classify, function(hospital, hospital_key) {
            _.each(GVR.JSON.provinceArray, function(provinceJson, province_key) {

              var province_reg = hospital.province.replace(/[\u5e02|\u7701]/,'');
              if (province_reg === provinceJson) {
                if (province_num[provinceJson]) {
                  province_num[provinceJson] = province_num[provinceJson] + 1;
                }
                else {
                  province_num[provinceJson] = 1;
                }
                if(province_num[provinceJson]) {
                  if(data_ajax.max < province_num[provinceJson]) {
                    data_ajax.max = province_num[provinceJson];
                  }
                }
              }
            });
          });

          status_data[classify_key].data.push(province_num);
        });
        data_ajax.series = status_data;
      }
      COMMON_FUNC.animate_num($('#amount-text'), 0, manage_num);
      ECHARTS_FUNC.area_total_map('area-total-map', area, data_ajax);
      $('.img-rotate:last').click();
      var clientWidth = document.body.clientWidth;
      if (clientWidth > 1920) {
        var rotate_length = $('.img-rotate').length;
        var length_eq = 0;
        var set_rotate = setInterval(function() {
          if (length_eq === rotate_length - 1) {
            clearInterval(set_rotate);
            self.init_ajax(area);
          }
          $('.img-rotate:eq('+ length_eq +')').click();
          length_eq ++;
        }, 60*1000);
      }
    })
  }
};

$(function(){
  index.ready_init();
  $(window).resize(function() {
    var area_echarts = GVR.ECHARTS.AREA_MAP;
    index.img_rotate();
    index.icon_box();
    index.small_bg();
/*    index.map_bg();*/
    if (area_echarts) {
      area_echarts.resize();
    }
  });
}).on('click', '.select-con-text', function() {
  index.select_con_text ($(this));
})
;