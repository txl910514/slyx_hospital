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
      switch (timing_renovate) {
        case '21:00:00':
          location.reload(true);
          break;
        case '00:00:00':
          location.reload(true);
          break;
        case '03:00:00':
          location.reload(true);
          break;
        case '06:00:00':
          location.reload(true);
          break;
      }
      time_text = null, local_time = null, hour = null, min = null, year = null, month = null, date = null,
          timing_renovate = null, second = null;
      setTimeout(getTime_func, 1000);
    }
    getTime_func();
  },

  ajax_get: function(url, data, jsonpCall, callback){
    var dataType= jsonpCall ? 'jsonp': 'json';
    $.ajax({
      url:url,
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      dataType: dataType,
      data: data,
      jsonp: 'callback',
      jsonpCallback: jsonpCall,
      success: function(json) {
        if(json.message === 'LOGIN') {
          window.location.href = 'user-login.html';
          return false;
        }
        if(!json.success) {
          return false;
        }
        if(typeof callback === 'function') {
          callback(json);
        }
      }
    })
  }

};

$(function() {
  COMMON_FUNC.ready_init();
})
;