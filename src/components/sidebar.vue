<!--
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-01 11:07:59
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/components/sidebar.vue
-->
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in menuStore.menu">
                <template v-if="item.children">
                    <el-sub-menu :index="item.menuUrl" :key="item.id">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children" :key="subItem.id">
                            <el-sub-menu v-if="subItem.children" :index="subItem.menuUrl" :key="subItem.id">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="threeItem in subItem.children" :key="threeItem.id"
                                    :index="threeItem.menuUrl">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.menuUrl">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menuUrl" :key="item.id">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useMenuStore } from '../store/permiss'
import { useRoute } from 'vue-router';

const menuStore = useMenuStore()

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();

</script>

<style scoped>
.sidebar {
    flex: 0;
    max-width: 250px;
}

.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}

.sidebar>ul {
    height: 100%;
}
</style>
