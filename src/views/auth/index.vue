<template>
  <div>
    <div class="container">
      <el-form :model="form" :inline="true">
        <el-form-item label="授权码">
          <el-input v-model="form.authCode" placeholder="请输入授权码"></el-input>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="form.deviceId" placeholder="请输入设备ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="openDialog('add')">新增授权码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">授权码列表</span>
        </div>
      </template>

      <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="authCode" label="授权码" width="280" align="center" />
        <el-table-column prop="deviceId" label="设备ID" width="180" align="center" />
        <el-table-column prop="orderId" label="订单号" width="180" align="center" />
        <el-table-column prop="platform" label="平台" width="120" align="center" />
        <el-table-column prop="expiresAt" label="过期时间" :formatter="formatDateTime" align="center" />
        <el-table-column prop="createdAt" label="创建时间" :formatter="formatDateTime" align="center" />
        <el-table-column label="操作" width="320" align="center">
          <template #default="{ row }">
            <el-button text :icon="CopyDocument" @click="copyInstallCommand(row)">复制安装命令</el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="form.page"
          :page-size="form.pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="authForm" ref="authFormRef" :rules="rules" label-width="100px">
        <el-form-item label="授权码" prop="authCode" v-if="dialogType === 'add'">
          <el-input v-model="authForm.authCode" placeholder="系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="authForm.platform" placeholder="请选择平台">
            <el-option label="Windows" value="windows" />
            <el-option label="MacOS" value="mac" />
            <el-option label="Linux" value="linux" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="authForm.orderId" placeholder="请输入订单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit, CopyDocument, Delete } from '@element-plus/icons-vue';
import { formatDateTime } from '@utils/utils';
import { fetchAuthList, createAuthCode, updateAuthCode, updateOrderId, deleteAuthCode } from '@api/auth';

// 查询表单
const form = reactive({
  page: 1,
  pageSize: 10,
  authCode: '',
  deviceId: '',
});

const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogType = ref('add');
const dialogTitle = computed(() => (dialogType.value === 'add' ? '新增授权码' : '编辑授权码'));

const authForm = ref({
  authCode: '',
  validDays: '',
  status: 1,
  platform: '',
  orderId: '',
});

const rules = {
  validDays: [{ required: true, message: '请选择有效期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
};

// 获取列表数据
const getList = async () => {
  try {
    const res = await fetchAuthList(form);
    tableData.value = res.data.list;
    total.value = res.data.pagination.total;
  } catch (error) {
    console.error('获取授权列表失败:', error);
  }
};

// 打开弹窗
const openDialog = (type: 'add' | 'edit', row?: any) => {
  dialogType.value = type;
  dialogVisible.value = true;
  if (type === 'edit' && row) {
    authForm.value = {
      authCode: row.authCode,
      validDays: row.expiresAt,
      status: row.status,
      platform: row.platform,
      orderId: row.orderId,
    };
  } else {
    authForm.value = {
      authCode: '',
      validDays: '',
      status: 1,
      platform: '',
      orderId: '',
    };
  }
};

// 保存
const handleSave = async () => {
  try {
    if (dialogType.value === 'add') {
      await createAuthCode(authForm.value);
    } else {
      await updateAuthCode(authForm.value);
    }
    ElMessage.success('操作成功');
    dialogVisible.value = false;
    getList();
  } catch (error) {
    console.error('保存失败:', error);
  }
};

// 修改状态
const handleStatusChange = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该授权码吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await updateAuthCode({
      authCode: row.authCode,
      status: row.status === 1 ? 0 : 1,
    });

    ElMessage.success('操作成功');
    getList();
  } catch (error) {
    console.error('状态修改失败:', error);
  }
};

// 查询
const handleSearch = () => {
  form.page = 1;
  getList();
};

// 分页
const handlePageChange = (page: number) => {
  form.page = page;
  getList();
};

// 复制安装命令
const copyInstallCommand = (row: any) => {
  const commands = {
    windows: `$auth="${row.authCode}"; irm https://zjkdongao.cn/cursor/run/win.ps1 | iex`,
    mac: `curl -fsSL https://zjkdongao.cn/cursor/run/mac.sh | sudo bash -s ${row.authCode}`,
    linux: `curl -fsSL https://zjkdongao.cn/cursor/run/linux.sh | sudo bash -s ${row.authCode}`,
  };

  const command = commands[row.platform];
  if (!command) {
    ElMessage.error('无效的平台类型');
    return;
  }

  // 使用兼容性更好的复制方法
  const copyText = (text: string) => {
    // 创建临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);

    // 选择文本
    textArea.select();

    try {
      // 执行复制命令
      document.execCommand('copy');
      ElMessage.success('安装命令已复制到剪贴板');
    } catch (err) {
      ElMessage.error('复制失败');
      console.error('复制失败:', err);
    }

    // 移除临时文本区域
    document.body.removeChild(textArea);
  };

  // 优先使用 Clipboard API，如果不支持则使用备选方案
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(command)
      .then(() => ElMessage.success('安装命令已复制到剪贴板'))
      .catch((err) => {
        console.error('Clipboard API 失败，使用备选方案', err);
        copyText(command);
      });
  } else {
    copyText(command);
  }
};

// 删除授权码
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该授权码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await deleteAuthCode(row.id);
    ElMessage.success('删除成功');
    getList();
  } catch (error) {
    console.error('删除失败:', error);
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}

.el-input {
  margin: -5px 0;
}
</style>
