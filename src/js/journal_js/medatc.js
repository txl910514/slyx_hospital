/**
 * Created by txl on 17-4-6.
 */
;
var online_network;
var version_change;
var MEDATC_FUNC = {
  ready_init: function() {
    if (window.medatc) {
      window.medatc.onNetworkStatusChanged = function(status) {
        if (status === 'connected') {
          if (version_change) {
            COMMON_FUNC.get_url();
            version_change = null;
          }
        }
      };
    }
  },

  hideLoading: function() {
    if (window.medatc) {
      window.medatc.hideLoading();
    }
  },

  getNetworkStatus: function(version,callback) {
    if(window.medatc) {
      online_network = window.medatc.getNetworkStatus();
      if (online_network) {
        version_change = null;
        if (typeof callback === 'function') {
          callback();
        }
      }
      else {
        if (version) {
          version_change = version;
        }
      }
    }
    else {
      callback();
    }
  }
};

$(function(){
  MEDATC_FUNC.ready_init();
})
;