/**
 * Created by tangxl on 16-12-6.
 */
var COMMON_FUNC = {
  ready_init: function() {
    var self = this;
    self.get_time();
    var code = self.search_location('code');
    self.setCookie('code', code, '/s/yybd', '121.42.187.170' );
    self.setCookie('code', code, '/cookie_home', '121.42.187.170' );
    self = null, code = null;
  },

  setCookie: function(name, value, path, domain) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";path="+ path +";domain=" +domain;
    Days = null, exp = null;
  },

  search_location: function(key) {
    return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  },

  get_time: function() {
    var $jsHourText = $('#js-hour-text');
    var $jsMinText = $('#js-min-text');
    var $jsYearText = $('#js-year-text');
    var time_text, local_time, hour, min, year, month, date, timing_renovate, second;
    function getTime_func() {
      local_time = new Date();
      hour = local_time.getHours();
      min = local_time.getMinutes();
      second = local_time.getSeconds();
      year = local_time.getFullYear();
      month = local_time.getMonth()+1;
      date = local_time.getDate();
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      second = second < 10 ? '0' + second : second;
      month = month < 10 ? '0' + month : month;
      date = date < 10 ? '0' + date : date;
      time_text = year + '年' + month + '月' + date + '日';
      $jsHourText.text(hour);
      $jsMinText.text(min);
      $jsYearText.text(time_text);
      timing_renovate = hour + ':' + min + ':' + second;
      console.log(timing_renovate === '15:54:00');
      console.log(timing_renovate);
      switch (timing_renovate) {
        case '21:00:00':
          location.reload();
          break;
        case '00:00':
          location.reload();
          break;
        case '03:00':
          location.reload();
          break;
        case '06:00':
          location.reload();
          break;
      }
      time_text = null, local_time = null, hour = null, min = null, year = null, month = null, date = null;
      setTimeout(getTime_func, 1000);
    }
    getTime_func();
  },

  ajax_get: function($obj, data, url, jsonp_name, error_callback, callback){
    /*
     ajax get通用方法
     参数：
     $obj: 触发GET事件的元数对象，一般为a标签或button。
     data (可选): 往URL上附加的额外参数。
     url (可选): GET请求的URL路径，不传会从$obj对象上获取url属性，没有url属性时默认用当前路径.
     error_callback (可选): 异常时的回调函数
     callback: 成功时的回调函数
     */
    var args = Array.prototype.slice.call(arguments);
    var _callback = args.slice(-1)[0];
    error_callback = null;
    if(_.isFunction(_callback)){
      callback = args.pop();
      var _error_callback = args.slice(-1)[0];
      if(_.isFunction(_error_callback)){
        error_callback =  args.pop();
      }
      $obj = args[0];
      data = args[1];
      url = args[2];
      jsonp_name = args[3];
    }
    if($obj.hasClass('disabled')){
    }
    else{
      $obj.addClass('disabled');
      data = data || {};
      url = url || $obj.attr('url') || '.';
      jsonp_name = jsonp_name || $obj.attr('jsonp-callback');
      return $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType:'JSONP',
        jsonp: 'callback',
        jsonpCallback:jsonp_name,
        success: function(result){
          if(result.url){
            window.location.href = result.url;
            return false;
          }
          $obj.removeClass('disabled');
          if(_.isFunction(callback)){
            callback(result);
          }
          $obj = null, data = null, url = null, jsonp_name = null, error_callback = null, callback = null,
              args = null, _callback = null, _error_callback = null;
        },
        error: function(xhr, msg, error){
          if(msg === "error"){
            if(xhr.status === 404){
              console.info("无效的数据");
            }
            else if(xhr.status === 500){
              console.info("服务器异常，请联系管理员");
            }
            else if(xhr.status === 403){
              console.info("登录已过期或没有访问权限");
            }
            else{
              console.info("网络异常，请稍后再试");
            }
          }
          else{
            if(msg){
              console.log(msg);
            }
          }
          if(_.isFunction(error_callback)){
            error_callback();
          };
          $obj.removeClass('disabled');
        },
        complete: function(XHR, TS) {
          XHR = null;
        }
      });
    }
    return false;
  }

};

$(function() {
  COMMON_FUNC.ready_init();
})
;