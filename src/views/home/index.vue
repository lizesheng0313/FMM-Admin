<template>
  <div class="dashboard">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>总销售额</span>
            </div>
          </template>
          <div>
            <h2>¥ {{ dashboard?.turnover }}</h2>
            <div>今日销售额 ¥{{ dashboard?.todayTurnover }}</div>
            <div id="sales-mini-chart" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>订单统计</span>
            </div>
          </template>
          <div>
            <h2>{{ dashboard?.totalOrder }}</h2>
            <div>今日订单量 {{ dashboard?.todayOrder }}</div>
            <div id="orders-mini-chart" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>新用户数</span>
            </div>
          </template>
          <div>
            <h2>{{ dashboard?.todayUser }}</h2>
            <div>总用户量 {{ dashboard?.totalUser }}</div>
            <div id="new-users-mini-chart" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>今日新增商品</span>
            </div>
          </template>
          <div>
            <h2>{{ dashboard?.todayGoods }}</h2>
            <div>总商品数 {{ dashboard?.totalGoods }}</div>
            <div id="goods-mini-chart" class="chart-box"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <!-- 销售分析图表 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>销售分析</span>
            </div>
          </template>
          <div id="sales-chart" style="height: 400px; width: 100%"></div>
        </el-card>
      </el-col>

      <!-- 订单分析图表 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>订单分析</span>
            </div>
          </template>
          <div id="order-chart" style="height: 400px; width: 100%"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { fetchGetCharts } from '@api/dashboard';
import type { dashboardType } from './d';

const dashboard = ref<dashboardType>();
const initMiniCharts = () => {
  const xAxisData: any[] = [];
  const seriesData: any[] = [];
  dashboard?.value?.dailyTurnover.forEach((item: any) => {
    xAxisData.push(item.date);
    seriesData.push(item.total_price);
  });
  initLineChart('sales-mini-chart', xAxisData, seriesData, '#FF4D4F');
  const xOrderData: any[] = [];
  const seriesOrderData: any[] = [];
  dashboard?.value?.dailyOrder.forEach((item: any) => {
    xOrderData.push(item.date);
    seriesOrderData.push(item.total_order);
  });
  initLineChart('orders-mini-chart', xOrderData, seriesOrderData, '#722ED1');
  const xUserData: any[] = [];
  const seriesUserData: any[] = [];
  dashboard?.value?.dailyUser.forEach((item: any) => {
    xUserData.push(item.date);
    seriesUserData.push(item.total_user);
  });
  initBarChart('new-users-mini-chart', xUserData, seriesUserData, '#1890FF');
  initSalesChart();
  initOrderChart();
  initChart();
};

const initLineChart = (id: string, xAxisData: any[], seriesData: any[], color: string) => {
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
      data: xAxisData,
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        areaStyle: {},
        itemStyle: {
          color: color,
        },
      },
    ],
  };
  chart.setOption(option);
};

const initBarChart = (id: string, xAxisData: any[], seriesData: any[], color: string) => {
  const chart = echarts.init(document.getElementById(id));
  const option = {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        itemStyle: {
          color: color,
        },
      },
    ],
  };
  chart.setOption(option);
};
// 销售分析图表
const initSalesChart = () => {
  const legendData: any[] = [];
  const series: any[] = [];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  dashboard?.value?.monthlyTurnover?.forEach((item: any) => {
    legendData.push(item.title);
    series.push({
      name: item.title,
      type: 'bar', // 可以根据需要选择 'line', 'bar' 等图表类型
      data: item.monthly_data,
    });
  });

  const chart = echarts.init(document.getElementById('sales-chart'));
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: legendData,
    },
    xAxis: {
      type: 'category',
      data: months,
    },
    yAxis: {
      type: 'value',
    },
    series,
  };

  chart.setOption(option);
};
//
const initOrderChart = () => {
  const legendData: any[] = [];
  const series: any[] = [];

  dashboard?.value?.monthlyOrder.forEach((item: any) => {
    legendData.push(item.title);
    series.push({
      name: item.title,
      type: 'scatter',
      data: item.monthly_data.map((total_order: any, index: any) => [index + 1, total_order]),
    });
  });

  const chart = echarts.init(document.getElementById('order-chart'));
  const option = {
    tooltip: {
      trigger: 'axis',
      showDelay: 0,
      formatter: (params: any) => {
        const data = params[0].data;
        return `月份: ${data[0]}<br/>订单总计: ${data[1]}`;
      },
    },
    legend: {
      data: legendData,
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
    },
    yAxis: {
      type: 'value',
    },
    series,
  };

  chart.setOption(option);
};

const initChart = () => {
  const chart = echarts.init(document.getElementById('goods-mini-chart'));
  const option = {
    series: [
      {
        name: '商品总数',
        type: 'bar',
        data: [dashboard?.value?.totalGoods || 0], // 确保有值，即使 totalGoods 为 undefined
        barWidth: '100%',
        itemStyle: {
          color: '#4caf50', // 自定义颜色
          borderRadius: [5, 5, 5, 5], // 圆角
        },
      },
    ],
    xAxis: {
      type: 'category',
      show: false,
      data: ['商品总数'],
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    grid: {
      top: '60%',
      left: '-10%',
      bottom: '-30%',
      right: '0%',
      containLabel: true,
    },
  };
  chart.setOption(option);
};

onMounted(() => {
  fetchGetCharts().then((res) => {
    dashboard.value = res.data;
    initMiniCharts();
  });
});
</script>

<style scoped lang="scss">
.dashboard {
  .chart-box {
    height: 60px;
    width: 100%;
  }
}
.mt-4 {
  margin-top: 20px;
}
</style>
