/**
 * Created by tangxl on 16-12-6.
 */
GVR.JSON.area_json = {
  db: ['东北','黑龙江','吉林', '辽宁'],
  hb: ['华北','北京', '河北', '内蒙古', '天津'],
  hd: ['华东','安徽', '江苏', '山东', '上海','浙江'],
  hn: ['华南', '广东', '广西', '海南'],
  hz: ['华中', '福建', '湖北', '湖南', '江西'],
  xb: ['西北','甘肃', '河南', '宁夏', '青海', '山西', '陕西', '新疆'],
  xn: ['西南','贵州', '四川', '西藏', '云南','重庆']
};
GVR.JSON.provinceArray = ['黑龙江','吉林', '辽宁', '北京', '河北',
  '内蒙古', '天津','安徽', '江苏', '山东', '上海','浙江','广东', '广西', '海南',
  '福建', '湖北', '湖南', '江西', '甘肃', '河南', '宁夏', '青海', '山西', '陕西', '新疆',
  '贵州', '四川', '西藏', '云南','重庆', '台湾', '香港', '澳门'];
GVR.JSON.provinceJson = ['heilongjiang','jilin', 'liaoning', 'beijing', 'hebei',
  'neimenggu', 'tianjin','anhui', 'jiangsu', 'shandong', 'shanghai','zhejiang',
  'guangdong', 'guangxi', 'hainan', 'fujian', 'hubei', 'hunan', 'jiangxi', 'gansu',
  'henan', 'ningxia', 'qinghai', 'shanxi', 'shanxi1', 'xinjiang', 'guizhou', 'sichuan',
  'xizang', 'yunnan','chongqing', 'tw', 'xianggang', 'aomen'];
var COMMON_FUNC = {
  ready_init: function() {
    var self = this;
    self.get_time();
  },

  get_time: function() {
    function getTime_func() {
      var time_text;
      var local_time = new Date();
      var hour = local_time.getHours();
      var min = local_time.getMinutes();
      var year = local_time.getFullYear();
      var month = local_time.getMonth()+1;
      var date = local_time.getDate();
      hour = hour < 10 ? '0' + hour : hour;
      min = min < 10 ? '0' + min : min;
      month = month < 10 ? '0' + month : month;
      date = date < 10 ? '0' + date : date;
      time_text = year + '年' + month + '月' + date + '日';
      $('#js-hour-text').text(hour);
      $('#js-min-text').text(min);
      $('#js-year-text').text(time_text);
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
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var _callback = args.slice(-1)[0];
    error_callback = null;
    call_back = null;
    if(_.isFunction(_callback)){
      var callback = args.pop();
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
/*      self.full_loading("hide");*/
    }
    else{
      $obj.addClass('disabled');
      var my_date = new Date;
      data = data || {};
/*      $.extend(data, {time: my_date.getTime()});*/
      var url= url || $obj.attr('url') || '.';
      jsonp_name = jsonp_name || $obj.attr('jsonp-callback');
      return $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType:'JSONP',
        jsonp: 'callback',
        jsonpCallback:jsonp_name,
        success: function(result){
          if(result.msg){
            console.log(result.msg);
          }
          $obj.removeClass('disabled');
          if(_.isFunction(callback)){
            callback(result);
          }
          if(result.reload === 1){
            self._reload();
          }
          else if(result.reload === 2){
            self.reload();
          }
          else if(result.reload === 3){
            self._reload(0);
          }
          else if(result.redirect){
            self.redirect(result.redirect);
          }
/*          self.full_loading("hide");*/
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
              self._reload();
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
/*          self.full_loading("hide");*/
        }
      });
    }
    return false;
  },

  ajax_post: function ($obj, data, form, action, error_callback, callback){
    /*
     ajax post通用方法
     参数：
     $obj: form 表单内的一个元素对象，一般为提交按钮或输入框。
     data (可选): 要提交的内容， 不传时会以form序列化内容为准。
     form (可选): form 表单对象，不传时会从$obj找最近的父级form元数
     action (可选): POST请求的url路径，不传时会用form的action属性。
     error_callback (可选): 异常时的回调函数
     callback: 成功时的回调函数
     */
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var _callback = args.slice(-1)[0];
    error_callback = null;
    call_back = null;
    if(_.isFunction(_callback)){
      var callback = args.pop();
      var _error_callback = args.slice(-1)[0];
      if(_.isFunction(_error_callback)){
        error_callback = args.pop();
      }
      $obj = args[0];
      data = args[1];
      form = args[2];
      action = args[3];
    }
    return self._ajax_post($obj, data, form, action, {}, error_callback, callback)
  },

  _ajax_post: function($obj, data, form, action, ajax_options, error_callback, callback){
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    var _callback = args.slice(-1)[0];
    error_callback = null;
    call_back = null;
    if(_.isFunction(_callback)){
      var callback = args.pop();
      var _error_callback = args.slice(-1)[0];
      if(_.isFunction(_error_callback)){
        error_callback =  args.pop();
      }
      $obj = args[0];
      data = args[1];
      form = args[2];
      action = args[3];
      ajax_options= args[4];
    }
    if($obj.hasClass('disabled')){
      self.full_loading("hide");
    }
    else{
      var $form = form || $obj.closest('form');
      console.log($form);
      var action = action || $form.attr("url") || $form.attr('action');
      var empty = false;
      $form.find(".necessary[disabled!='disabled']").each(function(){
        if(!($(this).val())){
          var label = $(this).attr('placeholder')
            || $(this).prev('label').text()
            || $(this).prev('.pl').text()
            || $(this).closest('.control-group').find('label').text();
          label = label.replace(/[：:]/g, "");
          alertify.error(label + '不能为空');
          empty = true;
        }
      });
      if(!empty){
        $obj.addClass('disabled');
        var data = data || $form.serialize();
        var options = {
          type: 'POST',
          url: action,
          data: data,
          headers: {"X-CSRFToken": $.cookie("csrftoken")},
          success: function(result){
            if(result.msg){
              alertify[result.stat](result.msg)
            }
            $obj.removeClass('disabled');
            if(_.isFunction(callback)){
              callback(result);
            }
            if(result.reload === 1){
              self._reload();
            }
            else if(result.reload === 2){
              self.reload();
            }
            else if(result.reload === 3){
              self._reload(0);
            }
            else if(result.redirect){
              self.redirect(result.redirect);
            }
            else if(result.close_modal){
              $(".modal").modal("hide");
            }
            self.full_loading("hide");
          },
          error: function(xhr, msg, error) {
            if(msg === "error"){
              if(xhr.status === 404){
                alertify.error("无效的数据");
              }
              else if(xhr.status === 500){
                alertify.error("服务器异常，请联系管理员");
              }
              else if(xhr.status === 403){
                alertify.error("登录已过期或没有访问权限");
                self._reload();
              }
              else{
                alertify.error("网络异常，请稍后再试");
              }
            }
            else{
              if(msg){
                alertify.error(msg);
              }
            }
            if(_.isFunction(error_callback)){
              error_callback();
            }
            $obj.removeClass('disabled');
            self.full_loading("hide");
          }
        }
        if(_.isObject(ajax_options)){
          _.extend(options, ajax_options);
        }
        return $.ajax(options);
      }
    }
    return false;
  }

};

$(function() {
  COMMON_FUNC.ready_init();
}).on('click', '.img-rotate', function() {
  COMMON_FUNC.area_map($(this));
});