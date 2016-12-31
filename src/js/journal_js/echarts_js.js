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
        itemWidth: 14,
        itemGap: 5,
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
    myChart.setOption(option);
  },

  status_pie: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
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
        left:'center'
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
                fontWeight: 'bold',
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              color: 'transparent',
            }
          }
        }],
        animation: false


      },{
        type: 'pie',
        radius: ['0%', '55%'],
        silent: true,
        label: {
          normal: {
            show: false
          }
        },

        data: [{
          itemStyle: {
            normal: {
              color: 'rgba(14,22, 28, 0.7)'
            }
          }
        }],

        animation: false
      },

        {
          type: 'pie',
          radius: ['65%', '70%'],
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
      radius: ['65%', '70%'],
      label: {
        normal: {
          show: true,
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
    if(data.two_percent) {
      var two_json = {
        name: 'main_two',
        type: 'pie',
        radius: ['65%', '70%'],
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
    myChart.setOption(option);
  },

  bar_status: function(dom_id, data) {
    var label_bon = false;
    var max = 100;
    if (data.status) {
      label_bon = true;
      max = 'auto';
      var legend = {
        data: ['搜索引擎', '直接访问'],
        align: 'left',
        left:'right',
        textStyle: {
          color:'#9fa0a0'
        }
      }
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
        top:'10%',
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
      name:'直问',
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
            return data.y2[params.dataIndex];
          },
          textStyle: {
            color:'#9fa0a0'
          }
        }
      },
      data:data.y1
    };
    var bar2_json = {
      name:'直接访问',
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
      name:'搜索引擎',
      type:'line',
      stack: '总量',
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
          width: 1
        }
      },
      data:data.y1
    };
    if(data.status) {
      option.series.push(line_json);
      option.legend = legend;
    }
    else {
      option.series.push(bar1_json);
    }
    option.series.push(bar2_json);
    myChart.setOption(option);
  },

  accumulate_echarts: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      color: ['#71c8d9'],
      tooltip : {
        trigger: 'axis'
      },
      grid: {
        top: '10%',
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
          name:'搜索引擎',
          type:'line',
          stack: '总量',
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
          data:data.y
        }
      ]
    };
    myChart.setOption(option);
  },

  horizontal_bar_echarts: function(dom_id, data) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var option = {
      backgroundColor: 'rgba(23,41,135,.1)',
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top:'5%',
        left: '3%',
        right: '10%',
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
          name: '台',
          nameTextStyle:{
            color:'#9fa0a0'
          },
          position: 'top',
          axisTick: {
            show:false
          },
          axisLabel: {
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
          name: '%',
          nameTextStyle:{
            color:'#9fa0a0'
          },
          min: 0,
          max: 100,
          position: 'bottom',
          axisTick: {
            show:false
          },
          axisLabel: {
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
              position: 'top',
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
          symbolSize:10,
          xAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: function(params) {
                return params.value + '%'
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
          data:data.x3
        }
      ]
    };
    myChart.setOption(option);
  }
};

$(function() {

})
;