<!--
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-01 11:18:10
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/views/home.vue
-->
<template>
	<v-header />
	<div class="home-box">
		<v-sidebar />
		<div class="content-box" :class="{ 'content-collapse': !sidebar.collapse }">
			<v-tags></v-tags>
			<div class="content">
				<router-view v-slot="{ Component }">
					<transition name="move" mode="out-in">
						<keep-alive :include="tags.nameList">
							<component :is="Component"></component>
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar';
import { useTagsStore } from '../store/tags';
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vTags from '../components/tags.vue';

const sidebar = useSidebarStore();
const tags = useTagsStore();
</script>
<style scoped>
.home-box {
	display: flex;
	width: 100%
}
</style>
