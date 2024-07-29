<template>
  <el-form ref="menuForm" :model="menuForm" :rules="menuFormRules" label-width="80px">
    <el-form-item label="菜单名称" prop="title">
      <el-input v-model="menuForm.title"></el-input>
    </el-form-item>
    <el-form-item label="菜单图标" prop="icon">
      <el-input v-model="menuForm.icon"></el-input>
    </el-form-item>
    <el-form-item label="菜单地址" prop="menuUrl">
      <el-input v-model="menuForm.menuUrl"></el-input>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="submitForm">添加菜单</el-button>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { ElForm, ElMessage } from 'element-plus';

export default defineComponent({
  name: 'AddMenu',
  components: {
    ElForm,
  },
  setup() {
    const menuForm = reactive({
      title: '',
      icon: '',
      menuUrl: '',
    });

    const menuFormRules = {
      title: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
      ],
      icon: [
        { required: true, message: '请输入菜单图标', trigger: 'blur' },
      ],
      menuUrl: [
        { required: true, message: '请输入菜单地址', trigger: 'blur' },
      ],
    };

    function submitForm() {
      // const form = ($refs.menuForm as ElForm).validate((valid: boolean) => {
      //   if (valid) {
      //     // TODO: 发送添加菜单的请求
      //     ElMessage.success('添加菜单成功');
      //   } else {
      //     return false;
      //   }
      // });
    }

    return {
      menuForm,
      menuFormRules,
      submitForm,
    };
  },
});
</script>
