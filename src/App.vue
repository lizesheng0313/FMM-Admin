<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  const currentRoute = router.currentRoute.value.path;
  if (!localStorage.getItem('authorization') && currentRoute !== '/login') {
    router.push('/login');
  }
});
</script>
<style lang="scss">
@import './assets/css/main.css';
@import './assets/css/color-dark.css';

.flex {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.round-animation {
  animation: round 1s linear infinite;
}
@keyframes round {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
