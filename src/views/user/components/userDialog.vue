<template>
  <el-dialog :title="title" v-model="dialogVisible" @close="handleClose" :close-on-click-modal="false">
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-card>
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form-item label="AppID" :label-width="formLabelWidth" prop="eid">
          <el-input v-model="form.eid" placeholder="请输入AppID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" v-if="userInfo.userInfo.role === '0'" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" placeholder="请输入确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" v-if="userInfo.userInfo.role === '0'" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option v-for="role in ROLELIST" :key="role.value" :label="role.label" :value="role.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像URL"></el-input>
        </el-form-item>
        <el-form-item
          label="小程序密钥"
          :label-width="formLabelWidth"
          v-if="userInfo.userInfo.role === '0'"
          prop="secret"
        >
          <el-input v-model="form.secret" placeholder="请输入小程序密钥"></el-input>
        </el-form-item>
      </el-card>
      <el-card class="payment-card" v-if="userInfo.userInfo.role === '0'">
        <div slot="header">
          <span>支付相关</span>
        </div>
        <el-form-item label="商户ID" :label-width="formLabelWidth" prop="mchid">
          <el-input v-model="form.mchid" placeholder="请输入商户ID"></el-input>
        </el-form-item>
        <el-form-item label="商户证书" :label-width="formLabelWidth" prop="public_key">
          <FileUpload :beforeUpload="checkFileBeforeUploadCert" v-model="form.public_key" :headers="uploadHeaders" />
        </el-form-item>
        <el-form-item label="商户密钥" :label-width="formLabelWidth" prop="private_key">
          <FileUpload :beforeUpload="checkFileBeforeUploadKey" v-model="form.private_key" :headers="uploadHeaders" />
        </el-form-item>
      </el-card>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAddUser, fetchUpdateUser } from '@api/user';
import { userInfoSet } from '@store/permiss';
import { ROLELIST } from '@constant/index';
import FileUpload from '@components/fileUpload.vue';
import md5 from 'js-md5';

const userInfo = userInfoSet();
const props = defineProps({
  visible: Boolean,
  title: String,
  userForm: Object,
});

const emit = defineEmits(['update:visible', 'save']);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

const form = ref({ ...props.userForm });
const formRef = ref();
const formLabelWidth = '120px';

const checkFileBeforeUploadCert = (file: any) => {
  console.log(file, '----file');
  const isCert = file.name.includes('cert');
  if (!isCert) {
    ElMessage.error('上传文件格式不正确，仅支持 .cert 格式!');
  }
  return isCert;
};

const checkFileBeforeUploadKey = (file: any) => {
  const isKey = file.name.includes('key');
  if (!isKey) {
    ElMessage.error('上传文件格式不正确，仅支持 .key 格式!');
  }
  return isKey;
};

// 自定义验证方法
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = {
  eid: [{ required: true, message: '请输入AppID', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

const uploadHeaders = computed(() => {
  const authorization = sessionStorage.getItem('authorization');
  return {
    type: 'miniprogram_payment_files',
    authorization: authorization ? authorization : '',
  };
});

watch(
  () => props.userForm,
  (newValue) => {
    form.value = { ...newValue };
  },
  { deep: true }
);

const handleSave = async (formEl: any) => {
  try {
    formEl?.validate(async (valid: boolean) => {
      if (valid) {
        // 如果是新用户，或者编辑时密码变更了，就进行加密
        if (!form.value.id || form.value.password !== form.value.confirmPassword) {
          // @ts-ignore
          form.value.password = md5(form.value.password);
        }
        if (form.value.id) {
          await fetchUpdateUser(form.value);
        } else {
          await fetchAddUser(form.value);
        }
        handleClose();
        emit('save', form.value);
      }
    });
  } catch (error) {
    console.error('保存用户失败', error);
    ElMessage.error('保存失败，请检查表单');
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-upload-list__item-actions {
  display: none;
}
.avatar-uploader:hover {
  .el-upload-list__item-actions {
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
  }
}
.dialog-footer {
  text-align: right;
}
.payment-card {
  margin-top: 20px;
}
</style>
