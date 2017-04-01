/**
 * Created by tangxl on 16-12-6.
 */
;
var ECHARTS_FUNC = {
  status_pie: function(dom_id, data) {
    if (GVR.ECHARTS[dom_id]) {
      GVR.ECHARTS[dom_id].dispose();
      GVR.ECHARTS[dom_id] = null;
    }
    var myChart = echarts.init(document.getElementById(dom_id));
    var center_font = 12;
    var body_width  = $(window).width();
    var body_height = $(window).height();
    if (body_width < 1280) {
      if (dom_id === 'wait-status' || dom_id === 'repair-status' || dom_id === 'overtime-status')
      data.unit = '';
    }
    if (!data.name) {
      center_font = 12;
    }
    function getData() {
      return [{
        value: data.percent,
        itemStyle: {
          normal: {
            color: '#70c8c9',
          }
        }
      }, {
        value: 1 - data.percent,
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        }
      }];
    }

    var option = {
      title: {
        text: data.status_name,
        textStyle: {
          color: '#fff',
          fontSize: 10
        },
        left:'center',
      },
      series: [{
        type: 'pie',
        radius: ['0%', '50%'],
        center:['50%', '90%'],
        silent: true,
        label: {
          normal: {
            show: true
          }
        },
        data: [{
          name: data.name,
          label: {
            normal: {
              position: 'center',
              show: true,
              textStyle: {
                fontSize: 10,
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              color: 'transparent'
            }
          }
        }],
        animation: false


      },{
        type: 'pie',
        radius: ['0%', '50%'],
        silent: true,
        label: {
          normal: {
            show: false
          }
        },

        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: 'rgba(51,61,81,0.5)'
            }
          }
        }],

        animation: false
      },

        {
          type: 'pie',
          radius: ['60%', '65%'],
          silent: true,
          label: {
            normal: {
              show: false,
            }
          },

          data: [{
            value: 1,
            itemStyle: {
              normal: {
                color: '#1e2122'
              }
            }
          }],

          animation: false
        }
      ]
    };
    var one_json =  {
      name: 'main',
      type: 'pie',
      radius: ['60%', '65%'],
      label: {
        normal: {
          show: false,
          textStyle: {
            fontSize: 10
          },
          position: 'center',
          formatter: function (a) {
            return data.num + data.unit;
          }
        }
      },
      data: getData(),

      animationEasingUpdate: 'cubicInOut',
      animationDurationUpdate: 500
    };
    var text_json =  {
      name: 'text',
      type: 'pie',
      radius: ['0%', '100%'],
      label: {
        normal: {
          show: true,
          textStyle: {
            color:'#70c8c9',
            fontSize: center_font
          },
          position: 'center',
          formatter: function (a) {
            return data.num + data.unit;
          }
        }
      },
      data:[{
        value: 1,
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        }
      }],

      animationEasingUpdate: 'cubicInOut',
      animationDurationUpdate: 500
    };
    if(data.two_percent) {
      var two_number;
      if(isNaN(Number(data.two_percent))) {
        two_number = 0;
      }
      else {
        two_number = data.two_percent;
      }
      var two_json = {
        name: 'main_two',
        type: 'pie',
        radius: ['60%', '65%'],
        label: {
          normal: {
            show: false
          }
        },
        data: [{
          value: two_number,
          itemStyle: {
            normal: {
              color: '#284651'
            }
          }
        }, {
          value: 1 - two_number,
          itemStyle: {
            normal: {
              color: 'transparent'
            }
          }
        }],

        animationEasingUpdate: 'cubicInOut',
        animationDurationUpdate: 500
      };
      option.series.push(two_json);
    }
    option.series.push(one_json);
    option.series.push(text_json);
    if (body_width <= 1366 && body_width > 1280 ) {
      option.title.top = '-6%';
      if (data.two_percent) {
        option.title.top = '6%';
        option.series[0].center = ['50%', '110%'];
      }
    }
    else if (body_width <= 1280) {
      option.title.top = '-5%';
      if (data.two_percent) {
        option.series[0].center = ['50%', '110%'];
      }
    }
    else {
      if (data.two_percent) {
        option.title.top = '18%';
        option.series[0].center = ['50%', '80%'];
      }
    }
    option.series[0].center = ['50%', '60%'];
    option.series[1].center = ['50%', '60%'];
    option.series[2].center = ['50%', '60%'];
    option.series[3].center = ['50%', '60%'];
    option.series[4].center = ['50%', '60%'];
    option.title.top = '6%';
    if (body_height < 800 && body_height >= 650) {
      option.title.top = '1%';
    }
    else if (body_height < 650 && body_height >= 500) {
      option.title.top = '-5.5%';
      option.series[0].center = ['50%', '65%'];
      option.series[1].center = ['50%', '65%'];
      option.series[2].center = ['50%', '65%'];
      option.series[3].center = ['50%', '65%'];
      option.series[4].center = ['50%', '65%'];
    }
    else if (body_height < 500) {
      option.title.top = '-8%';
      option.series[0].center = ['50%', '70%'];
      option.series[1].center = ['50%', '70%'];
      option.series[2].center = ['50%', '70%'];
      option.series[3].center = ['50%', '70%'];
      option.series[4].center = ['50%', '70%'];
    }
    myChart.setOption(option);
    GVR.ECHARTS[dom_id] = myChart;
    myChart = null, center_font = null, body_width = null, body_height = null,  max = null, option = null, data = null,
        dom_id = null, one_json = null, text_json = null, two_number = null, two_json = null;
  },

  bar_status: function(dom_id, data) {
    if (GVR.ECHARTS[dom_id]) {
      GVR.ECHARTS[dom_id].dispose();
      GVR.ECHARTS[dom_id] = null;
    }
    var label_bon = false;
    var max = 'auto';
    var max_number1 = _.max(data.y1);
    var max_number2 = _.max(data.y2);
    var grid_top = '10%';
    var grid_left = '3%';
    var lend_show = true;
    var body_width  = $(window).width();
    var body_height  = $(window).height();
    var lend_top = 'auto';
    if (body_width <= 1366) {
      grid_top = '15%'
    }
    if (body_width < 890) {
      lend_show = false;
    }
    if (max_number1<4 && max_number2 < 4) {
      max = 4;
    }
    if (data.status) {
      label_bon = true;
      if (body_height < 500) {
        lend_top = '-5%';
      }
      var legend = {
        show: lend_show,
        data: data.legend_data,
        align: 'left',
        left:'right',
        top:lend_top,
        textStyle: {
          color:'#cfeaf0'
        },
        itemHeight: 9
      }
    }
    else {
      grid_left = '0%';
    }
    var myChart = echarts.init(document.getElementById(dom_id));
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      color: ['#3398DB'],
      tooltip : {
        show: false,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top:grid_top,
        left: grid_left,
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          splitLine:{
            show:false
          },
          axisLabel: {
            interval:0,
            textStyle: {
              color:'#cfeaf0'
            }
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.5)']
            }
          },
          data : data.x,
          axisTick: {
            show: false
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          name: data.unit,
          max:max,
          nameTextStyle:{
            color:'#cfeaf0'
          },
          nameGap:5,
          axisTick: {
            show:false
          },
          axisLabel: {
            show:label_bon,
            textStyle: {
              color:'#cfeaf0'
            }
          },
          splitLine:{
            show:false
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.4)']
            }
          }
        }
      ],
      series : [

      ]
    };
    var bar1_json = {
      name:data.legend_data[0],
      type:'bar',
      barWidth: '30%',
      itemStyle: {
        normal: {
          barBorderRadius: [3,3, 0, 0],
          color:'#1b3e4f'
        }
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: function(params) {
            return data.y2[params.dataIndex] + '%';
          },
          textStyle: {
            color:'#cfeaf0'
          }
        }
      },
      data:data.y1
    };
    var bar2_json = {
      name:data.legend_data[0],
      type:'bar',
      barWidth: '30%',
      barGap:'-100%',
      barCategoryGap:'40%',
      itemStyle: {
        normal: {
          barBorderRadius: [3,3, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: 'rgba(113, 200, 217,1)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(113, 200, 217,0)' // 100% 处的颜色
          }], false)
        }
      },
      data:data.y2
    };
    var line_json = {
      name:data.legend_data[0],
      type:'line',
      symbol: 'circle',
      symbolSize:5,
      label: {
        normal: {
          show: false,
          position: 'top'
        }
      },
      itemStyle: {
        normal: {
          color:'#f39800',
          shadowColor:'rgba(0,0,0,0.5)',
          shadowBlur:5
        }
      },
      lineStyle: {
        normal: {
          color:'rgba(113, 200, 217,1)',
          width: 1
        }
      },
      smooth: true,
      data:data.y1
    };
    var tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        return params[1].name + '<br/>' + params[1].seriesName + ':' + params[1].value;
      }
    };
    if(data.status) {
      option.series.push(line_json);
      option.legend = legend;
      bar2_json.name = data.legend_data[1];
    }
    else {
      option.tooltip = tooltip;
      option.series.push(bar1_json);
    }
    option.series.push(bar2_json);
    if (!(max_number1<4 && max_number2 < 4)) {
      delete option.yAxis[0].max;
    }
    myChart.setOption(option);
    GVR.ECHARTS[dom_id] = myChart;
    myChart = null, grid_top = null, body_width = null, max = null, option = null, data = null, dom_id = null,
        label_bon = null, max_number1 = null, max_number2 = null, grid_left = null, lend_show = null, bar1_json = null,
        bar2_json = null, line_json = null, tooltip = null;
  },

  accumulate_echarts: function(dom_id, data) {
    if (GVR.ECHARTS[dom_id]) {
      GVR.ECHARTS[dom_id].dispose();
      GVR.ECHARTS[dom_id] = null;
    }
    var myChart = echarts.init(document.getElementById(dom_id));
    var grid_top = '10%';
    var body_width  = $(window).width();
    var max_number = _.max(data.y);
    var max = 'auto';
    if (max_number < 4) {
      max = 4;
    }
    if (body_width <= 1366) {
      grid_top = '15%'
    }
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      color: ['#71c8d9'],
      tooltip : {
        show: false,
        trigger: 'axis'
      },
      grid: {
        top: grid_top,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          splitLine:{
            show:false
          },
          axisLabel: {
            interval:0,
            textStyle: {
              color:'#cfeaf0'
            }
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.5)']
            }
          },
          data : data.x,
          axisTick: {
            show: false
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          max:max,
          name: data.unit,
          nameTextStyle:{
            color:'#cfeaf0'
          },
          nameGap:5,
          axisTick: {
            show:false
          },
          splitLine:{
            show:false
          },
          axisLabel: {
            textStyle: {
              color:'#cfeaf0'
            }
          },
          splitArea: {
            show:false,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.4)']
            }
          }
        }
      ],
      series : [
        {
          name: data.name,
          type:'line',
          symbol: 'circle',
          symbolSize:5,
          label: {
            normal: {
              show: false,
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              color:'#71c8d9',
              shadowColor:'rgba(0,0,0,0.5)',
              shadowBlur:5
            }
          },
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 1, color: 'rgba(113, 200, 217, 0)' // 0% 处的颜色
              }, {
                offset: 0, color: 'rgba(113, 200, 217, 1)' // 100% 处的颜色
              }], false)
            }
          },
          smooth: true,
          data:data.y
        }
      ]
    };
    if (!(max_number < 4)) {
      delete option.yAxis[0].max;
    }
    myChart.setOption(option);
    GVR.ECHARTS[dom_id] = myChart;
    myChart = null, grid_top = null, body_width = null, max = null, max_number = null,
        option = null, data = null, dom_id = null;
  },

  horizontal_bar_echarts: function(dom_id, data) {
    if (GVR.ECHARTS[dom_id]) {
      GVR.ECHARTS[dom_id].dispose();
      GVR.ECHARTS[dom_id] = null;
    }
    var myChart = echarts.init(document.getElementById(dom_id));
    var body_width = $(window).width();
    var label_bon = true;
    var font_size = 12;
    var max = 'auto';
    var max_number = _.max(data.x1);
    if (max_number < 4) {
      max = 4;
    }
    if(data.status) {
      label_bon = false;
    }
    if (body_width < 1280) {
      if (dom_id === 'life-echarts') {
        var total_num = _.max(data.x1);
        if(total_num >= 100) {
          label_bon = false;
          data.unit = '';
        }
      }
    }
    else if(body_width < 800) {
      font_size = 0.8;
    }
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      tooltip : {
        show: false,
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top:'2%',
        left: '1%',
        right: '18%',
        bottom: '5%',
        containLabel: true
      },
      yAxis : [
        {
          type : 'category',
          splitLine:{
            show:false
          },
          axisLabel: {
            margin:3,
            textStyle: {
              color:'#cfeaf0',
              fontSize: font_size
            }
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.5)']
            }
          },
          data : data.y,
          axisTick: {
            show: false
          }
        }
      ],
      xAxis : [
        {
          type : 'value',
          name: data.unit,
          max: max,
          nameTextStyle:{
            color:'#cfeaf0'
          },
          position: 'bottom',
          axisTick: {
            show:false
          },
          axisLabel: {
            show:label_bon,
            margin:3,
            textStyle: {
              color:'#cfeaf0',
              fontSize: font_size
            }
          },
          splitLine:{
            show:false
          }
        },
        {
          type: 'value',
          nameTextStyle:{
            color:'#cfeaf0'
          },
          min: 0,
          max: 100,
          position: 'top',
          axisTick: {
            show:false
          },
          axisLabel: {
            show:false,
            margin:2,
            textStyle: {
              color:'#cfeaf0',
              fontSize: font_size
            }
          },
          splitLine:{
            show:false
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.4)']
            }
          }
        }
      ],
      series : [
        {
          name:'设备总数',
          type:'bar',
          barWidth: '30%',
          itemStyle: {
            normal: {
              barBorderRadius: [0,3, 3, 0],
              color:'#1b3e4f'
            }
          },
          label: {
            normal: {
              show: false,
              position: 'right',
              formatter: function(params) {
                return data.x2[params.dataIndex] + '%';
              },
              textStyle: {
                color:'#cfeaf0',
                fontSize: font_size
              }
            }
          },
          data:data.x1
        },
        {
          name:'在用设备',
          type:'bar',
          barWidth: '30%',
          barGap:'-100%',
          barCategoryGap:'40%',
          itemStyle: {
            normal: {
              barBorderRadius: [0,3, 3, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0, color: 'rgba(113, 200, 217,0)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(113, 200, 217,1)' // 100% 处的颜色
              }], false)
            }
          },
          data:data.x2
        },
        {
          name:'在用设备比例',
          type:'line',
          symbol: 'circle',
          symbolSize:5,
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: function(params) {
                if (dom_id === 'high-value-echarts' || dom_id === 'life-echarts') {
                  if (data.x1[params.dataIndex]) {
                    return data.x3[params.dataIndex] + '%';
                  }
                  else {
                    return '';
                  }
                }
                else {
                  return data.x3[params.dataIndex] + '%';
                }

              },
              textStyle: {
                color:'#cfeaf0',
                fontSize: font_size
              }
            }
          },
          itemStyle: {
            normal: {
              color:'#71c8d9',
              shadowColor:'rgba(0,0,0,0.5)',
              shadowBlur:5
            }
          },
          lineStyle: {
            normal: {
              width: 0
            }
          },
          data:data.label
        }
      ]
    };
    if (!(max_number < 4) || dom_id === 'offices-use') {
      delete  option.xAxis[0].max;
    }
    myChart.setOption(option);
    GVR.ECHARTS[dom_id] = myChart;
    myChart = null, body_width = null, label_bon = null, font_size = null, max = null, max_number = null,
    option = null, dom_id = null, data = null;
  }
};

$(function() {

})
;