<template>
  <el-upload
    :headers="headers"
    class="avatar-uploader"
    action="/api/admin/upload"
    :show-file-list="false"
    :before-upload="checkFileBeforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
  >
    <div>
      <span v-if="modelValue" class="avatar">{{ modelValue }}</span>
      <el-icon v-else class="avatar-uploader-icon el-upload-list__item-thumbnail"><Plus /></el-icon>
      <span v-if="modelValue" class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click.stop="handleDelete">
          <el-icon><Delete /></el-icon>
        </span>
      </span>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: String,
  headers: Object,
  beforeUpload: Function,
});

const emit = defineEmits(['update:modelValue']);

const checkFileBeforeUpload = (file: any) => {
  if (props.beforeUpload) {
    return props.beforeUpload(file);
  }
  return true;
};

const handleSuccess = (res: any) => {
  if (res.code !== 0) {
    ElMessage.error(res.message);
    return;
  }
  if (res && res?.data?.path) {
    ElMessage.success('上传成功');
    emit('update:modelValue', res.data.path);
  }
};

const handleError = (err: any) => {
  ElMessage.error(err.message);
};

const handleDelete = () => {
  emit('update:modelValue', '');
};
</script>

<style scoped>
.el-upload-list__item-preview {
  margin-left: 5px;
  position: relative;
  top: 2px;
}
</style>
