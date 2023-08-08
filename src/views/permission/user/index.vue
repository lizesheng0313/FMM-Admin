<template>
  <div>
    <div class="container">
      <el-form :model="form" label-width="120px" :inline="true">
        <!-- <el-form-item label="支付状态">
          <el-select v-model="form.payStatus" placeholder="请选择支付状态" clearable>
            <el-option key="0" label="待支付" value="0"></el-option>
            <el-option key="1" label="已支付" value="1"></el-option>
            <el-option key="2" label="已取消" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option key="10" label="待发货" value="10"></el-option>
            <el-option key="20" label="已发货" value="20"></el-option>
            <el-option key="30" label="已收货" value="30"></el-option>
            <el-option key="40" label="已完成" value="40"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="form.username" placeholder="收件人"></el-input>
        </el-form-item>
        <el-form-item label="订单id">
          <el-input v-model="form.orderId" placeholder="订单id"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">用户列表</span>
        </div>
      </template>
      <el-table :data="tableData"
        row-key="user_id"
        default-expand-all
        :tree-props="{ children: 'children' }"
        row-style=
        border class="table" height="550"  header-cell-class-name="table-header">
        <el-table-column prop="user_id" label="user_id" align="center"></el-table-column>
        <el-table-column prop="ch" label="来源" align="center"></el-table-column>
        <el-table-column prop="a_create_time" label="注册时间" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="order_id" label="订单id" align="center"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" :formatter="formatDateTime"
          align="center"></el-table-column>
          <el-table-column prop="goods_name" label="下单商品" 
          align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="form.pageIndex"
          :page-size="form.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { fetchGetUserList } from '../../../api/permission/index';
import { formatDateTime } from '../../../utils/utils'

interface TableItem { 
  id: number;
  user_id: string;
  total_price: string;
  pay_status_str: string;
  payment_time: string;
  create_time: string;
  goods_id: string;
  goods_name: string;
  order_status_str: string;
  cost_price: string;
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const form = reactive({
  pageIndex: 1,
  pageSize: 100
});
// 获取表格数据
const getData = () => {
  fetchGetUserList(form).then(res => {
    tableData.value = res.data.list;
    pageTotal.value = res.data.total;
  });
};
getData();

// 查询操作
const handleSearch = () => {
  form.pageIndex = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  form.pageIndex = val;
  getData();
};
</script>

<style scoped sass>
.el-table tr {
  height: 40px; 
}
.handle-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex: 1;
}
.table {
  font-size: 14px;
  max-width: calc(100vw - 150px);
}

.logistic-input {
  width: 190px;
}
</style>
