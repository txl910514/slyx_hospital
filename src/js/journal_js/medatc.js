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
          GVR.ONLINE = true;
          if (version_change) {
            COMMON_FUNC.get_url();
            version_change = null;
          }
          else {
            INDEX.WebSocket_dp();
          }
        }
        else {
          GVR.ONLINE = false;
          COMMON_FUNC.close_socket();
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
      if (online_network === 'connected') {
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