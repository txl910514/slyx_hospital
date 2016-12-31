/**
 * Created by tangxl on 16-12-6.
 */
var index = {
  message_line_tpl: _.template($('#message_line_tpl').html()),
  medical_tpl: _.template($('#medical_tpl').html()),
  ready_init:function() {
    var self = this;
    self.highValue_ajax();
    self.dpt_ajax();
    self.info_ajax();
  },

  highValue_ajax: function() {
    var self = this;
    var $highValue = $('#highValue');
    var url = '<%=base%>' + $highValue.attr('url');
    COMMON_FUNC.ajax_get($highValue, {}, url, function(result) {
      self.device_num_total($('#total-device-num'), result.eqpCount[0].total_count);
      self.device_num_total($('#using-count'), result.eqpCount[0].using_count);
      self.device_num_total($('#fix-count'), result.eqpCount[1].finish_count);
      var data = {
        y:[],
        x1:[],
        x2:[],
        x3:[]
      };
      var life_data = {
        y:[],
        x1:[],
        x2:[],
        x3:[]
      };
      _.each(result.highValue, function(high_Value) {
        var perent = (high_Value.using_count / high_Value.total_num) * 100;
        perent = parseInt(perent);
        if (high_Value.standard_categories_name.length > 5) {
          high_Value.standard_categories_name = high_Value.standard_categories_name.slice(0,5);
        }
        data.y.push(high_Value.standard_categories_name);
        data.x1.push(high_Value.total_num);
        data.x2.push(high_Value.using_count);
        data.x3.push(perent);
      });
      _.each(result.lifeSupport, function(lifeSupport) {
        if (lifeSupport.category.length > 5) {
          lifeSupport.category = lifeSupport.category.slice(0,5);
        }
        life_data.y.push(lifeSupport.category);
        life_data.x1.push(lifeSupport.total_count);
        life_data.x2.push(lifeSupport.use_count);
        life_data.x3.push(lifeSupport.percent* 100);
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
    var overdue_line_height = $overdue_info.height() / 3 - 2;
    COMMON_FUNC.ajax_get($update_info, {}, url, function(result) {
      var month_check_data = {
        x: [],
        y:[]
      };
      var fix_pct_data = {
        status: 'line',
        x: [],
        y1:[],
        y2:[]
      };
      _.each(result.month_check, function(check) {
        month_check_data.x.unshift(check.month + '月');
        month_check_data.y.unshift(check.count);
      });
      _.each(result.fix_pct, function(fix_pct_line) {
        fix_pct_data.x.push(fix_pct_line.mon + '月');
        fix_pct_data.y1.push(fix_pct_line.report_num);
        fix_pct_data.y2.push(fix_pct_line.fix_num);
      });
      ECHARTS_FUNC.accumulate_echarts('inspection-echarts', month_check_data);
      ECHARTS_FUNC.bar_status('hitch-echarts', fix_pct_data);
      _.each(result.update_info, function(update) {
        update.standard_categories_name = update.standard_categories_name || '-';
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
            update.status_color = 'finish_color';
            break;
          case 4:
            update.status_name = '已结束';
            update.status_color = 'finish_color';
            break;
          case 5:
            update.status_name = '误报已结束';
            update.status_color = 'receive_color';
            break;
          case 7:
            update.status_name = '已留观';
            break;
          case 8:
            update.status_name = '外修开始';
            update.status_color = 'receive_color';
            break;
          case 9:
            update.status_name = '外修结束';
            update.status_color = 'receive_color';
            break;
          default :
            update.status_name = '外修结束';
            update.status_color = '';
            break;
        }
        var $update_tpl = $($.trim(self.message_line_tpl(update)));
        $update_tpl.css({
          height: update_line_height + 'px',
          'line-height': update_line_height + 'px'
        });
        $update_info.append($update_tpl);
      });
      _.each(result.overdue_info, function(overdue) {
        var $overdue_tpl = $($.trim(self.message_line_tpl(overdue)));
        $overdue_tpl.css({
          height: overdue_line_height + 'px',
          'line-height': overdue_line_height + 'px'
        });
        $overdue_info.append($overdue_tpl);
      });

      setInterval(function() {
        var $update_line = $update_info.find('.message-line');
        var $overdue_line = $overdue_info.find('.message-line');
        var $update_first = $update_line.first();
        var $overdue_first = $overdue_line.first();
        $update_line.animate({
          top: - update_line_height + 'px'
        }, 2000, function(a,b,c){
          $update_info.append($update_first);
          $update_line.css({top: '0px'});
        });
        $overdue_line.animate({
          top: - overdue_line_height + 'px'
        }, 2000, function(){
          $overdue_info.append($overdue_first);
          $overdue_line.css({top: '0px'});
        })
      }, 6000);
    })
  },

  dpt_ajax: function() {
    var self = this;
    var $offices_use = $('#offices-use').html('');
    var url = '<%=base%>' + $offices_use.attr('url');
    var total_dptfix = 0, other_dptfix = 0, dptfix_num = 0, interval_num = 0;
    var $medical_info_box = $('#medical_info_box').html('');
    COMMON_FUNC.ajax_get($offices_use, {}, url, function(result) {
      var dptuse_data = {
        x:[],
        y1:[],
        y2:[]
      };
      var dptfix_data = {
        name:'科室报修占比',
        data:[],
        series_data:[]
      };
      _.each(result.dptuse_pct, function(dptuse_pct) {
        dptuse_data.x.push(dptuse_pct.departments_name);
        dptuse_data.y1.push(100);
        dptuse_data.y2.push(parseInt(dptuse_pct.use_percent*100));
      });
      _.each(result.dptfix_pct, function(dptfix_pct, index) {
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
      });
      _.each(result.me_info[0], function(me_info_first, index) {
        me_info_first.id_index = index;
        var $medical_tpl = $(self.medical_tpl(me_info_first));
        $medical_info_box.append($medical_tpl);
        var hos_total_fix_count = result.me_info[1][0].hos_total_fix_count;
        var degree_percent = me_info_first.total_fix_count / hos_total_fix_count*2;
        var hos_resp_avg = result.me_info[1][0].hos_resp_avg;
        var answer_percent = me_info_first.resp_avg / hos_resp_avg*2;
        var hos_fix_avg = result.me_info[1][0].hos_fix_avg;
        var servicing_percent = me_info_first.fix_avg / hos_resp_avg*2;
        var degree_data = {
          status_name: hos_total_fix_count + '次',
          name: '总维修次数',
          percent: degree_percent < 1 ? degree_percent: 0.3,
          num: me_info_first.total_fix_count,
          two_percent: 0.5,
          unit: '次'
        };
        var answer_data = {
          status_name: '平均-'+ hos_resp_avg + 'h',
          name: '平均响应时长',
          percent: answer_percent < 1 ? answer_percent: 1,
          num: me_info_first.resp_avg,
          two_percent: 0.5,
          unit: 'h'
        };
        var servicing_data = {
          status_name: '平均-' + hos_fix_avg + 'h',
          name: '平均维修时长',
          percent: servicing_percent < 1 ? servicing_percent: 1,
          num: me_info_first.fix_avg,
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
        name: parseInt(result.status_pct[0].wait_count/ status_total *100) + '%',
        percent: wait_percent / 100,
        num: result.status_pct[0].wait_count,
        unit: '台'
      };
      var get_data = {
        status_name: '在修',
        name: parseInt(result.status_pct[0].get_count/ status_total *100) + '%',
        percent: get_percent / 100,
        num: result.status_pct[0].get_count,
        unit: '台'
      };
      var overdue_data = {
        status_name: '超时',
        name: parseInt(result.status_pct[0].overdue_count/ status_total *100) + '%',
        percent: overdue_percent / 100,
        num: result.status_pct[0].overdue_count,
        unit: '台'
      };
      ECHARTS_FUNC.status_pie('wait-status', wait_data);
      ECHARTS_FUNC.status_pie('repair-status', get_data);
      ECHARTS_FUNC.status_pie('overtime-status', overdue_data);
      ECHARTS_FUNC.bar_status('offices-use', dptuse_data);
      ECHARTS_FUNC.pie_echarts('offices-repair', dptfix_data);
      setInterval(function() {
        var $medical_info_line = $('.medical-info-line');
        var $parent = $medical_info_line.parent();
        var height = $parent.height();
        $medical_info_line.animate({
          top: - height + 'px'
        }, 2000, function() {
          $parent.append($medical_info_line.first());
          $medical_info_line.css({top: '0px'});
        });
      }, 6000);
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
      start = parseInt(start) + 5 ;
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
  $(window).resize(function() {

  });
})
;