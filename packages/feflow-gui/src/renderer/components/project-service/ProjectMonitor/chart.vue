<template>
  <div class="line-echarts">
    <div
      id="lineChart"
      class="line-echarts-ii"
    />
  </div>
</template>

<script>
// 按需加载echarts 参考：https://github.com/apache/incubator-echarts/blob/master/index.js
// 引入基本模板
const echarts = require('echarts/lib/echarts');
// 引入柱状图组件
// require('echarts/lib/chart/bar');
// 引入折线图组件
require('echarts/lib/chart/line');

// 引入提示框
require('echarts/lib/component/tooltip');
// 引入title组件
require('echarts/lib/component/title');
// 引入图标
require('echarts/lib/component/legend');
export default {
  name: 'LineEcharts',
  props: {
    echartData: { // 折线名
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      lineChart: {},
    };
  },
  computed: {
    echartOption() {
      const seriesArr = [];
      console.log(222, this.echartData);
      this.echartData && this.echartData.forEach((item) => {
        seriesArr.push({
          name: item.text,
          type: 'line',
          smooth: true, // 平滑
          itemStyle: {
            normal: {
              color: item.color, // 设置折线折点颜色
              lineStyle: {
                color: item.color, // 设置折线线条颜色
              },
            },
          },
          data: item.dataLsit,
        });
      });

      return {
        title: {
          text: 'PV&UV数据',
          textStyle: {
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          // x: '0px',图标位置
          y: '400px',
          data: this.echartData.map(item => item.text), // 图标名字
        },
        grid: { // echart四边距离
          top: '40px',
          left: '1%',
          right: '2%',
          bottom: '30px',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echartData[0].getXAxis, // 横坐标都一样。故取默认第一个
        },
        yAxis: {
          type: 'value',
        },
        series: seriesArr,
      };
    },
  },
  watch: {
    echartOption(newVal, oldVal) {
      const newOption = JSON.stringify(newVal);
      const oldOption = JSON.stringify(oldVal);
      // newVal ，oldVal无function类型，故转化为string来深层对比
      if (newOption !== oldOption) {
        // 数据更改时更新echart
        console.log('updateEchart');
        this.lineChart.setOption(this.echartOption);
      }
    },
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.lineChart = echarts.init(document.getElementById('lineChart'));
      // 初始化数据 && 设置窗口自适应大小
      this.lineChart.setOption(this.echartOption, window.onresize = this.lineChart.resize);
    },
  },
};
</script>

<style scoped lang="less">
.line-echarts {
    .line-echarts-ii {
        width: 100%;
        height: 420px;
    }
}
</style>
