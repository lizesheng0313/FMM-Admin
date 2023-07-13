<template>
  <div>
    <div class="container">
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
          <el-table-column label="商品图片" align="center">
            <!-- <template #default="scope">
              <el-image class="table-td-thumb" style="width: 80px; height: 80px"
                :src="scope.row.pictureList ? scope.row.pictureList[0] : ''" :z-index="10" fit="contain"
                :preview-src-list="[scope.row.pictureList ? scope.row.pictureList[0] : '']" preview-teleported>
              </el-image>
            </template> -->
          </el-table-column>
          <el-table-column label="名称" prop="name" align="center"></el-table-column>
          <el-table-column label="标签" align="center">
            <template #default="scope">
              <div class="label-box">
                <el-switch inactive-text="上架" :active-value="1" :inactive-value="0"
                  @click="() => { handleUpdateGoods('online', scope.row.online, scope.row.id) }"
                  v-model="scope.row.online"></el-switch>
                <el-switch inactive-text="新品" :active-value="1" :inactive-value="0"
                  @click="() => { handleUpdateGoods('latest', scope.row.latest, scope.row.id) }"
                  v-model="scope.row.latest"></el-switch>
                <el-switch inactive-text="推荐" :active-value="1" :inactive-value="0"
                  @click="() => { handleUpdateGoods('recommend', scope.row.recommend, scope.row.id) }"
                  v-model="scope.row.recommend"></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="href" label="合作链接" align="center" width="100">
            <template #default="scope">
              <a :href="scope.row?.href" target="_blank">商品链接</a>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" :formatter="formatDateTime" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" width="220" align="center">
            <template #default="scope">
              <el-button text :icon="Edit" @click="() => { handleEdit(scope.row.id) }" v-permiss="15">
                编辑
              </el-button>
              <el-button text :icon="Delete" class="red" @click="() => { handleDelete(scope.row.id) }" v-permiss="16">
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, } from '@element-plus/icons-vue';
import { fetchGoodsList, fetchDeleteGoodsInfo, fetchUpdateGoods } from '../../api/goods/index';
import { useRouter } from 'vue-router';
import { formatDateTime } from '../../utils/utils'

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
const router = useRouter();

// 获取表格数据
const getData = () => {
  console.log('执行次数')
  fetchGoodsList(query).then(res => {
    tableData.value = res.data.list;
    pageTotal.value = res.data.total;
  });
};


onMounted(() => {
  getData();
})

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
        console.log('删除')
        ElMessage.success('删除成功');
        getData();
      })
    })
    .catch(() => { });
};

const handleEdit = (id: string) => {
  router.push({ path: '/goods/add', query: { id } })
}

interface ElementPlusObject {
  [key: string]: any;
}

function handleUpdateGoods(key: string, row: number, id: string) {
  const map: ElementPlusObject = {
    online: '上架',
    latest: '新品',
    recommend: '推荐'
  }
  fetchUpdateGoods({
    [key]: row,
    id,
  }).then(() => {
    row === 1 ?
      ElMessage.success(`${map[key]}成功`) : ElMessage.success(`取消${map[key]}成功`)
  })
}
</script>
<style scoped sass>
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

.label-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

:deep(.el-switch) {
  color: #909399;
}

:deep(.el-switch__label) {
  color: #909399;
}
</style>
