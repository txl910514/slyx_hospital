/**
 * Created by tangxl on 16-12-6.
 */
var index = {
  message_line_tpl: _.template($('#message_line_tpl').html()),
  medical_tpl: _.template($('#medical_tpl').html()),
  no_bx_tpl: _.template($('#no-bx-tpl').html()),
  ready_init:function() {
    var self = this;
    var $init_url = $('#form_data');
    self.highValue_ajax();
    self.dpt_ajax();
    self.info_ajax();
    setInterval(function() {
      self.highValue_ajax();
      self.dpt_ajax();
      self.info_ajax();
    }, 60*60*1000);
  },

  highValue_ajax: function() {
    var self = this;
    var $highValue = $('#highValue');
    var url = '<%=base%>' + $highValue.attr('url');
    var jsonp_name = $highValue.attr('jsonp-callback');
    COMMON_FUNC.ajax_get($highValue, {}, url, jsonp_name, function(result) {
      self.device_num_total($('#total-device-num'), result.eqpCount[0].total_count);
      self.device_num_total($('#using-count'), result.eqpCount[0].using_count);
      self.device_num_total($('#fix-count'), result.eqpCount[1].finish_count);
      $('#header-title').text(result.eqpCount[1].hospitals_name);
      document.title = result.eqpCount[1].hospitals_name;
      var data = {
        y:[],
        x1:[],
        name1: '设备总数',
        x2:[],
        name2: '可用设备',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'台'
      };
      var life_data = {
        y:[],
        x1:[],
        name1: '设备总数',
        x2:[],
        name2: '可用设备',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'台'
      };
      var highValue_sort = _.sortBy(result.highValue, 'using_count');
      _.each(highValue_sort, function(high_Value) {
        var perent = (high_Value.using_count / high_Value.total_num) * 100;
        perent = high_Value.total_num ? parseInt(perent) : 0;
        high_Value.standard_categories_name = high_Value.total_num ? high_Value.standard_categories_name : '';
        if (high_Value.standard_categories_name.length > 6) {
          high_Value.standard_categories_name = high_Value.standard_categories_name.slice(0,6);
        }
        data.y.push(high_Value.standard_categories_name);
        data.x1.push(high_Value.total_num);
        data.x2.push(high_Value.using_count);
        data.x3.push(perent);
      });
      var lifeSupport_sort = _.sortBy(result.lifeSupport, 'use_count');
      _.each(lifeSupport_sort, function(lifeSupport) {
        lifeSupport.category = lifeSupport.total_count ? lifeSupport.category : '';
        if (lifeSupport.category.length > 6) {
          lifeSupport.category = lifeSupport.category.slice(0,6);
        }
        life_data.y.push(lifeSupport.category);
        life_data.x1.push(lifeSupport.total_count);
        life_data.x2.push(lifeSupport.use_count);
        life_data.x3.push(lifeSupport.percent* 100);
      });
      var life_min = _.min(life_data.x3);
      var high_min = _.min(data.x3);
      var life_max = _.max(life_data.x1);
      var high_max = _.max(data.x1);
      var min_color = '#9fa0a0';
      var dot_color = '#71c8d9';
      var add = 0;
      _.each(life_data.x3, function(value, index) {
        if(value === life_min && value !== 100) {
          min_color = '#f39800';
          dot_color = '#f39800';
          if (!life_data.x1[index]) {
            dot_color = 'transparent';
          }
        }
        else {
          min_color = '#9fa0a0';
          dot_color = '#71c8d9'
        }
        add = life_max < 25 ? 0.5: 5;
        life_data.label.push({
          value: life_data.x1[index] + add ,
          label: {
            normal: {
              show: true,
              textStyle: {
                color:min_color
              }
            }
          },
          itemStyle: {
            normal: {
              color:dot_color
            }
          }
        });
      });
      _.each(data.x3, function(value, index) {
        if(value === high_min && value !== 100) {
          min_color = '#f39800';
          dot_color = '#f39800';
          if (!data.x1[index]) {
            dot_color = 'transparent';
          }
        }
        else {
          min_color = '#9fa0a0';
          dot_color = '#71c8d9'
        }
        add = high_max < 25 ? 0.5: 5;
        data.label.push({
          value: data.x1[index] + add,
          label: {
            normal: {
              show: true,
              textStyle: {
                color:min_color
              }
            }
          },
          itemStyle: {
            normal: {
              color:dot_color
            }
          }
        });
      });
      ECHARTS_FUNC.horizontal_bar_echarts('high-value-echarts', data);
      ECHARTS_FUNC.horizontal_bar_echarts('life-echarts', life_data);
    })
  },

  info_ajax: function() {
    var self = this;
    var $update_info = $('#update-info').html('');
    var $overdue_info = $('#overdue_info').html('');
    var url = '<%=base%>' + $update_info.attr('url');
    var update_line_height = $update_info.height() / 6 - 2;
    var overdue_line_height = $overdue_info.height() / 4 - 2;
    var body_width  = $(window).width();
    var screen_height = window.screen.height;
    //if (body_width <= 1366) {
    //  update_line_height = $update_info.height() / 3 - 2;
    //  overdue_line_height = $overdue_info.height() / 2 - 2;
    //}
    if (screen_height >= 1200) {
      update_line_height = $update_info.height() / 7 - 2;
      overdue_line_height = $overdue_info.height() / 5 - 2;
    }
    else if (screen_height >= 1024) {
      update_line_height = $update_info.height() / 6 - 2;
      overdue_line_height = $overdue_info.height() / 4 - 2;
    }
    else if (screen_height >= 864) {
      update_line_height = $update_info.height() / 5 - 2;
      overdue_line_height = $overdue_info.height() / 3 - 2;
    }
    else if (screen_height >= 768) {
      update_line_height = $update_info.height() / 4 - 2;
      overdue_line_height = $overdue_info.height() / 2 - 2;
    }
    else if (screen_height >= 600) {
      update_line_height = $update_info.height() / 3 - 2;
      overdue_line_height = $overdue_info.height() / 1 - 2;
    }
    clearInterval(GVR.INTERVAL.message_setInterval);
    var jsonp_name = $update_info.attr('jsonp-callback');
    COMMON_FUNC.ajax_get($update_info, {}, url, jsonp_name, function(result) {
      var month_check_data = {
        x: [],
        y:[],
        unit:'次',
        name: '月质控统计'
      };
      var fix_pct_data = {
        status: 'line',
        x: [],
        y1:[],
        y2:[],
        legend_data: ['当月报修', '当月完修'],
        unit: '次'
      };
      _.each(result.month_check, function(check) {
        month_check_data.x.unshift(check.month + '月');
        month_check_data.y.unshift(check.count);
      });
      _.each(result.fix_pct, function(fix_pct_line) {
        fix_pct_data.x.unshift(fix_pct_line.mon + '月');
        fix_pct_data.y1.unshift(fix_pct_line.report_num);
        fix_pct_data.y2.unshift(fix_pct_line.fix_num);
      });
      ECHARTS_FUNC.accumulate_echarts('inspection-echarts', month_check_data);
      ECHARTS_FUNC.bar_status('hitch-echarts', fix_pct_data);
      _.each(result.update_info, function(update) {
        update.categories_name = update.categories_name || '-';
        update.users_name = update.users_name || '-';
        switch (update.status) {
          case 1:
            update.status_name = '报修';
            update.status_color = 'repair_color';
            break;
          case 2:
            update.status_name = '在修';
            update.status_color = 'receive_color';
            break;
          case 3:
            update.status_name = '待确认';
            update.status_color = 'receive_color';
            break;
          case 4:
            update.status_name = '已结束';
            update.status_color = 'finish_color';
            break;
          case 5:
            update.status_name = '误报已结束';
            update.status_color = 'finish_color';
            break;
          case 7:
            update.status_name = '已留观';
            update.status_color = 'receive_color';
            break;
          case 8:
            update.status_name = '外修开始';
            update.status_color = 'receive_color';
            break;
          case 9:
            update.status_name = '外修结束';
            update.status_color = 'finish_color';
            break;
          default :
            update.status_name = '-';
            update.status_color = '';
            break;
        }
        var update_replace = self.message_line_tpl(update).replace(/\r/g,'').replace(/\n/g,'');
        var $update_tpl = $($.trim(update_replace));
        $update_tpl.css({
          height: update_line_height + 'px',
          'line-height': update_line_height + 'px'
        });
        $update_info.append($update_tpl);
      });
      _.each(result.overdue_info, function(overdue) {
        overdue.users_name = overdue.users_name || '-';
        overdue.over_due_time = overdue.over_due_time || '-';
        var $overdue_tpl = $($.trim(self.message_line_tpl(overdue)));
        $overdue_tpl.css({
          height: overdue_line_height + 'px',
          'line-height': overdue_line_height + 'px'
        });
        $overdue_info.append($overdue_tpl);
      });

      GVR.INTERVAL.message_setInterval = setInterval(function() {
        var $update_line = $update_info.find('.message-line');
        var $overdue_line = $overdue_info.find('.message-line');
        var $update_first = $update_line.first();
        var $overdue_first = $overdue_line.first();
        $update_line.animate({
          top: - update_line_height + 'px'
        }, 5*1000, function(a,b,c){
          $update_info.append($update_first);
          $update_line.css({top: '0px'});
        });
        $overdue_line.animate({
          top: - overdue_line_height + 'px'
        }, 5*1000, function(){
          $overdue_info.append($overdue_first);
          $overdue_line.css({top: '0px'});
        })
      }, 30*1000);
    })
  },

  dpt_ajax: function() {
    var self = this;
    var $offices_use = $('#offices-use').html('');
    var url = '<%=base%>' + $offices_use.attr('url');
    var total_dptfix = 0, other_dptfix = 0, dptfix_num = 0, interval_num = 0;
    var $medical_info_box = $('#medical_info_box').html('');
    var $medical_info_hidden = $('#medical_info_box:hidden').length;
    if ($medical_info_hidden) {
      $medical_info_box = $('#min_info_box').html('');
    }
    console.log($medical_info_hidden);
    clearInterval(GVR.INTERVAL.info_setInterval);
    var jsonp_name = $offices_use.attr('jsonp-callback');
    COMMON_FUNC.ajax_get($offices_use, {}, url, jsonp_name, function(result) {
      var dptuse_data = {
        y:[],
        x1:[],
        name1: '总比例',
        x2:[],
        name2: '可用比例',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'',
        status:'dptuse'
      };
      var dptfix_data = {
        name:'科室报修占比',
        data:[],
        series_data:[]
      };
      if (result.dptuse_pct.length < 5) {
        var lack_length = 5 -  result.dptuse_pct.length;
        _(lack_length).times(function(n){
          result.dptuse_pct.push({
            departments_name: '',
            use_percent: 0
          });
        });
      }
      var dptusePct_sort = _.sortBy(result.dptuse_pct, 'departments_name');
      _.each(dptusePct_sort, function(dptuse_pct) {
        if (dptuse_pct.departments_name.length > 6) {
          dptuse_pct.departments_name = dptuse_pct.departments_name.slice(0,6);
        }
        dptuse_data.y.push(dptuse_pct.departments_name);
        dptuse_data.x2.push(parseInt(dptuse_pct.use_percent*100));
      });
      var dptuse_min = _.min(dptuse_data.x2);
      var dptuse_color = '#9fa0a0';
      var x1_value = 100;
      _.each(dptuse_data.x2, function(value, index) {
        if(value === dptuse_min && value !== 100) {
          dptuse_color = '#f39800';
        }
        else {
          dptuse_color = '#9fa0a0';
        }
        if(!dptuse_data.y[index]) {
          dptuse_color = 'transparent';
          x1_value = 0;
        }
        else {
          x1_value = 100;
        }
        dptuse_data.x1.push({
          value: x1_value,
          label: {
            normal: {
              show: true,
              textStyle: {
                color:dptuse_color
              }
            }
          }
        });
      });
/*      _.each(result.dptfix_pct, function(dptfix_pct, index) {
        dptfix_num += dptfix_pct.fix_count;
        dptfix_data.data.push({
          name: dptfix_pct.departments_name,
          icon: 'roundRect'
        });
        dptfix_data.series_data.push({
          value:dptfix_pct.fix_count, name:dptfix_pct.departments_name
        });
        if (result.dptfix_pct.length - 1 === index ) {
          total_dptfix = parseInt(dptfix_pct.fix_count / dptfix_pct.percent);
          dptfix_data.series_data.push({
            value:total_dptfix - dptfix_num, name: '其他科室'
          });
          dptfix_data.data.push({
            name: '其他科室',
            icon: 'roundRect'
          });
        }
      });*/
      _.each(result.me_info[0], function(me_info_first, index) {
        if (me_info_first.fix_avg < 0 || me_info_first.resp_avg < 0) {
          var url = '<%=base%>' + '/err/insert';
          var error = me_info_first.users_name + ',' + me_info_first.resp_avg + ',' + me_info_first.fix_avg;
          var data = {
            error: error
          };
          COMMON_FUNC.ajax_get($('body'), data, url, 'err_insert', function(result) {

          });
        }
        me_info_first.id_index = index;
        me_info_first.last_name = me_info_first.users_name[me_info_first.users_name.length-1];
        var $medical_tpl = $(self.medical_tpl(me_info_first));
        $medical_info_box.append($medical_tpl);
        var hos_total_fix_count = result.me_info[1][0].hos_total_fix_count;
        var degree_percent = me_info_first.total_fix_count / hos_total_fix_count;
        var hos_resp_avg = result.me_info[1][0].hos_resp_avg;
        var resp_avg = me_info_first.resp_avg < 0 ? 0 : me_info_first.resp_avg;
        var answer_percent = resp_avg / (hos_resp_avg*2);
        var hos_fix_avg = result.me_info[1][0].hos_fix_avg;
        var fix_avg = me_info_first.fix_avg < 0 ? 0 : me_info_first.fix_avg;
        var servicing_percent = fix_avg / (hos_resp_avg*2);
        hos_resp_avg = parseFloat(hos_resp_avg.toFixed(2));
        hos_fix_avg = parseFloat(hos_fix_avg.toFixed(2));
        var degree_data = {
          status_name: hos_total_fix_count + '次',
          name: '总维修次数',
          percent: degree_percent,
          num: me_info_first.total_fix_count,
          two_percent: 'transparent',
          unit: '次'
        };
        var answer_data = {
          status_name: '平均 '+ hos_resp_avg + 'h',
          name: '平均响应时长',
          percent: answer_percent < 1 ? answer_percent: 1,
          num:parseFloat(resp_avg.toFixed(2)),
          two_percent: 0.5,
          unit: 'h'
        };
        var servicing_data = {
          status_name: '平均' + hos_fix_avg + 'h',
          name: '平均维修时长',
          percent: servicing_percent < 1 ? servicing_percent: 1,
          num:parseFloat(fix_avg.toFixed(2)),
          two_percent: 0.5,
          unit: 'h'
        };
        ECHARTS_FUNC.status_pie('total-degree'+index, degree_data);
        ECHARTS_FUNC.status_pie('mean-answer'+index, answer_data);
        ECHARTS_FUNC.status_pie('mean-servicing'+index, servicing_data);
      });
      var status_total = result.status_pct[0].overdue_count + result.status_pct[0].wait_count +
        result.status_pct[0].get_count;
      var wait_percent = parseInt(result.status_pct[0].wait_count/ status_total *100);
      var get_percent = parseInt(result.status_pct[0].get_count/ status_total *100);
      var overdue_percent = parseInt(result.status_pct[0].overdue_count/ status_total *100);
      var wait_data = {
        status_name: '等待',
        name: '',
        percent: wait_percent / 100,
        num: result.status_pct[0].wait_count,
        unit: '次'
      };
      var get_data = {
        status_name: '在修',
        name: '',
        percent: get_percent / 100,
        num: result.status_pct[0].get_count,
        unit: '次'
      };
      var overdue_data = {
        status_name: '超时',
        name: '',
        percent: overdue_percent / 100,
        num: result.status_pct[0].overdue_count,
        unit: '次'
      };
      ECHARTS_FUNC.status_pie('wait-status', wait_data);
      ECHARTS_FUNC.status_pie('repair-status', get_data);
      ECHARTS_FUNC.status_pie('overtime-status', overdue_data);
      ECHARTS_FUNC.horizontal_bar_echarts('offices-use', dptuse_data);
/*      if (result.dptfix_pct.length) {
        $('#offices-repair').html('');
        ECHARTS_FUNC.pie_echarts('offices-repair', dptfix_data);
      }
      else {
        var no_bx_tpl = self.no_bx_tpl();
        $('#offices-repair').html(no_bx_tpl);
      }*/
      GVR.INTERVAL.info_setInterval = setInterval(function() {
        var $medical_info_line = $('.medical-info-line');
        var $parent = $medical_info_line.parent();
        var height = $parent.height();
        $medical_info_line.animate({
          top: - height + 'px'
        }, 5*1000, function() {
          $parent.append($medical_info_line.first());
          $medical_info_line.css({top: '0px'});
        });
      }, 30*1000);
    })
  },

  device_num_total: function($ele, num) {
    var self = this;
    var start = 0;
    var str_num = '0000';
    if(num >= 10000) {
      num = parseInt(num / 10000);
      $ele.find('.device-unit').text('万台');
    }
    else {
      $ele.find('.device-unit').text('台');
    }
    var num_clear = setInterval(function() {
      if(start >= num) {
        clearInterval(num_clear);
        str_num = self.switch_num(num);
        $ele.find('.device-num-bg').each(function(index, dom) {
          var html_num = str_num.slice(index, index + 1);
          $(dom).html(html_num);
        });
        return false;
      }
      start = parseInt(start) + 80;
      str_num = self.switch_num(start);
      $ele.find('.device-num-bg').each(function(index, dom) {
        var html_num = str_num.slice(index, index + 1);
        $(dom).html(html_num);
      });
    }, 2)
  },

  switch_num: function(start) {
    var length = start.toString().length;
    var str_num;
    switch (length) {
      case 1:
        str_num = '000' + start;
        break;
      case 2:
        str_num = '00' + start;
        break;
      case 3:
        str_num = '0' + start;
        break;
      case 4:
        str_num = '' + start;
        break;
      default :
        break;
    }
    return str_num;
  }
};

$(function(){
  index.ready_init();
/*  $(window).resize(function() {
    index.ready_init();
  });*/
})
;