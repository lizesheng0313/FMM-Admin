<template>
  <div>
    <div class="container">
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="支付状态">
          <el-select v-model="form.returnStatus" placeholder="请选择支付状态" clearable>
            <el-option key="0" label="待支付" value="0"></el-option>
            <el-option key="1" label="已支付" value="1"></el-option>
            <el-option key="2" label="已取消" value="2"></el-option>
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
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span class="title">退货列表</span>
        </div>
      </template>
      <el-table style="width:100%;" :data="tableData" border class="table" ref="multipleTable"
        header-cell-class-name="table-header">
        <el-table-column prop="order_id" label="订单id" align="center"></el-table-column>
        <el-table-column prop="user_id" label="用户id" align="center"></el-table-column>
        <el-table-column label="用户" align="left" width="300">
          <template #default="scope">
            <div>
              <p>收件人：{{ scope.row.address_name }}</p>
              <p style="margin-top:10px">联系电话：{{ scope.row.address_phone }}</p>
              <p style="margin-top:10px">收件地址：{{ scope.row.address_detail }}</p>
            </div>
          </template>
        </el-table-column>
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
        <el-table-column prop="receive_time" label="用户收货时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="application_time" label="申请时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="approve_time" label="审批时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="return_receive_time" label="退货收货时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="refund_time" label="退款时间" width="200" :formatter="formatDateTime"
          align="center"></el-table-column>
        <el-table-column prop="reason" label="退货原因" width="200" align="center"></el-table-column>
        <el-table-column prop="memo" label="退货备注" width="200" align="center"></el-table-column>
        <el-table-column prop="picture_list" label="退货凭证" width="200" align="center">
          <template #default="scope">
            <div class="flex" v-if="scope.row?.picture_list?.length > 0">
              <el-image v-for="item in scope.row.picture_list" class="table-td-thumb" :src="item"
                style="width:60px;height:60px;" :preview-src-list="scope.row.picture_list" preview-teleported>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_price" label="订单金额" width="100" align="center"></el-table-column>
        <el-table-column prop="order_status_str" label="订单状态" width="100" align="center"></el-table-column>
        <el-table-column prop="order_return_status_start" width="100" label="退货状态" align="center"></el-table-column>
        <el-table-column prop="cost_price" width="100" label="订单成本" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.status === '1' && scope.row.order_status === '50'">
              <el-button text :icon="SuitcaseLine" @click="showConfirmDialog(scope.row.id)" v-permiss="15">
                同意退货
              </el-button>
              <el-button text :icon="SuitcaseLine" @click="showDialog(scope.row.id)" v-permiss="15">
                拒绝退货
              </el-button>
            </div>
            <el-button v-if="scope.row.order_status === '50' && scope.row.status === '4'" text :icon="SuitcaseLine"
              @click="handleReceivedGoods(scope.row.id)">
              确认收货
            </el-button>
            <el-button v-if="scope.row.order_status === '80' && scope.row.pay_status === '1'" text :icon="SuitcaseLine"
              @click="handleRefund(scope.row.id)">
              同意退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="form.pageIndex"
          :page-size="form.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </el-card>
    <el-dialog title="同意退货" v-model="dialogAgreeVisible" :close-on-click-modal="false" width="500" align-center="true">
      <el-form :model="refuse" label-position="left" label-width="80px">
        <el-form-item label="退货地址" prop="return_address">
          <el-input v-model="refuse.return_address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hideDialog">取消</el-button>
          <el-button type="primary" @click="handleAgreeOrder">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="拒绝退货" v-model="dialogVisible" :close-on-click-modal="false" width="400" align-center="true">
      <el-form :model="refuse" label-position="left" label-width="80px">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input v-model="refuse.reason"></el-input>
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
import { fetchReturnOrderList, fetchAgreenOrder, fetchRefuseOrder, fetchRefundOrder, fetchReceivedGoods } from '../../api/order/index';
import { formatDateTime } from '../../utils/utils'
import { ElMessageBox } from 'element-plus';

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
  returnStatus: '',
  username: '',
  orderId: '',
  pageIndex: 1,
  pageSize: 10
});
const refuse = reactive({
  reason: '',
  return_address: ''
})
const dialogVisible = ref(false);
const dialogAgreeVisible = ref(false)
const orderId = ref('');
// 获取表格数据
const getData = () => {
  fetchReturnOrderList(form).then(res => {
    tableData.value = res.data.list;
    pageTotal.value = res.data.total;
  });
};
getData();

// 查询操作
const handleSearch = () => {
  form.pageIndex = 1;
  getData()
};
// 分页导航
const handlePageChange = (val: number) => {
  form.pageIndex = val
  getData()
};

const handleRefund = (id: string) => {
  // 二次确认
  ElMessageBox.confirm('确定要退款吗？', '提示', {
    type: 'warning'
  })
    .then(() => {
      fetchRefundOrder({
        id
      }).then(res => {
        ElMessage.success('退款状态更改成功');
        getData();
      })
    })
    .catch(() => { });
}

const handleReceivedGoods = (id: string) => {
  // 二次确认
  ElMessageBox.confirm('确认商家已收到货？', '提示', {
    type: 'warning'
  })
    .then(() => {
      fetchReceivedGoods({
        id
      }).then(res => {
        ElMessage.success('收货成功');
        getData();
      })
    })
    .catch(() => { });
}

const showDialog = (id: string) => {
  dialogVisible.value = true;
  orderId.value = id
};

const hideDialog = () => {
  dialogAgreeVisible.value = false;
  dialogVisible.value = false;
  refuse.return_address = ''
  refuse.reason = ''
}
const handleSubmit = () => {
  fetchRefuseOrder({
    id: orderId.value,
    reason: refuse.reason
  }).then(res => {
    dialogVisible.value = false;
    ElMessage.success('拒绝成功');
    getData();
  })
}

const handleAgreeOrder = () => {
  fetchAgreenOrder({
    id: orderId.value,
    return_address: refuse.return_address
  }).then(res => {
    dialogAgreeVisible.value = false
    ElMessage.success('操作成功')
    getData()
  })
}

const showConfirmDialog = (id: string) => {
  dialogAgreeVisible.value = true
  orderId.value = id
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
