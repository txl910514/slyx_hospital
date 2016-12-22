/**
 * Created by tangxl on 16-12-6.
 */
;
var ECHARTS_FUNC = {
  ready_init: function() {
    var self = this;
    var $map_select_content = $('.map-select-content').html('');
  },

  area_total_map: function(dom_id, file_name, data) {
    var self = this;
    var file_path = 'jslib/area/' + file_name + '.json';
    var reg_file_path = /province_/.test(file_name);
    var province_path = /province_/.test(file_name);
    var china_path = /china/.test(file_name);
    if (reg_file_path) {
      file_name = file_name.replace('province_', '');
      file_path = 'jslib/area/province/' + file_name + '.json';
    }
    $.get(file_path, function(area) {
      echarts.registerMap(file_name, area);
      var myChart = echarts.init(document.getElementById(dom_id));
      var option = {
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip : {
          trigger: 'item',
          formatter: function(params, ticket, callback) {
            if(params.componentType !== 'markPoint') {
              var area = '';
              if (china_path) {
                _.each(GVR.JSON.area_json, function(areaJson, key) {
                  _.each(areaJson, function(area_province) {
                    if (params.name === area_province) {
                      area = areaJson[0] + '地区';
                    }
                  })
                });
                return area + '<br/>医院数量：' + params.value + '家';
              }
              else if(province_path ){
                area = params.name;
                return area;
              }
              else{
                area = params.name;
                if (isNaN(params.value)) {
                  params.value = 0;
                }
                return area + '<br/>医院数量：' + params.value + '家';
              }
            }
          }
        },
        legend: {
          orient: 'vertical',
          y: 'bottom',
          x:'right',
          data:data.lend_data,
          textStyle: {
            color: '#fff'
          },
          selectedMode: 'single',
          selected: data.lend_selected,
          show: false
        },
        series : [
        ],
        color: ['#939fdf', '#f1635e', '#ffc528', '#00d991', '#6bd8ea']
      };
      if (!province_path) {
        var visualMap = {
          min: 0,
          max: data.max,
          left: 10,
          text: ['高','低'],           // 文本，默认为数值文本
          calculable: true,
          itemWidth: 30,
          itemHeight: 180,
          bottom: 10,
          color: ['#00c2eb', '#081218'],
          textStyle: {
            color: '#6bd8ea',
            fontSize: 16
          }
        };
        option.visualMap = visualMap;
      }
      _.each(data.series, function(series_data) {
        var map_data = [
          {
            name: '南海诸岛',value: 0,
            itemStyle:{
              normal: {
                opacity:0,
              }
            }
          }
        ];
        if(china_path) {
          _.each(GVR.JSON.area_json, function(areaJson, json_key) {
            _.each(areaJson, function(json_key_data, data_index) {
              if (data_index !== 0) {
                map_data.push({name: json_key_data, value: series_data.data[0][json_key]})
              }
            })
          });
        }
        else if (province_path) {

        }
        else {
          _.each(series_data.data, function(province_json) {
            _.each(province_json, function(province_value, province_key) {
              map_data.push({name: province_key, value: province_value});
            });
          });
        }
        var series_option = {
          name: series_data.name,
          type: 'map',
          mapType: file_name,
          roam: true,
          showLegendSymbol: false,
          zoom: 1.1,
          data: map_data,
          markPoint: {
            symbol: 'circle',
            symbolSize: 15,
            label: {
              normal: {
                show: false,
                formatter: function(d) {
                  return d.name
                }
              }
            },
            data: series_data.point,
            itemStyle: {
              normal: {
                color: series_data.color
              }
            }
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor:'#1a3741',
              color: '#f4e925',
              borderColor: '#fff'
            },
            emphasis: {
              areaColor:'#6bd8ea',
              borderWidth:0,
              borderColor: 'rgba(0,0,0,0)'
            }
          }
        };
        option.series.push(series_option);
      });
      myChart.on('mouseover', function(area) {
        if (file_name === 'china') {
          _.each(GVR.JSON.provinceArray, function(province) {
            myChart.dispatchAction({
              type: 'mapUnSelect',
              name: province
            })
          });
          if(area.componentType === 'series') {
            _.each(GVR.JSON.area_json, function(areaJson, key) {
              _.each(areaJson, function(area_province) {
                if (area.name === area_province) {
                  _.each(GVR.JSON.area_json[key], function(province_text, province_key) {
                    if (province_key !== 0) {
                      myChart.dispatchAction({
                        type: 'mapSelect',
                        name: province_text
                      })
                    }
                  })
                }
              })
            });
          }
        }

      });
      myChart.on('globalout', function(area) {
        _.each(GVR.JSON.provinceArray, function(province) {
          myChart.dispatchAction({
            type: 'mapUnSelect',
            name: province
          })
        });
      });
      myChart.on('click', function(area) {
        console.log(area);
        if(area.componentType === 'markPoint') {
          var dom = myChart.getDom();
          var dom_left = $(dom).width();
          var dom_top = $(dom).height();
          var $body = $('body');
          $body.find('.hospital-alert').remove();
          var $alert_map_tpl = $(self.alert_map_tpl());
          $alert_map_tpl.find('.hospital-title').css('color', area.color);
          $alert_map_tpl.find('.alert-radius-border').css('border-color', area.color);
          $body.append($alert_map_tpl);
          var alert_height = $alert_map_tpl.height();
          var alert_width = $alert_map_tpl.width();
          var left = area.event.offsetX + alert_width / 8;
          var top = area.event.offsetY - alert_height / 7;
          if ((left + alert_width) > dom_left) {
            left =  area.event.offsetX - alert_width;
          }
          if (top + alert_height > dom_top) {
            top = area.event.offsetY - alert_height*2 / 3;
            left =  area.event.offsetX - alert_width /2 + 11 ;
          } else if (top < 10) {
            top = area.event.offsetY + alert_height*2 / 3 - 25;
            left =  area.event.offsetX - alert_width /2 + 11 ;
          }
          $alert_map_tpl.css({'border-color': area.color, 'left': left +'px', 'top': top + 'px'});
        }
        else {

        }
      });
      myChart.on('mousedown', function(area) {
        var $body = $('body');
        $body.find('.hospital-alert').remove();
      });
      myChart.setOption(option);
      GVR.ECHARTS.AREA_MAP = myChart;
    });
  }
};

$(function() {
  ECHARTS_FUNC.ready_init ();
})
;