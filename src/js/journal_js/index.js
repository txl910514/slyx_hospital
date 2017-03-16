/**
 * Created by tangxl on 16-12-6.
 */
var $body = $('body');
var versionUrl = '<%=base%>' + $body.attr('url');
var getCookie;
var index = {
  message_line_tpl: _.template($('#message_line_tpl').html()),
  medical_tpl: _.template($('#medical_tpl').html()),
  no_bx_tpl: _.template($('#no-bx-tpl').html()),
  ready_init:function() {
    var self = this;
    if (window.medatc) {
      window.medatc.hideLoading();
    }
    self.version_ajax();
    self.highValue_ajax();
    self.dpt_ajax();
    self.info_ajax();
    setInterval(function() {
      self.version_ajax();
    }, 10*60*1000);
    setInterval(function() {
      self.highValue_ajax();
      self.dpt_ajax();
      self.info_ajax();
    }, 60*60*1000);
  },

  version_ajax: function() {
    COMMON_FUNC.ajax_get($body, {}, versionUrl, 'jsonpCallback', function(result) {
      getCookie = COMMON_FUNC.getCookie('version');
      if (getCookie !== result.version) {
        COMMON_FUNC.setCookie('version', result.version, location.pathname, location.hostname );
        COMMON_FUNC.get_url();
      }
    })
  },

  highValue_ajax: function() {
    var self = this;
    var $highValue = $('#highValue');
    var url = '<%=base%>' + $highValue.attr('url');
    var jsonp_name = $highValue.attr('jsonp-callback');
    var data, life_data, high_length, highValue_sort, life_length, lifeSupport_sort;
    var life_min, high_min, life_max, high_max, min_color, dot_color, add;
    COMMON_FUNC.ajax_get($highValue, {}, url, jsonp_name, function(result) {
      self.device_num_total($('#total-device-num'), result.eqpCount[0].total_count);
      self.device_num_total($('#using-count'), result.eqpCount[0].using_count);
      self.device_num_total($('#fix-count'), result.eqpCount[1].finish_count);
      $('#header-title').text(result.eqpCount[1].hospitals_name);
      document.title = result.eqpCount[1].hospitals_name;
      data = {
        y:[],
        x1:[],
        name1: '设备总数',
        x2:[],
        name2: '可用设备',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'台',
        min_arr:[]
      };
      life_data = {
        y:[],
        x1:[],
        name1: '设备总数',
        x2:[],
        name2: '可用设备',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'台',
        min_arr:[]
      };
      if (result.highValue.length < 7) {
        high_length = 7 -  result.highValue.length;
        _(high_length).times(function(){
          result.highValue.push({
            category: '',
            total_count:0,
            use_count:0,
            percent: 0
          });
        });
        high_length = null;
      }
      highValue_sort = _.sortBy(result.highValue, 'percent');
      _.each(highValue_sort, function(high_Value) {
        if (high_Value.category.length > 6) {
          high_Value.category = high_Value.category.slice(0,6);
        }
        data.y.push(high_Value.category);
        data.x1.push(high_Value.total_count);
        data.x2.push(high_Value.use_count);
        data.x3.push(high_Value.percent* 100);
        if(high_Value.category) {
          data.min_arr.push(high_Value.percent* 100);
        }
        high_Value = null;
      });
      if (result.lifeSupport.length < 7) {
        life_length = 7 -  result.lifeSupport.length;
        _(life_length).times(function(n){
          result.lifeSupport.push({
            category: '',
            total_count:0,
            use_count:0,
            percent: 0
          });
        });
        life_length = null;
      }
      lifeSupport_sort = _.sortBy(result.lifeSupport, 'percent');
      _.each(lifeSupport_sort, function(lifeSupport) {
        if (lifeSupport.category.length > 6) {
          lifeSupport.category = lifeSupport.category.slice(0,6);
        }
        life_data.y.push(lifeSupport.category);
        life_data.x1.push(lifeSupport.total_count);
        life_data.x2.push(lifeSupport.use_count);
        life_data.x3.push(lifeSupport.percent* 100);
        if(lifeSupport.category) {
          life_data.min_arr.push(lifeSupport.percent* 100);
        }
        lifeSupport = null;
      });
      life_min = _.min(life_data.min_arr);
      high_min = _.min(data.min_arr);
      life_max = _.max(life_data.x1);
      high_max = _.max(data.x1);
      min_color = '#cfeaf0';
      dot_color = '#71c8d9';
      add = 0;
      _.each(life_data.x3, function(value, index) {
        if(value === life_min && value !== 100 && life_data.min_arr.length > 1) {
          min_color = '#f39800';
          dot_color = '#f39800';
        }
        else {
          min_color = '#cfeaf0';
          dot_color = '#71c8d9';
        }
        if (!life_data.x1[index]) {
          dot_color = 'transparent';
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
        value = null, index= null;
      });
      _.each(data.x3, function(value, index) {
        if(value === high_min && value !== 100 && data.min_arr.length > 1) {
          min_color = '#f39800';
          dot_color = '#f39800';
        }
        else {
          min_color = '#cfeaf0';
          dot_color = '#71c8d9'
        }
        if (!data.y[index]) {
          dot_color = 'transparent';
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
        value = null, index= null;
      });
      ECHARTS_FUNC.horizontal_bar_echarts('high-value-echarts', data);
      ECHARTS_FUNC.horizontal_bar_echarts('life-echarts', life_data);
      self = null, data = null, $highValue = null, url = null, jsonp_name = null, result = null,
          life_data = null, highValue_sort = null, lifeSupport_sort = null, life_min = null,
          high_min = null, life_max = null, high_max = null, min_color = null, dot_color = null,
          add = null;
    })
  },

  info_ajax: function() {
    var self = this;
    var $update_info = $('#update-info').html('');
    var $overdue_info = $('#overdue_info').html('');
    var url = '<%=base%>' + $update_info.attr('url');
    var update_line_height = $update_info.height() / 6 - 2;
    var overdue_line_height = $overdue_info.height() / 4 - 2;
    var screen_height = $(window).height();
    var $update_line, $overdue_line, $update_first, $overdue_first;
    var $update_tpl, $overdue_tpl;
    var month_check_data, fix_pct_data;
    if (screen_height >= 1200) {
      update_line_height = $update_info.height() / 8 - 2;
      overdue_line_height = $overdue_info.height() / 6 - 2;
    }
    else if (screen_height >= 1024) {
      update_line_height = $update_info.height() / 7 - 2;
      overdue_line_height = $overdue_info.height() / 5 - 2;
    }
    else if (screen_height >= 864) {
      update_line_height = $update_info.height() / 6 - 2;
      overdue_line_height = $overdue_info.height() / 4 - 2;
    }
    else if (screen_height >= 768) {
      update_line_height = $update_info.height() / 5 - 2;
      overdue_line_height = $overdue_info.height() / 3 - 2;
    }
    else if (screen_height >= 600) {
      update_line_height = $update_info.height() / 4 - 2;
      overdue_line_height = $overdue_info.height() / 2 - 2;
    }
    else if (screen_height >= 420) {
      update_line_height = $update_info.height() / 3 - 2;
      overdue_line_height = $overdue_info.height() / 1 - 2;
    }
    clearInterval(GVR.INTERVAL.message_setInterval);
    GVR.INTERVAL.message_setInterval = null;
    var jsonp_name = $update_info.attr('jsonp-callback');
    COMMON_FUNC.ajax_get($update_info, {}, url, jsonp_name, function(result) {
      month_check_data = {
        x: [],
        y:[],
        unit:'次',
        name: '月质控统计'
      };
      fix_pct_data = {
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
        check = null;
      });
      _.each(result.fix_pct, function(fix_pct_line) {
        fix_pct_data.x.unshift(fix_pct_line.mon + '月');
        fix_pct_data.y1.unshift(fix_pct_line.report_num);
        fix_pct_data.y2.unshift(fix_pct_line.fix_num);
        fix_pct_line = null;
      });
      ECHARTS_FUNC.accumulate_echarts('inspection-echarts', month_check_data);
      ECHARTS_FUNC.bar_status('hitch-echarts', fix_pct_data);
      _.each(result.update_info, function(update) {
        update.categories_name = update.categories_name || '-';
        update.updated_at = update.updated_at.replace(/-/g,'/').replace(/^\d{2}/g,'').replace(/:\d{2}$/g,'');
        if (update.status !== 1) {
          update.users_name = update.users_name || '-';
        }
        switch (update.status) {
          case 1:
            update.status_name = '报修';
            update.status_color = 'repair_color';
            update.users_name = update.users_name || '未接修';
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
        $update_tpl = $($.trim(self.message_line_tpl(update)));
        $update_tpl.css({
          height: update_line_height + 'px',
          'line-height': update_line_height + 'px'
        });
        $update_info.append($update_tpl);
        update = null, $update_tpl = null;
      });
      _.each(result.overdue_info, function(overdue) {
        overdue.updated_at = '';
        overdue.over_due_time = overdue.over_due_time || '-';
        overdue.created_at = overdue.created_at.replace(/-/g,'/').replace(/^\d{2}/g,'').replace(/:\d{2}$/g,'');
        if(overdue.status === 1) {
          overdue.users_name = overdue.users_name || '未接修';
        }
        else {
          overdue.users_name = overdue.users_name || '-';
        }
        $overdue_tpl = $($.trim(self.message_line_tpl(overdue)));
        $overdue_tpl.css({
          height: overdue_line_height + 'px',
          'line-height': overdue_line_height + 'px'
        });
        $overdue_info.append($overdue_tpl);
        overdue = null, $overdue_tpl = null;
      });
      GVR.INTERVAL.message_setInterval = setInterval(function() {
        $update_line = $update_info.find('.message-line');
        $overdue_line = $overdue_info.find('.message-line');
        $update_first = $update_line.first();
        $overdue_first = $overdue_line.first();
        $update_line.animate({
          top: - update_line_height + 'px'
        }, 3*1000, function(a,b,c){
          $update_info.append($update_first);
          $update_line.css({top: '0px'});
        });
        $overdue_line.animate({
          top: - overdue_line_height + 'px'
        }, 3*1000, function(){
          $overdue_info.append($overdue_first);
          $overdue_line.css({top: '0px'});
        });
      }, 60*1000);
      self = null,  url = null,  screen_height = null, jsonp_name = null, result = null, month_check_data = null,
          fix_pct_data = null, $overdue_tpl = null, $update_tpl = null;
    })
  },

  dpt_ajax: function() {
    var self = this;
    var $offices_use = $('#offices-use').html('');
    var url = '<%=base%>' + $offices_use.attr('url');
    var total_dptfix = 0, dptfix_num = 0;
    var $medical_info_box = $('#medical_info_box').html('');
    var $medical_info_hidden = $('#medical_info_box:hidden').length;
    var $error_body = $('body');
    var error_url = '<%=base%>' + '/err/insert';
    var error_text, error_data, $medical_tpl, $medical_info_line, $parent, height, dptuse_data,
        lack_length, dptusePct_sort;
    var dptuse_min, dptuse_color, x1_value;
    var status_total, wait_percent, get_percent, overdue_percent, wait_data, get_data, overdue_data;
    if ($medical_info_hidden) {
      $medical_info_box = $('#min_info_box').html('');
    }
    clearInterval(GVR.INTERVAL.info_setInterval);
    GVR.INTERVAL.info_setInterval = null;
    var jsonp_name = $offices_use.attr('jsonp-callback');
    COMMON_FUNC.ajax_get($offices_use, {}, url, jsonp_name, function(result) {
      dptuse_data = {
        y:[],
        x1:[],
        name1: '总比例',
        x2:[],
        name2: '可用比例',
        x3:[],
        name3: '可用设备比例',
        label:[],
        unit:'',
        status:'dptuse',
        min_arr:[]
      };
      if (result.dptuse_pct.length < 5) {
        lack_length = 5 -  result.dptuse_pct.length;
        _(lack_length).times(function(n){
          result.dptuse_pct.push({
            departments_name: '',
            use_percent: 0
          });
        });
      }
      dptusePct_sort = _.sortBy(result.dptuse_pct, 'departments_name');
      _.each(dptusePct_sort, function(dptuse_pct) {
        if (dptuse_pct.departments_name.length > 6) {
          dptuse_pct.departments_name = dptuse_pct.departments_name.slice(0,6);
        }
        dptuse_data.y.push(dptuse_pct.departments_name);
        dptuse_data.x2.push(parseInt(dptuse_pct.use_percent*100));
        if(dptuse_pct.departments_name) {
          dptuse_data.min_arr.push(parseInt(dptuse_pct.use_percent*100));
        }
      });
      dptuse_min = _.min(dptuse_data.min_arr);
      dptuse_color = '#cfeaf0';
      x1_value = 100;
      _.each(dptuse_data.x2, function(value, index) {
        if(value === dptuse_min && value !== 100 && dptuse_data.min_arr.length > 1) {
          dptuse_color = '#f39800';
        }
        else {
          dptuse_color = '#cfeaf0';
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
      _.each(result.me_info[0], function(me_info_first, index) {
        if (me_info_first.fix_avg < 0 || me_info_first.resp_avg < 0) {
          error_text = me_info_first.users_name + ',' + me_info_first.resp_avg + ',' + me_info_first.fix_avg;
          error_data = {
            error: error_text
          };
          COMMON_FUNC.ajax_get($error_body, error_data, error_url, 'err_insert', function(result) {

          });
        }
        me_info_first.id_index = index;
        me_info_first.last_name = me_info_first.users_name[me_info_first.users_name.length-1];
        me_info_first.resp_avg = me_info_first.resp_avg < 0 ? 0 : parseFloat(me_info_first.resp_avg.toFixed(2));
        me_info_first.fix_avg = me_info_first.fix_avg < 0 ? 0 : parseFloat(me_info_first.fix_avg.toFixed(2));
        $medical_tpl = $(self.medical_tpl(me_info_first));
        $medical_info_box.append($medical_tpl);
      });
      status_total = result.status_pct[0].overdue_count + result.status_pct[0].wait_count +
        result.status_pct[0].get_count;
      wait_percent = parseInt(result.status_pct[0].wait_count/ status_total *100);
      get_percent = parseInt(result.status_pct[0].get_count/ status_total *100);
      overdue_percent = parseInt(result.status_pct[0].overdue_count/ status_total *100);
      wait_data = {
        status_name: '等待',
        name: '',
        percent: wait_percent / 100,
        num: result.status_pct[0].wait_count,
        unit: '次'
      };
      get_data = {
        status_name: '在修',
        name: '',
        percent: get_percent / 100,
        num: result.status_pct[0].get_count,
        unit: '次'
      };
      overdue_data = {
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
      GVR.INTERVAL.info_setInterval = setInterval(function() {
        $medical_info_line = $('.medical-info-line');
        $parent = $medical_info_line.parent();
        height = $parent.height();
        $medical_info_line.animate({
          top: - height + 'px'
        }, 3*1000, function() {
          $parent.append($medical_info_line.first());
          $medical_info_line.css({top: '0px'});
        });
      }, 60*1000);
      self = null, $offices_use = null, url = null, total_dptfix = null, dptfix_num = null, $medical_info_box = null,
          $medical_info_hidden = null, jsonp_name = null, result = null, dptuse_data = null, lack_length = null,
          dptusePct_sort = null, dptuse_min = null, dptuse_color = null, x1_value = null, error_url = null,
          error_text = null, error_data = null, $error_body = null, $medical_tpl = null, status_total = null,
          wait_percent = null, get_percent = null, overdue_percent = null, wait_data = null, get_data = null,
          overdue_data = null;
    })
  },

  device_num_total: function($ele, num) {
    var self = this;
    var start = 0;
    var str_num = '0000';
    var html_num;
    var $deviceNumBg = $ele.find('.device-num-bg');
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
        $deviceNumBg.each(function(index, dom) {
          html_num = str_num.slice(index, index + 1);
          $(dom).html(html_num);
          html_num = null;
        });
        self = null, start = null, str_num = null, num_clear = null, $ele = null, num = null, $deviceNumBg = null;
        return false;
      }
      start = parseInt(start) + 80;
      str_num = self.switch_num(start);
      $deviceNumBg.each(function(index, dom) {
        html_num = str_num.slice(index, index + 1);
        $(dom).html(html_num);
        html_num = null;
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
    length = null, start = null;
    return str_num;
  }
};

$(function(){
  index.ready_init();
  $(window).resize(function() {
    index.ready_init();
  });
})
;