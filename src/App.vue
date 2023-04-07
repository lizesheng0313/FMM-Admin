<!--
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-07 14:01:11
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/App.vue
-->
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
    if (!localStorage.getItem('authorization')) {
        router.push('/login')
    }
});
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
