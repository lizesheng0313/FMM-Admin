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
      <el-table :data="tableData" border class="table"  header-cell-class-name="table-header">
        <el-table-column prop="id" label="订单id" width="200" align="center"></el-table-column>
        <el-table-column prop="name" label="商品" align="left" width="300">
          <template #default="scope">
            <div>
              <p>名称：{{ scope.row.name }}</p>
              <div style="display:flex;align-items: center;">
                <img style="width:80px;height:80px;margin-right: 10px;" :src="scope.row.goods_picture" />
                <div>
                  <p style="margin-top:10px;"> 规格：{{ scope.row.sku_id }}</p>
                  <p style="color:#f56c6c;margin-top:10px;margin-bottom: 10px;">数量：{{ scope.row.quantity }}</p>
                </div>
              </div>
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
              <p style="margin-top:10px">收件地址：{{ scope.row?.province }}{{ scope.row?.city }}{{ scope.row?.streetName }}{{
                scope.row.address_detail }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="订单金额" width="100" align="center"></el-table-column>
        <el-table-column prop="response_price" label="实际收款" width="100" align="center"></el-table-column>
        <el-table-column prop="order_status_str" label="订单状态" width="100" align="center"></el-table-column>
        <el-table-column prop="pay_status_str" label="支付状态" width="100" align="center"></el-table-column>
        <el-table-column prop="cost_price" label="订单成本" align="center" width="100"></el-table-column>
        <el-table-column prop="href" label="合作链接" align="center" width="100">
          <template #default="scope">
            <a :href="scope.row.href" target="_blank">商品链接</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template #default="scope">
            <el-button v-if="scope.row.order_status === '10' && scope.row.pay_status === '1'" text :icon="SuitcaseLine"
              @click="()=>{
                showDialog(scope?.row)
              }">
              发货
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
      <el-form ref="form" :model="logistics" label-position="left" label-width="80px">
        <el-form-item required label="物流公司" prop="logistics_company">
          <el-select filterable :props="{ value: 'delivery_id', label: 'delivery_name' }"
            v-model="logistics.logistics_company" placeholder="请选择物流公司">
            <el-option v-for="company in logisticsCompanies" :key="company.delivery_id" :label="company.delivery_name"
              :value="company.delivery_id" />
          </el-select>
        </el-form-item>
        <el-form-item required label="物流单号" prop="logistics_no">
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
import { ElMessage } from 'element-plus'
import { SuitcaseLine, } from '@element-plus/icons-vue';
import { fetchOrderList, fetchShipGodos } from '../../api/order/index';
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
const logisticsCompanies = ref<any[]>([]);
const dialogVisible = ref(false);
const orderId = ref('');
const userId = ref('');
const address_phone = ref('')
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

const showDialog = (row: any) => {
  // fetchGetLogList().then(res => {
  //   logisticsCompanies.value = res.data
  // })
  console.log(row,'-row')
  console.log(123,'123')
  dialogVisible.value = true;
  console.log(456,'456')
  orderId.value = row.id
  console.log(456,'789')
  userId.value = row.user_id
  console.log(456,'789')
  address_phone.value = row.address_phone
  console.log(456,'11,22')

};
const hideDialog = () => {
  dialogVisible.value = false;
  logistics.logistics_company = ''
  logistics.logistics_no = ''
}
const handleSubmit = () => {
  fetchShipGodos({
    address_phone: address_phone.value,
    user_id: userId.value,
    id: orderId.value,
    ...logistics
  }).then(res => {
    dialogVisible.value = false;
    ElMessage.success('发货成功');
    getData();
  })
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
  font-size: 14px;
  max-width: calc(100vw - 150px);
}


.logistic-input {
  width: 190px;
}
</style>
