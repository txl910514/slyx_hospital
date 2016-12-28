/**
 * Created by tangxl on 16-12-6.
 */
;
var ECHARTS_FUNC = {
  pie_echarts: function(dom_id) {

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
        data:[
          {
            name: '直接访问',
            icon: 'roundRect',
            textStyle: {

            }
          },
          {
            name: '邮件营销',
            icon: 'roundRect',
            textStyle: {

            }
          },
          {
            name: '联盟广告',
            icon: 'roundRect',
            textStyle: {

            }
          },
          {
            name: '视频广告',
            icon: 'roundRect',
            textStyle: {

            }
          },
          {
            name: '搜索引擎',
            icon: 'roundRect',
            textStyle: {

            }
          }
        ]
      },
      series: [
        {
          name:'访问来源',
          type:'pie',
          radius: ['50%', '80%'],
          center: ['30%', '50%'],
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
          data:[
            {value:335, name:'直接访问'},
            {value:310, name:'邮件营销'},
            {value:234, name:'联盟广告'},
            {value:135, name:'视频广告'},
            {value:1548, name:'搜索引擎'}
          ]
        }
      ],
      color:['#71c7d3', '#5fb384', '#89b663', '#b0bb57', '#d9bb44', '#f8b623']
    };
    myChart.setOption(option);
  },

  status_pie: function(dom_id) {
    var myChart = echarts.init(document.getElementById(dom_id));
    var percent = 0.7;

    function getData() {
      return [{
        value: percent,
        itemStyle: {
          normal: {
            color: '#70c8c9',
          }
        }
      }, {
        value: 1 - percent,
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        }
      }];
    }

    var option = {
      series: [{
        type: 'pie',
        radius: ['0%', '60%'],
        silent: true,
        label: {
          normal: {
            show: false
          }
        },

        data: [{
          itemStyle: {
            normal: {
              color: 'rgba(14,22, 28, 0.5)'
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
        },
        {
          name: 'main',
          type: 'pie',
          radius: ['65%', '70%'],
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function (a) {
                console.log(a);
                return a.percent + '台';
              }
            }
          },
          data: getData(),

          animationEasingUpdate: 'cubicInOut',
          animationDurationUpdate: 500
        }
      ]
    };

    myChart.setOption(option);
  },

  bar_status: function(dom_id) {
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
          data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          axisLabel: {
            show:false
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
              textStyle: {
                color:'#9fa0a0'
              }
            }
          },
          data:[390, 390, 390, 390, 390, 390, 390]
        },
        {
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
          data:[10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };
    myChart.setOption(option);
  },

  accumulate_echarts: function(dom_id) {
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
          data : ['周一','周二','周三','周四','周五','周六','周日'],
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
          data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    };
    myChart.setOption(option);
  },

  horizontal_bar_echarts: function(dom_id) {
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
          data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            show: false
          }
        }
      ],
      xAxis : [
        {
          type : 'value',
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
          },
          splitArea: {
            show:true,
            areaStyle: {
              color: ['rgba(51,61,81,0.2)', 'rgba(51,61,81,0.4)']
            }
          }
        },
        {
          type: 'value',
          name: '使用比例',
          min: 0,
          max: 250,
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
              show: false,
              position: 'top',
              textStyle: {
                color:'#9fa0a0'
              }
            }
          },
          data:[390, 390, 390, 390, 390, 390, 390]
        },
        {
          name:'直接访问',
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
          data:[10, 52, 200, 334, 390, 330, 220]
        },
        {
          name:'比例',
          type:'line',
          symbol: 'circle',
          symbolSize:10,
          xAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: 'right',
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
          data:[26.0, 92.2, 123.3, 84.5, 212.3, 50.2, 90.3]
        }
      ]
    };
    myChart.setOption(option);
  }
};

$(function() {

})
;