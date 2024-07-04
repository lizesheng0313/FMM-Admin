<template>
  <el-form :model="form" ref="formRef" :rules="rules">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
        <el-input v-model="form.id" placeholder="请输入ID" disabled></el-input>
      </el-form-item>
      <el-form-item label="小程序域名" :label-width="formLabelWidth" prop="domin">
        <el-input v-model="form.domin" placeholder="请输入小程序域名"></el-input>
      </el-form-item>
      <el-form-item label="隐私政策" :label-width="formLabelWidth" prop="privacy_policy">
        <el-input type="textarea" v-model="form.privacy_policy" placeholder="请输入隐私政策"></el-input>
      </el-form-item>
      <el-form-item label="用户协议" :label-width="formLabelWidth" prop="user_agreement">
        <el-input type="textarea" v-model="form.user_agreement" placeholder="请输入用户协议"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" :label-width="formLabelWidth" prop="contact_phone">
        <el-input v-model="form.contact_phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" :label-width="formLabelWidth" prop="contact_email">
        <el-input v-model="form.contact_email" placeholder="请输入联系邮箱"></el-input>
      </el-form-item>
      <el-form-item label="公司地址" :label-width="formLabelWidth" prop="company_addres">
        <el-input v-model="form.company_addres" placeholder="请输入公司地址"></el-input>
      </el-form-item>
      <el-form-item label="公司简介" :label-width="formLabelWidth" prop="company_descri">
        <el-input v-model="form.company_descri" placeholder="请输入公司简介"></el-input>
      </el-form-item>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      </div>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchAddUser, fetchUpdateUser } from '@api/adminUser';

const form = ref({
  id: '',
  domin: '',
  privacy_policy: '',
  user_agreement: '',
  contact_phone: '',
  contact_email: '',
  company_addres: '',
  company_descri: '',
});

const formLabelWidth = '120px';

const rules = {
  domin: [{ required: true, message: '请输入小程序域名', trigger: 'blur' }],
  privacy_policy: [{ required: true, message: '请输入隐私政策', trigger: 'blur' }],
  user_agreement: [{ required: true, message: '请输入用户协议', trigger: 'blur' }],
  contact_phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  contact_email: [{ required: true, message: '请输入联系邮箱', trigger: 'blur' }],
  company_addres: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
  company_descri: [{ required: true, message: '请输入公司简介', trigger: 'blur' }],
};

const handleClose = () => {
  // handle close
};

const handleSave = (formRef) => {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiCall = form.value.id ? fetchUpdateUser : fetchAddUser;
      apiCall(form.value)
        .then(() => {
          ElMessage.success('保存成功');
        })
        .catch(() => {
          ElMessage.error('保存失败');
        });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
