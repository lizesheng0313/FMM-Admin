<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.order_status" placeholder="订单状态" class="query_item">
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-select v-model="query.pay_status" placeholder="支付状态" class="query_item">
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input v-model="query.addressee" placeholder="收件人" class="query_item"></el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="title">订单列表</span>
          </div>
        </template>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
          <el-table-column prop="goods_name" label="商品" width="80" align="center"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" :formatter="formatDateTime" align="center"></el-table-column>
          <el-table-column prop="user_id" label="用户" align="center"></el-table-column>
          <el-table-column prop="total_price" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="order_status_str" label="订单状态" align="center"></el-table-column>
          <el-table-column prop="pay_status_str" label="支付状态" align="center"></el-table-column>
          <el-table-column prop="cost_price" label="订单成本" align="center"></el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template #default="scope">
              <el-button text :icon="Edit" @click="handleEdit(scope.row.id)" v-permiss="15">
                发货
              </el-button>
              <el-button text :icon="Delete" @click="handleDelete(scope.row.id)" v-permiss="16">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
            :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, } from '@element-plus/icons-vue';
import { fetchGoodsList, fetchDeleteGoodsInfo, fetchUpdateGoods } from '../../api/goods/index';
import { useRouter } from 'vue-router';
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

const query = reactive({
  order_status: '',
  pay_status: '',
  addressee: '',
  pageIndex: 1,
  pageSize: 10
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const router = useRouter();

// 获取表格数据
const getData = () => {
  fetchGoodsList(query).then(res => {
    tableData.value = res.data.list;
    pageTotal.value = res.data.total;
  });
};
getData();

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};
// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};

// 删除操作
const handleDelete = (id: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
    .then(() => {
      fetchDeleteGoodsInfo({
        id
      }).then(res => {
        ElMessage.success('删除成功');
        getData();
      })
    })
    .catch(() => { });
};

const handleEdit = (id: string) => {

}

</script>

<style scoped sass>
.handle-box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex: 1;
}

.query_item {
  width: 180px;
  margin-right: 10px;
}
</style>
