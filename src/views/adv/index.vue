<template>
  <div>
    <el-button type="primary" @click="openDialog('add')" class="add-btn">添加广告位</el-button>
    <el-table :data="ads" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="名称" />
      <el-table-column prop="url" label="图片">
        <template #default="{ row }">
          <el-image :src="row.url" style="width: 100px; height: 100px"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="跳转路径" />
      <el-table-column prop="display" label="显示状态">
        <template #default="{ row }">
          {{ row.display === 1 ? '显示' : '隐藏' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" :formatter="formatDateTime" />
      <el-table-column prop="updated_time" label="更新时间" :formatter="formatDateTime" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="adForm" ref="formRef">
        <el-form-item required label="图片URL" :label-width="formLabelWidth">
          <el-input v-model="adForm.url" placeholder="输入图片URL"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="adForm.title" placeholder="输入名称"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" :label-width="formLabelWidth">
          <el-input v-model="adForm.path" placeholder="输入跳转路径"></el-input>
        </el-form-item>
        <el-form-item label="显示状态" :label-width="formLabelWidth">
          <el-switch v-model="adForm.display" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { fetchAdList, fetchAddAd, fetchUpdateAd, fetchDeleteAd } from '@api/ad';
import { formatDateTime } from '@utils/utils';
import type { FormInstance, FormRules } from 'element-plus';

const ads = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formRef = ref<FormInstance>();
const adForm = ref({
  id: null,
  url: '',
  title: '',
  path: '',
  display: 1, //1显示0隐藏
});
const formLabelWidth = '120px';

const getAds = async () => {
  const response = await fetchAdList();
  ads.value = response.data;
};

const openDialog = (action: any, row?: any) => {
  dialogTitle.value = action === 'add' ? '添加广告位' : '编辑广告位';
  if (action === 'edit') {
    adForm.value = { ...row };
  } else {
    adForm.value = { id: null, url: '', title: '', path: '', display: 1 };
  }
  dialogVisible.value = true;
};

const handleSave = (formEl: FormInstance | undefined) => {
  try {
    if (!formEl) return;
    formEl?.validate(async (valid: boolean) => {
      if (valid) {
        if (adForm.value.id) {
          await fetchUpdateAd(adForm.value);
        } else {
          await fetchAddAd(adForm.value);
        }
        ElMessage.success('保存成功');
        dialogVisible.value = false;
        getAds();
      }
    });
  } catch (error) {
    console.error('保存广告位失败', error);
  }
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除此广告位吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await fetchDeleteAd({ id });
    ElMessage.success('删除成功');
    getAds();
  } catch (error) {
    console.error('删除广告位失败', error);
  }
};

// 页面加载时获取广告列表
getAds();
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.add-btn {
  margin-bottom: 20px;
}
</style>
