/**
 * Created by tangxl on 16-12-6.
 */
var index = {
  ready_init:function() {
    ECHARTS_FUNC.pie_echarts('offices-repair');
    ECHARTS_FUNC.status_pie('wait-status');
    ECHARTS_FUNC.status_pie('repair-status');
    ECHARTS_FUNC.status_pie('closure-status');
    ECHARTS_FUNC.status_pie('overtime-status');
    ECHARTS_FUNC.bar_status('offices-use');
    ECHARTS_FUNC.accumulate_echarts('inspection-echarts');
    ECHARTS_FUNC.accumulate_echarts('hitch-echarts');
    ECHARTS_FUNC.horizontal_bar_echarts('high-value-echarts');
    ECHARTS_FUNC.horizontal_bar_echarts('life-echarts');
    ECHARTS_FUNC.status_pie('total-degree');
    ECHARTS_FUNC.status_pie('mean-answer');
    ECHARTS_FUNC.status_pie('mean-servicing');
  }
};

$(function(){
  index.ready_init();
  $(window).resize(function() {

  });
})
;