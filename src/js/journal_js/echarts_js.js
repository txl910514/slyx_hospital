/**
 * Created by tangxl on 16-12-6.
 */
;
var ECHARTS_FUNC = {
  pie_echarts: function(dom_id, data) {

    var myChart = echarts.init(document.getElementById(dom_id));
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'right',
        y: 'bottom',
        itemWidth: 13,
        itemHeight: 13,
        itemGap: 4,
        align:'left',
        textStyle: {
          color: '#fff'
        },
        data:data.data
      },
      series: [
        {
          name:data.name,
          type:'pie',
          radius: ['50%', '80%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:data.series_data
        }
      ],
      color:['#71c7d3', '#5fb384', '#89b663', '#b0bb57', '#d9bb44', '#f8b623']
    };
    var body_width  = $(window).width();
    if (body_width <= 1366) {
      option.legend.itemGap = 1;
    }
    myChart.setOption(option);
  },

  status_pie: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var center_font = 12;
    if (!data.name) {
      center_font = 14;
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
          fontSize: 12
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
                fontSize: '12',
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
          itemStyle: {
            normal: {
              color: 'rgba(14, 22, 28, 0.8)'
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
            fontSize: 16
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
          value: data.two_percent,
          itemStyle: {
            normal: {
              color: '#284651'
            }
          }
        }, {
          value: 1 - data.two_percent,
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
    var body_width  = $(window).width();
    if (body_width <= 1366) {
      option.title.top = '-6%';
      if (data.two_percent) {
        option.title.top = '6%';
        option.series[0].center = ['50%', '110%'];
      }
    }
    else {
      if (data.two_percent) {
        option.title.top = '18%';
        option.series[0].center = ['50%', '80%'];
      }
    }
    myChart.setOption(option);
  },

  bar_status: function(dom_id, data) {
    var label_bon = false;
    var max = 100;
    var grid_top = '10%';
    var grid_left = '3%';
    var body_width  = $(window).width();
    if (body_width <= 1366) {
      grid_top = '15%'
    }
    if (data.status) {
      label_bon = true;
      max = 'auto';
      var legend = {
        data: data.legend_data,
        align: 'left',
        left:'right',
        textStyle: {
          color:'#9fa0a0'
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
            textStyle: {
              color:'#9fa0a0'
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
          nameTextStyle:{
            color:'#9fa0a0'
          },
          nameGap:5,
          min: 0,
          max: max,
          axisTick: {
            show:false
          },
          axisLabel: {
            show:label_bon,
            textStyle: {
              color:'#9fa0a0'
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
            color:'#9fa0a0'
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
    if(data.status) {
      option.series.push(line_json);
      option.legend = legend;
      bar2_json.name = data.legend_data[1];
    }
    else {
      var tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          return params[1].name + '<br/>' + params[1].seriesName + ':' + params[1].value;
        }
      };
      option.tooltip = tooltip;
      option.series.push(bar1_json);
    }
    option.series.push(bar2_json);
    myChart.setOption(option);
  },

  accumulate_echarts: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var grid_top = '10%';
    var body_width  = $(window).width();
    if (body_width <= 1366) {
      grid_top = '15%'
    }
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      color: ['#71c8d9'],
      tooltip : {
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
            textStyle: {
              color:'#9fa0a0'
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
          nameTextStyle:{
            color:'#9fa0a0'
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
              color:'#9fa0a0'
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
    myChart.setOption(option);
  },

  horizontal_bar_echarts: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var label_bon = true;
    if(data.status) {
      label_bon = false;
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
        top:'5%',
        left: '3%',
        right: '12%',
        bottom: '3%',
        containLabel: true
      },
      yAxis : [
        {
          type : 'category',
          splitLine:{
            show:false
          },
          axisLabel: {
            textStyle: {
              color:'#9fa0a0'
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
          nameTextStyle:{
            color:'#9fa0a0'
          },
          position: 'bottom',
          axisTick: {
            show:false
          },
          axisLabel: {
            show:label_bon,
            textStyle: {
              color:'#9fa0a0'
            }
          },
          splitLine:{
            show:false
          }
        },
        {
          type: 'value',
          nameTextStyle:{
            color:'#9fa0a0'
          },
          min: 0,
          max: 100,
          position: 'top',
          axisTick: {
            show:false
          },
          axisLabel: {
            show:false,
            textStyle: {
              color:'#9fa0a0'
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
                color:'#9fa0a0'
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
                return data.x3[params.dataIndex] + '%';
              },
              textStyle: {
                color:'#9fa0a0'
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
    myChart.setOption(option);
  }
};

$(function() {

})
;