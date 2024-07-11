<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 顶部统计信息卡片 -->
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>总销售额</span>
          </div>
          <div>
            <h2>¥ 126,560</h2>
            <div>今日销售额 ¥12,423</div>
            <div id="sales-mini-chart" style="height: 60px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>访问量</span>
          </div>
          <div>
            <h2>8,856</h2>
            <div>今日访问量 12,34</div>
            <div id="visits-mini-chart" style="height: 60px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>订单统计</span>
          </div>
          <div>
            <h2>65,560</h2>
            <div>今日订单量 234</div>
            <div id="orders-mini-chart" style="height: 60px"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="clearfix">
            <span>新用户数</span>
          </div>
          <div>
            <h2>560</h2>
            <div>总用户量 31,235</div>
            <div id="new-users-mini-chart" style="height: 60px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- 销售分析图表 -->
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>销售分析</span>
          </div>
          <div id="sales-chart" style="height: 400px"></div>
          <div class="mt-2">
            <div>距离目标 ¥10,345</div>
            <div>同比上周 ¥7,589</div>
            <div>同比上月 ¥1,476</div>
          </div>
        </el-card>
      </el-col>

      <!-- 订单分析图表 -->
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>订单分析</span>
          </div>
          <div id="order-chart" style="height: 400px"></div>
          <div class="mt-2">
            <div>距离目标 645</div>
            <div>同比上周 289</div>
            <div>同比上月 3,476</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'Dashboard',
  mounted() {
    this.initMiniCharts();
    this.initSalesChart();
    this.initOrderChart();
  },
  methods: {
    initMiniCharts() {
      this.initLineChart('sales-mini-chart', [120, 132, 101, 134, 90, 230, 210], '#FF4D4F');
      this.initLineChart('visits-mini-chart', [220, 182, 191, 234, 290, 330, 310], '#722ED1');
      this.initBarChart('orders-mini-chart', [150, 232, 201, 154, 190, 330, 410], '#1890FF');
      this.initLineChart('new-users-mini-chart', [320, 332, 301, 334, 390, 330, 320], '#52C41A');
    },
    initLineChart(id, data, color) {
      const chart = echarts.init(document.getElementById(id));
      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data,
            type: 'line',
            areaStyle: {},
            itemStyle: {
              color: color,
            },
          },
        ],
      };
      chart.setOption(option);
    },
    initBarChart(id, data, color) {
      const chart = echarts.init(document.getElementById(id));
      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data,
            type: 'bar',
            itemStyle: {
              color: color,
            },
          },
        ],
      };
      chart.setOption(option);
    },
    initSalesChart() {
      const chart = echarts.init(document.getElementById('sales-chart'));
      const option = {
        // 配置销售分析图表
        tooltip: {},
        legend: {
          data: ['PC端', '移动端', '平板端'],
        },
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {},
        series: [
          {
            name: 'PC端',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 40, 20, 36, 10, 10, 20],
          },
          {
            name: '移动端',
            type: 'bar',
            data: [15, 25, 36, 20, 30, 20, 50, 30, 36, 20, 20, 20],
          },
          {
            name: '平板端',
            type: 'line',
            data: [30, 40, 55, 60, 70, 80, 90, 100, 110, 120, 130, 140],
          },
        ],
      };
      chart.setOption(option);
    },
    initOrderChart() {
      const chart = echarts.init(document.getElementById('order-chart'));
      const option = {
        // 配置订单分析图表
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['1', '143', '286', '429', '571', '713'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'scatter',
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.mt-4 {
  margin-top: 20px;
}
</style>
