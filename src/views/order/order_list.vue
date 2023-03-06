<template>
  <div>
    <div class="container">
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="支付状态">
          <el-select v-model="form.payStatus" placeholder="请选择支付状态" clearable>
            <el-option key="0" label="待支付" value="0"></el-option>
            <el-option key="1" label="已支付" value="1"></el-option>
            <el-option key="2" label="已取消" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option key="0" label="待发货" value="0"></el-option>
            <el-option key="1" label="已发货" value="1"></el-option>
            <el-option key="2" label="已收货" value="2"></el-option>
            <el-option key="3" label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="form.username" placeholder="收件人"></el-input>
        </el-form-item>
        <el-form-item label="订单id">
          <el-input v-model="form.orderId" placeholder="订单id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">订单列表</span>
        </div>
      </template>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="订单id" align="center"></el-table-column>
        <el-table-column prop="name" label="商品" align="left" width="200">
          <template #default="scope">
            <div>
              <p>名称：{{ scope.row.name }}</p>
              <p style="margin-top:10px;"> 规格：{{ scope.row.skuId }}</p>
              <p style="color:#f56c6c;margin-top:10px;margin-bottom: 10px;">数量：{{ scope.row.totao_quantity }}</p>
              <el-image fit="contain" :src="scope.row.goods_picture"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="user_id" label="用户" align="left" width="300">
          <template #default="scope">
            <div>
              <p>收件人：{{ scope.row.address_name }}</p>
              <p style="margin-top:10px">联系电话：{{ scope.row.address_phone }}</p>
              <p style="margin-top:10px">收件地址：{{ scope.row.address_detail }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="order_status_str" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="pay_status_str" label="支付状态" align="center"></el-table-column>
        <el-table-column prop="cost_price" label="订单成本" align="center"></el-table-column>
        <el-table-column prop="href" label="合作链接" align="center">
          <template #default="scope">
            <a :href="scope.row.href" target="_blank">商品链接</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.order_status === '0' && scope.row.pay_status === '1'" text :icon="SuitcaseLine"
              @click="showDialog" v-permiss="15">
              发货
            </el-button>
            <el-button text :icon="Delete" @click="handleDelete(scope.row.id)" v-permiss="16">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="form.pageIndex"
          :page-size="form.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </el-card>
    <el-dialog title="发货" v-model="dialogVisible" :close-on-click-modal="false" width="400" align-center="true">
      <el-form :model="logistics" label-position="left" label-width="80px">
        <el-form-item label="物流公司" prop="logistics_company">
          <el-select v-model="logistics.logistics_company" placeholder="请选择物流公司">
            <el-option v-for="company in logisticsCompanies" :key="company.value" :label="company.label"
              :value="company.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logistics_no">
          <el-input class="logistic-input" v-model="logistics.logistics_no" placeholder="请输入物流单号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hideDialog">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { Delete, SuitcaseLine, } from '@element-plus/icons-vue';
import { fetchOrderList } from '../../api/order/index';
import { formatDateTime } from '../../utils/utils'

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
  orderStatus: '',
  payStatus: '',
  username: '',
  orderId: '',
  pageIndex: 1,
  pageSize: 10
});
const logistics = reactive({
  logistics_company: '',
  logistics_no: '',
})
// 获取表格数据
const getData = () => {
  fetchOrderList(form).then(res => {
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

// 删除操作
const handleDelete = (id: number) => {
  // // 二次确认删除
  // ElMessageBox.confirm('确定要删除吗？', '提示', {
  //   type: 'warning'
  // })
  //   .then(() => {
  //     fetchDeleteGoodsInfo({
  //       id
  //     }).then(res => {
  //       ElMessage.success('删除成功');
  //       getData();
  //     })
  //   })
  //   .catch(() => { });
};

const logisticsCompanies = [
  { value: 'SF', label: '顺丰快递' },
  { value: 'STO', label: '申通快递' },
  { value: 'YTO', label: '圆通快递' },
  { value: 'ZTO', label: '中通快递' },
  { value: 'EMS', label: 'EMS' },
  { value: 'JD', label: '京东快递' },
];
const dialogVisible = ref(false);

const showDialog = () => {
  dialogVisible.value = true;
};
const hideDialog = () => {
  dialogVisible.value = false;
  logistics.logistics_company = ''
  logistics.logistics_no = ''
}
const handleSubmit = () => {

}

</script>

<style scoped sass>
.handle-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex: 1;
}

.table {
  overflow: auto;
  overflow-x: scroll;
  font-size: 14px;
}

.logistic-input {
  width: 190px;
}
</style>
