<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.address" placeholder="品牌" class="handle-select mr10">
          <el-option key="1" label="广东省" value="广东省"></el-option>
          <el-option key="2" label="湖南省" value="湖南省"></el-option>
        </el-select>
        <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="title">商品列表</span>
            <el-button class="button" type="primary" @click="() => {
              $router.push('/goods/add')
            }">添加</el-button>
          </div>
        </template>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
          <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
          <el-table-column label="商品图片" align="center">
            <template #default="scope">
              <el-image class="table-td-thumb" :src="scope.row.picture" :z-index="10"
                :preview-src-list="[scope.row.picture]" preview-teleported>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center"></el-table-column>
          <el-table-column label="价格/货号" align="center">
            <template #default="scope">
              <div>
                价格：￥{{ scope.row.price }}
              </div>
              <div>
                货号：{{ scope.row.number }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="标签">
          <template #default="scope">￥{{ scope.row.money }}</template>
        </el-table-column> -->
          <!-- <el-table-column prop="address" label="排序"></el-table-column> -->
          <el-table-column align="center" prop="volume" label="销量"></el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template #default="scope">
              <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
                编辑
              </el-button>
              <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchGoodsList } from '../../api/goods/index';

interface TableItem {
  id: number;
  name: string;
  money: string;
  state: string;
  date: string;
  address: string;
}

const query = reactive({
  address: '',
  name: '',
  pageIndex: 1,
  pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);


// 获取表格数据
const getData = () => {
  fetchGoodsList().then(res => {
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
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('删除成功');
      tableData.value.splice(index, 1);
    })
    .catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  name: '',
  address: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.name = row.name;
  form.address = row.address;
  editVisible.value = true;
};
const saveEdit = () => {
  editVisible.value = false;
  ElMessage.success(`修改第 ${idx + 1} 行成功`);
  tableData.value[idx].name = form.name;
  tableData.value[idx].address = form.address;
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
