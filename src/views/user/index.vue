<template>
  <div>
    <el-button type="primary" @click="openDialog('add')" class="add-btn">添加小程序</el-button>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="eid" label="AppID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          {{ ROLE[row.role as keyof typeof ROLE] }}
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <el-image :src="row.avatar" style="width: 60px; height: 60px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="mchid" label="商户ID" />
      <el-table-column prop="public_key" label="商户证书" show-overflow-tooltip />
      <el-table-column prop="private_key" label="商户密钥" show-overflow-tooltip />
      <el-table-column prop="created_time" label="创建时间" :formatter="formatDateTime" />
      <el-table-column prop="updated_time" label="更新时间" :formatter="formatDateTime" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.eid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <UserDialog v-model:visible="dialogVisible" :title="dialogTitle" :user-form="userForm" @save="handleSave" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { fetchUserList, fetchDeleteUser } from '@api/user';
import { formatDateTime } from '@utils/utils';
import UserDialog from './components/userDialog.vue';
import { ROLE } from '@constant/index';

const users = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const initForm = {
  eid: '',
  username: '',
  password: '',
  role: '',
  avatar: '',
  secret: '',
  mchid: '',
  public_key: '',
  private_key: '',
};
const userForm = ref({ ...initForm });

const getUsers = async () => {
  const response = await fetchUserList();
  users.value = response.data;
};

const openDialog = (action: string, row?: any) => {
  dialogTitle.value = action === 'add' ? '添加小程序' : '编辑小程序';
  if (action === 'edit') {
    // 编辑时密码和确认密码设为空,如果用户不输入就表示不修改密码
    userForm.value = { ...row, password: '', confirmPassword: '' };
  } else {
    userForm.value = { ...initForm };
  }
  dialogVisible.value = true;
};

const handleSave = async () => {
  ElMessage.success('保存成功');
  dialogVisible.value = false;
  getUsers();
};

const handleDelete = async (appid: number) => {
  try {
    await ElMessageBox.confirm('确定要删除此小程序吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await fetchDeleteUser({ appid });
    ElMessage.success('删除成功');
    getUsers();
  } catch (error) {
    console.error('删除小程序失败', error);
  }
};

// 页面加载时获取用户列表
getUsers();
</script>

<style scoped lang="scss">
.add-btn {
  margin-bottom: 20px;
}
</style>
