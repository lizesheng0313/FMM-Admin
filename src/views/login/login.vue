<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">登录</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input class="login-input" v-model="param.username" placeholder="请输入用户名">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="login-input"
            type="password"
            placeholder="请输入密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-box" @click="submitForm(login)">
          <div class="login-btn-wrap">
            <div class="login-btn" :style="{ left: state.flag == true ? '0' : '-100%' }"></div>
            <div class="btn" @mouseenter="toggleHover(true)" @mouseleave="toggleHover(false)">
              登录<el-icon class="loading-icon round-animation" v-if="loading"><Loading /></el-icon>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../../store/tags';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { fetchLogin } from '@api/user/index';
import { useMenuStore, userInfoSet, useBasciInfo } from '@store/permiss';
import md5 from 'js-md5';

interface LoginInfo {
  username: string;
  password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
  username: '',
  password: '',
});
const loading = ref(false);
const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const state = reactive({ flag: false });
const login = ref<FormInstance>();
const menuStore = useMenuStore();
const userInfo = userInfoSet();
const basicInfo = useBasciInfo();
const submitForm = (formEl: FormInstance | undefined) => {
  if (loading.value) return;
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      await fetchLogin({
        username: param.username,
        // @ts-ignore
        password: md5(param.password),
      }).finally(() => {
        loading.value = false;
      });
      ElMessage.success('登录成功');
      router.push('/auth');
    }
  });
};
const toggleHover = (flag: boolean) => {
  state.flag = flag;
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.loading-icon {
  margin-left: 10px;
}
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  border-bottom: 1px solid #dedede;
}

:deep(.el-input-group__prepend) {
  background: transparent;
  box-shadow: none;
}

.login-wrap {
  background: url('../../assets/images/bg-01.jpg');
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
}

.ms-login {
  width: 500px;
  background: #fff;
  border-radius: 10px;
  padding: 55px;
}

.ms-title {
  font-size: 39px;
  color: #333333;
  line-height: 1.2;
  text-align: center;
  margin-bottom: 20px;
}

.login-input {
  font-size: 16px;
  color: #333333;
  margin-top: 20px;
  line-height: 1.2;
  height: 55px;
  background: transparent;
  border: none;
}

.login-box {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 50px;
}

.login-btn-wrap {
  width: 400px;
  display: block;
  position: relative;
  z-index: 1;
  border-radius: 25px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 5px 30px 0px rgb(3 216 222 / 20%);
}

.login-btn {
  position: absolute;
  z-index: -1;
  width: 300%;
  height: 100%;
  background: #a64bf4;
  background: -webkit-linear-gradient(right, #00dbde, #fc00ff, #00dbde, #fc00ff);
  background: -o-linear-gradient(right, #00dbde, #fc00ff, #00dbde, #fc00ff);
  background: -moz-linear-gradient(right, #00dbde, #fc00ff, #00dbde, #fc00ff);
  background: linear-gradient(right, #00dbde, #fc00ff, #00dbde, #fc00ff);
  top: 0;
  left: -100%;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.btn {
  font-size: 16px;
  color: #fff;
  line-height: 1.2;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  cursor: pointer;
}

:deep(.el-form-item__error) {
  left: 40px;
}
</style>
