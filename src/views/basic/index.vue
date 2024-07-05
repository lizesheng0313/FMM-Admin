<template>
  <el-form :model="form" ref="formRef" :rules="rules">
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form-item label="appid" :label-width="formLabelWidth" prop="appid">
        <el-select v-model="form.eid" placeholder="请选择appid">
          <el-option v-for="item in appidList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小程序请求域名" :label-width="formLabelWidth" prop="domin">
        <el-input v-model="form.domin" placeholder="例:https://zjkdongao.com"></el-input>
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
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span>法律条款</span>
      </div>
      <el-form-item label="隐私政策" :label-width="formLabelWidth" prop="privacy_policy">
        <el-input type="textarea" rows="3" v-model="form.privacy_policy" placeholder="请输入隐私政策"></el-input>
      </el-form-item>
      <el-form-item label="用户协议" :label-width="formLabelWidth" prop="user_agreement">
        <el-input type="textarea" rows="3" v-model="form.user_agreement" placeholder="请输入用户协议"></el-input>
      </el-form-item>
    </el-card>
    <div style="display: grid; justify-content: end; margin-top: 10px">
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchBasic, fetchUpdateBasic, fetchAddBasic } from '@api/basic';
import { getAppIdList } from '@api/common';

const form = ref({
  id: '',
  eid: '',
  domin: '',
  privacy_policy: '',
  user_agreement: '',
  contact_phone: '',
  contact_email: '',
  company_addres: '',
  company_descri: '',
});
const formRef = ref();
const formLabelWidth = '160px';
const appidList = ref<AppIdList[]>([]);

onMounted(() => {
  fetchBasic().then((res) => {
    form.value = res.data;
  });
  getAppIdList().then((res) => {
    appidList.value = res.data;
  });
});

const rules = {
  domin: [{ required: true, message: '请输入小程序请求域名', trigger: 'blur' }],
  privacy_policy: [{ required: true, message: '请输入隐私政策', trigger: 'blur' }],
  user_agreement: [{ required: true, message: '请输入用户协议', trigger: 'blur' }],
};

const handleSave = (formRef: any) => {
  formRef.validate((valid: boolean) => {
    if (valid) {
      const apiCall = form.value.id ? fetchUpdateBasic : fetchAddBasic;
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
