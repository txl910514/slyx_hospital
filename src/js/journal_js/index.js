/**
 * Created by tangxl on 16-12-6.
 */
var wsUrl = '/socketServer';
var eqpCountUrl = '/hos/eqp_count?hosId=3622';
var tktStatusUrl = '/hos/tkt_status?hosId=3622';
var patrolStatusUrl = '/hos/patrol_status?hosId=3622';
var completedStatusUrl = '/hos/completed_status?hosId=3622';
var eqpStatusUrl = '/hos/eqp_status?hosId=3622';
var dptStatusUrl = '/hos/dpt_status?hosId=3622';
var engineerStatusUrl = '/hos/engineer_status?hosId=3622';
var versionUrl = '<%=base%>' + '/version/get';
var getCookie;
var $body = $('body');
var $error_init = $('.error_init');
var $error_text = $('.error-text');
var socket, socket_msg, socket_error_time = 0, socket_close_time = 0, socket_func, error_close_setTime;
var dptStatus_data, eqpCount_data, eqpStatus_data, tktStatus_data, patrolStatus_data, completedStatus_data,
    engineerStatus_data, valuableStatus_data, LifeSupportStatus_data;
var hospital_id, hospital_ws, hospital_name, token, user_id;
var INDEX = {
  message_line_tpl: _.template($('#message_line_tpl').html()),
  medical_tpl: _.template($('#medical_tpl').html()),
  ready_init:function() {
    MEDATC_FUNC.hideLoading();
/*    dptStatus_data = JSON.parse(localStorage.getItem('dptStatus'));
    eqpCount_data = JSON.parse(localStorage.getItem('eqpCount'));
    eqpStatus_data = JSON.parse(localStorage.getItem('eqpStatus'));
    tktStatus_data = JSON.parse(localStorage.getItem('tktStatus'));
    patrolStatus_data = JSON.parse(localStorage.getItem('patrolStatus'));
    completedStatus_data = JSON.parse(localStorage.getItem('completedStatus'));
    engineerStatus_data = JSON.parse(localStorage.getItem('engineerStatus'));
    INDEX.dptStatus_apply(dptStatus_data);
    INDEX.eqpCount_apply(eqpCount_data);
    INDEX.eqpStatus_apply(eqpStatus_data);
    INDEX.tktStatus_apply(tktStatus_data);
    INDEX.patrolStatus_apply(patrolStatus_data);
    INDEX.completedStatus_apply(completedStatus_data);
    INDEX.engineerStatus_apply(engineerStatus_data);*/
    if (!!window.WebSocket && window.WebSocket.prototype.send) {
      //COMMON_FUNC.setCookie('hospital_id', 3092, location.pathname, location.hostname );
      hospital_id = COMMON_FUNC.getCookie('hospital_id');
      hospital_ws = null;
      hospital_ws = wsUrl + '?hos=' + hospital_id;
      if(!hospital_id) {
        window.location.href = "https://passport.test.medevicedata.com/wechat/?redirect=http%3A%2F%2F121.42.187.170%3A8081%2Fdp%2Fhos%2F";
        return false;
      }
      INDEX.WebSocket_dp();
    }
    else {
      INDEX.no_WebSocket();
    }
  },

  resize_dp: function() {
    dptStatus_data = JSON.parse(localStorage.getItem('dptStatus')) || {};
    eqpCount_data = JSON.parse(localStorage.getItem('eqpCount')) || {};
    eqpStatus_data = JSON.parse(localStorage.getItem('eqpStatus')) || {};
    tktStatus_data = JSON.parse(localStorage.getItem('tktStatus')) || {};
    patrolStatus_data = JSON.parse(localStorage.getItem('patrolStatus')) || {};
    completedStatus_data = JSON.parse(localStorage.getItem('completedStatus')) || {};
    engineerStatus_data = JSON.parse(localStorage.getItem('engineerStatus')) || {};
    valuableStatus_data = JSON.parse(localStorage.getItem('valuableStatus')) || {};
    LifeSupportStatus_data = JSON.parse(localStorage.getItem('LifeSupportStatus')) || {};
    hospital_name = COMMON_FUNC.getCookie('hospital_name') || '-';
    INDEX.dptStatus_apply(dptStatus_data);
    INDEX.eqpCount_apply(eqpCount_data);
    INDEX.eqpStatus_apply(eqpStatus_data);
    INDEX.tktStatus_apply(tktStatus_data);
    INDEX.patrolStatus_apply(patrolStatus_data);
    INDEX.completedStatus_apply(completedStatus_data);
    INDEX.engineerStatus_apply(engineerStatus_data);
    INDEX.nameStatus_apply(hospital_name);
    INDEX.valuableStatus_apply(valuableStatus_data);
    INDEX.LifeSupportStatus_apply(LifeSupportStatus_data);
  },

  no_WebSocket: function() {
    INDEX.version_ajax();
    INDEX.eqpCount_ajax(); // 设备总数
    INDEX.tktStatus_ajax(); // 状态饼图
    INDEX.patrolStatus_ajax(); // 月质控
    INDEX.completedStatus_ajax(); // 月完修
    INDEX.engineerStatus_ajax(); //医工信息
    INDEX.eqpStatus_ajax(); // 信息更新
    INDEX.dptStatus_ajax(); //科室再用率
    GVR.INTERVAL.VERSION_AJAX = setInterval(function() {
      INDEX.version_ajax();
    }, 30*1000);
    GVR.INTERVAL.INIT_AJAX = setInterval(function() {
      INDEX.eqpCount_ajax(); // 设备总数
      INDEX.tktStatus_ajax(); // 状态饼图
      INDEX.patrolStatus_ajax(); // 月质控
      INDEX.completedStatus_ajax(); // 月完修
      INDEX.engineerStatus_ajax(); //医工信息
      INDEX.eqpStatus_ajax(); // 信息更新
      INDEX.dptStatus_ajax(); //科室再用率
    }, 60*60*1000);
  },

  WebSocket_dp: function() {
    if (!GVR.SOCKET.WEBSOCKET) {
      socket = new WebSocket('<%=ws_url%>'+ hospital_ws);
      socket_func = {
        timeout: 3*1000,//3秒
        closeTimeout: 60*1000,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function(){
          if (this.timeoutObj) {
            clearTimeout(this.timeoutObj);
            this.timeoutObj = null;
          }
          if (this.serverTimeoutObj) {
            clearTimeout(this.serverTimeoutObj);
            this.serverTimeoutObj = null;
          }
          if (GVR.SOCKET.WEBSOCKET) {
            this.start();
          }
        },
        start: function(){
          var self = this;
          this.timeoutObj = setTimeout(function(){
            socket.send("HeartBeat", "beat");
            self.serverTimeoutObj = setTimeout(function(){
              self.closeHeart();
              socket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.closeTimeout)
          }, this.timeout);
        },
        closeHeart: function() {
          if (this.timeoutObj) {
            clearTimeout(this.timeoutObj);
            this.timeoutObj = null;
          }
          if (this.serverTimeoutObj) {
            clearTimeout(this.serverTimeoutObj);
            this.serverTimeoutObj = null;
          }
        }
      };
      socket.onopen = function(event) {
        GVR.SOCKET.WEBSOCKET = socket;
        $error_init.css('display','none');
        socket_close_time = 0;
        socket_error_time = 0;
        if (GVR.INTERVAL.VERSION_AJAX) {
          clearInterval(GVR.INTERVAL.VERSION_AJAX);
        }
        if (GVR.INTERVAL.INIT_AJAX) {
          clearInterval(GVR.INTERVAL.INIT_AJAX);
        }
        if(error_close_setTime) {
          clearTimeout(error_close_setTime);
        }
        hospital_name = COMMON_FUNC.getCookie('hospital_name') || '-';
        INDEX.nameStatus_apply(hospital_name);
        socket_func.reset();
        // 关闭Socket....
        // socket.close();
      };
      // 监听消息
      socket.onmessage = function(event) {
        socket_func.reset();
        try
        {
          socket_msg = JSON.parse(event.data);
        }
        catch(err)
        {
          socket_msg = {};
        }
        switch (socket_msg.message) {
          case 'eqp_count':
            if (!window.medatc) {
              localStorage.setItem('eqpCount', JSON.stringify(socket_msg));
            }
            INDEX.eqpCount_apply(socket_msg);
            break;
          case 'dpt_status':
            if (!window.medatc) {
              localStorage.setItem('dptStatus', JSON.stringify(socket_msg));
            }
            INDEX.dptStatus_apply(socket_msg);
            break;
          case 'tkt_status':
            if (!window.medatc) {
              localStorage.setItem('tktStatus', JSON.stringify(socket_msg));
            }
            INDEX.tktStatus_apply(socket_msg);
            break;
          case 'completed_status':
            if (!window.medatc) {
              localStorage.setItem('completedStatus', JSON.stringify(socket_msg));
            }
            INDEX.completedStatus_apply(socket_msg);
            break;
          case 'eqp_status':
            if (!window.medatc) {
              localStorage.setItem('eqpStatus', JSON.stringify(socket_msg));
            }
            INDEX.eqpStatus_apply(socket_msg);
            break;
          case 'engineer_status':
            if (!window.medatc) {
              localStorage.setItem('engineerStatus', JSON.stringify(socket_msg));
            }
            INDEX.engineerStatus_apply(socket_msg);
            break;
          case 'patrol_status':
            if (!window.medatc) {
              localStorage.setItem('patrolStatus', JSON.stringify(socket_msg));
            }
            INDEX.patrolStatus_apply(socket_msg);
            break;
          case 'valuable':
            if (!window.medatc) {
              localStorage.setItem('valuableStatus', JSON.stringify(socket_msg));
            }
            INDEX.valuableStatus_apply(socket_msg);
            break;
          case 'LifeSupport':
            if (!window.medatc) {
              localStorage.setItem('LifeSupportStatus', JSON.stringify(socket_msg));
            }
            INDEX.LifeSupportStatus_apply(socket_msg);
            break;
          case 'version':
            INDEX.versionStatus_apply(socket_msg);
            break;
          default :
            break;
        }
      };

      // 监听Socket的关闭
      socket.onclose = function(event) {
        socket_func.closeHeart();
        GVR.SOCKET.WEBSOCKET = null;
        $error_text.text('连接断开，正在重连...');
        $error_init.css('display', 'block');
        if(error_close_setTime) {
          clearTimeout(error_close_setTime);
        }
        if (GVR.ONLINE && !GVR.RELOAD) {
          error_close_setTime = setTimeout(function() {
            if (GVR.SOCKET.WEBSOCKET) {
              if(error_close_setTime) {
                clearTimeout(error_close_setTime);
              }
            }
            else {
              INDEX.WebSocket_dp();
            }
          }, 60*1000);
        }
      };
      socket.onerror = function(event) {
/*        socket_func.closeHeart();
        GVR.SOCKET.WEBSOCKET = null;
        $error_text.text('连接断开，正在重连...');
        $error_init.css('display', 'block');
        if(error_close_setTime) {
          clearTimeout(error_close_setTime);
        }
        if (GVR.ONLINE && !GVR.RELOAD) {
          $error_text.text('error');
          socket_error_time += 1;
          if (socket_error_time === 4) {
            /!*   INDEX.no_WebSocket();*!/
          }
          error_close_setTime = setTimeout(function() {
            if (GVR.SOCKET.WEBSOCKET) {
              if(error_close_setTime) {
                clearTimeout(error_close_setTime);
              }
            }
            else {
              INDEX.WebSocket_dp();
            }
          }, 10*1000);
        }*/

      };
    }
    window.onbeforeunload = function () {
      socket.close();
    }
  },

  version_ajax: function() {
    COMMON_FUNC.ajax_get(versionUrl, {}, '', function(result) {
      getCookie = COMMON_FUNC.getCookie('version');
      if (getCookie !== result.version) {
/*        COMMON_FUNC.setCookie('version', result.version, location.pathname, location.hostname );
        COMMON_FUNC.get_url();*/
      }
    })
  },

  versionStatus_apply: function(result) {
    if (result.success) {
      getCookie = JSON.parse(localStorage.getItem('versionStatus')) || {};
      if(getCookie.data) {
        if (getCookie.data !== result.data) {
          localStorage.setItem('versionStatus', JSON.stringify(socket_msg));
          COMMON_FUNC.get_url(result.data);
        }
      }
      else {
        localStorage.setItem('versionStatus', JSON.stringify(socket_msg));
      }
    }
  },

  eqpCount_ajax: function() {
    var url = '<%=base%>' + eqpCountUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('eqpCount', JSON.stringify(result));
        INDEX.eqpCount_apply(result);
      }
/*      $('#header-title').text(result.eqpCount[1].hospitals_name);
      document.title = result.eqpCount[1].hospitals_name;*/
    })
  },

  eqpCount_apply: function(result) {
    if (result.success) {
      INDEX.device_num_total($('#total-device-num'), result.data.total_count || 0);
      INDEX.device_num_total($('#using-count'), result.data.using_count || 0);
      INDEX.device_num_total($('#fix-count'), result.data.finish_count || 0);
      result = null;
    }
  },

  nameStatus_apply: function(name) {
    if (name) {
      $('#header-title').text(name);
      document.title = name;
      name = null;
    }
  },

  tktStatus_ajax: function() {
    var url = '<%=base%>' + tktStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('tktStatus', JSON.stringify(result));
        INDEX.tktStatus_apply(result);
        url = null;
      }
    })
  },

  tktStatus_apply: function(result) {
    if (result.success) {
      var status_total, wait_percent, get_percent, overdue_percent, wait_data, get_data, overdue_data;
      status_total = result.data.wait_count + result.data.get_count;
      status_total = status_total? status_total : 1;
      wait_percent = parseInt(result.data.wait_count/ status_total *100);
      get_percent = parseInt(result.data.get_count/ status_total *100);
      overdue_percent = parseInt(result.data.overdue_count/ status_total *100);
      wait_data = {
        status_name: '等待',
        name: '',
        percent: wait_percent / 100,
        num: result.data.wait_count,
        unit: '次'
      };
      get_data = {
        status_name: '在修',
        name: '',
        percent: get_percent / 100,
        num: result.data.get_count,
        unit: '次'
      };
      overdue_data = {
        status_name: '超时',
        name: '',
        percent: overdue_percent / 100,
        num: result.data.overdue_count,
        unit: '次'
      };
      ECHARTS_FUNC.status_pie('wait-status', wait_data);
      ECHARTS_FUNC.status_pie('repair-status', get_data);
      ECHARTS_FUNC.status_pie('overtime-status', overdue_data);

      result = null, status_total = null, wait_percent = null, get_percent = null, overdue_percent = null,
          wait_data = null, get_data = null, overdue_data = null;
    }
  },

  patrolStatus_ajax: function() {
    var url = '<%=base%>' + patrolStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('patrolStatus', JSON.stringify(result));
        INDEX.patrolStatus_apply(result);
        url = null;
      }
    })
  },

  patrolStatus_apply: function(result) {
    if (result.success) {
      var month_check_data;
      month_check_data = {
        x: [],
        y:[],
        unit:'次',
        name: '月质控统计'
      };
      _.each(result.data.month_check, function(check) {
        month_check_data.x.push(check.month + '月');
        month_check_data.y.push(check.count);
        check = null;
      });
      ECHARTS_FUNC.accumulate_echarts('inspection-echarts', month_check_data);
      result = null, month_check_data = null;
    }
  },

  valuableStatus_apply: function(result) {
    if(result.success) {
      var data, high_length, highValue_sort;
      var high_min,  high_max, min_color, dot_color, add;
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
      highValue_sort = _.sortBy(result.data, function(sort) {
        return -sort.percent;
      });
      if (highValue_sort.length < 7) {
        high_length = 7 - highValue_sort.length;
        _(high_length).times(function(){
          highValue_sort.push({
            category: '',
            total_count:0,
            use_count:0,
            percent: 0
          });
        });
        high_length = null;
      }
      else {
        highValue_sort = highValue_sort.slice(highValue_sort.length - 7, highValue_sort.length);
      }
      _.each(highValue_sort, function(high_Value) {
        if (high_Value.category.length > 6) {
          high_Value.category = high_Value.category.slice(0,6);
        }
        data.y.push(high_Value.category);
        data.x1.push(high_Value.total_count);
        data.x2.push(high_Value.using_count);
        data.x3.push(high_Value.percent* 100);
        if(high_Value.category) {
          data.min_arr.push(high_Value.percent* 100);
        }
        high_Value = null;
      });
      high_min = _.min(data.min_arr);
      high_max = _.max(data.x1);
      min_color = '#cfeaf0';
      dot_color = '#71c8d9';
      add = 0;
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
       data = null, result = null, highValue_sort = null, high_min = null,  high_max = null, min_color = null,
           dot_color = null, add = null;
    }
  },

  LifeSupportStatus_apply: function(result) {
    if (result.success) {
      var life_data, life_length, lifeSupport_sort;
      var life_min, life_max, min_color, dot_color, add;
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
      lifeSupport_sort = _.sortBy(result.data, function(sort) {
        return - sort.percent;
      });
      if (lifeSupport_sort.length < 7) {
        life_length = 7 -  lifeSupport_sort.length;
        _(life_length).times(function(n){
          lifeSupport_sort.push({
            category: '',
            total_count:0,
            use_count:0,
            percent: 0
          });
        });
        life_length = null;
      }
      else {
        lifeSupport_sort = lifeSupport_sort.slice(lifeSupport_sort.length - 7,lifeSupport_sort.length);
      }
      _.each(lifeSupport_sort, function(lifeSupport) {
        if (lifeSupport.category.length > 6) {
          lifeSupport.category = lifeSupport.category.slice(0,6);
        }
        life_data.y.push(lifeSupport.category);
        life_data.x1.push(lifeSupport.total_count);
        life_data.x2.push(lifeSupport.using_count);
        life_data.x3.push(lifeSupport.percent* 100);
        if(lifeSupport.category) {
          life_data.min_arr.push(lifeSupport.percent* 100);
        }
        lifeSupport = null;
      });
      life_min = _.min(life_data.min_arr);
      life_max = _.max(life_data.x1);
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
      ECHARTS_FUNC.horizontal_bar_echarts('life-echarts', life_data);
      result = null, life_data = null,  lifeSupport_sort = null, life_min = null,
          life_max = null, min_color = null, dot_color = null,
          add = null;
    }
  },

  completedStatus_ajax: function() {
    var url = '<%=base%>' + completedStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('completedStatus', JSON.stringify(result));
        INDEX.completedStatus_apply(result);
        url = null;
      }
    })
  },

  completedStatus_apply: function(result) {
    if (result.success) {
      var fix_pct_data;
      fix_pct_data = {
        status: 'line',
        x: [],
        y1:[],
        y2:[],
        legend_data: ['当月报修', '当月完修'],
        unit: '次'
      };
      _.each(result.data.fix_pct, function(fix_pct_line) {
        fix_pct_data.x.push(fix_pct_line.mon + '月');
        fix_pct_data.y1.push(fix_pct_line.report_num);
        fix_pct_data.y2.push(fix_pct_line.fix_num);
        fix_pct_line = null;
      });
      ECHARTS_FUNC.bar_status('hitch-echarts', fix_pct_data);
      result = null,  fix_pct_data = null;
    }
  },

  eqpStatus_ajax: function() {
    var url = '<%=base%>' + eqpStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('eqpStatus', JSON.stringify(result));
        INDEX.eqpStatus_apply(result);
         url = null;
      }
    })
  },

  eqpStatus_apply:function(result) {
    if (result.success) {
      var $update_info = $('#update-info');
      var $overdue_info = $('#overdue_info');
      var update_line_height = $update_info.height() / 6 - 2;
      var overdue_line_height = $overdue_info.height() / 4 - 2;
      var screen_height = $(window).height();
      var $update_line, $overdue_line, $update_first, $overdue_first;
      var $update_tpl, $overdue_tpl, update_sort, overdue_sort;
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
      $update_info.html('');
      $overdue_info.html('');
      update_sort = _.sortBy(result.data.update_info, function(sort) {
        return -new Date(sort.updated_at);
        //return sort.updated_at.charCodeAt() * -1;
      });
      overdue_sort = _.sortBy(result.data.overdue_info, function(sort) {
        return -new Date(sort.created_at);
      });
      _.each(update_sort, function(update) {
        update.categories_name = update.categories_name || '-';
        update.updated_at = update.updated_at.replace(/-/g,'/').replace(/^\d{2}/g,'').replace(/:\d{2}$/g,'');
        if (update.status !== '待接修') {
          update.users_name = update.users_name || '-';
        }
        switch (update.status) {
          case '待接修':
            update.status_name = '待接修';
            update.status_color = 'repair_color';
            update.users_name = update.users_name || update.status;
            break;
          case '维修中':
            update.status_name = '维修中';
            update.status_color = 'receive_color';
            break;
          case '待确认':
            update.status_name = '待确认';
            update.status_color = 'receive_color';
            break;
          case '维修完成':
            update.status_name = '维修完成';
            update.status_color = 'finish_color';
            break;
          default :
            update.status_name = '-';
            update.status_color = '';
            break;
        }
        $update_tpl = $($.trim(INDEX.message_line_tpl(update)));
        $update_tpl.css({
          height: update_line_height + 'px',
          'line-height': update_line_height + 'px'
        });
        $update_info.append($update_tpl);
        update = null, $update_tpl = null;
      });
      _.each(overdue_sort, function(overdue) {
        overdue.updated_at = '';
        overdue.categories_name = '-';
        overdue.over_due_time = overdue.over_due_time || '-';
        overdue.created_at = overdue.created_at.replace(/-/g,'/').replace(/^\d{2}/g,'').replace(/:\d{2}$/g,'');
        if(overdue.status === '待接修') {
          overdue.users_name = overdue.users_name || overdue.status;
        }
        else {
          overdue.users_name = overdue.users_name || '-';
        }
        $overdue_tpl = $($.trim(INDEX.message_line_tpl(overdue)));
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
        }, 3*1000, function(){
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
      url = null,  screen_height = null,  result = null, $overdue_tpl = null,
          $update_tpl = null, update_sort = null, overdue_sort = null;
    }
  },

  dptStatus_ajax: function() {
    var url = '<%=base%>' + dptStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('dptStatus', JSON.stringify(result));
        INDEX.dptStatus_apply(result);
        url = null;
      }
    })
  },

  dptStatus_apply: function(result) {
    if(result.success) {
      var  dptuse_data, lack_length, dptusePct_sort ,dptuse_min, dptuse_color, x1_value;
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
      dptusePct_sort = _.sortBy(result.data.dptuse_pct, function(sort) {
        return -sort.use_percent;
      });
      if (dptusePct_sort.length < 7) {
        lack_length = 7 -  dptusePct_sort.length;
        _(lack_length).times(function(n){
          dptusePct_sort.unshift({
            departments_name: '',
            use_percent: 0
          });
        });
      }
      else {
        dptusePct_sort = dptusePct_sort.slice(dptusePct_sort.length -7, dptusePct_sort.length);
      }
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
      ECHARTS_FUNC.horizontal_bar_echarts('offices-use', dptuse_data);
      result = null, dptuse_data = null, lack_length = null, dptusePct_sort = null, dptuse_min = null, dptuse_color = null,
          x1_value = null;
    }
  },

  engineerStatus_ajax: function() {
    var url = '<%=base%>' + engineerStatusUrl;
    COMMON_FUNC.ajax_get(url, {}, '', function(result) {
      if (result.success) {
        localStorage.setItem('engineerStatus', JSON.stringify(result));
        INDEX.engineerStatus_apply(result);
         url = null;
      }
    })
  },

  engineerStatus_apply: function(result) {
    if (result.success) {
      var $medical_info_box = $('#medical_info_box');
      var  $medical_tpl, $medical_info_line, $parent, height;
      clearInterval(GVR.INTERVAL.info_setInterval);
      GVR.INTERVAL.info_setInterval = null;
      $medical_info_box.html('');
      _.each(result.data[0], function(me_info_first) {
        me_info_first.resp_avg = me_info_first.resp_avg < 0 ? 0 : parseFloat(me_info_first.resp_avg.toFixed(2));
        me_info_first.fix_avg = me_info_first.fix_avg < 0 ? 0 : parseFloat(me_info_first.fix_avg.toFixed(2));
        $medical_tpl = $(INDEX.medical_tpl(me_info_first));
        $medical_info_box.append($medical_tpl);
      });
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
      url = null, $medical_info_box = null, result = null,
          $medical_tpl = null;
    }
  },

  device_num_total: function($ele, num) {
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
        str_num = INDEX.switch_num(num);
        $deviceNumBg.each(function(index, dom) {
          html_num = str_num.slice(index, index + 1);
          $(dom).html(html_num);
          html_num = null;
        });
        start = null, str_num = null, num_clear = null, $ele = null, num = null, $deviceNumBg = null;
        return false;
      }
      start = parseInt(start) + 80;
      str_num = INDEX.switch_num(start);
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
  INDEX.ready_init();
  if (!window.medatc) {
    $(window).resize(function() {
      INDEX.resize_dp();
    });
  }
})
;