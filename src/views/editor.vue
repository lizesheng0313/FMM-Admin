<!--
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-02-26 19:40:25
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/views/editor.vue
-->
<template>
	<div class="container">
		<div class="plugins-tips">
			wangEditor：轻量级 web 富文本编辑器，配置方便，使用简单。 访问地址：
			<a href="https://www.wangeditor.com/doc/" target="_blank">wangEditor</a>
		</div>
		<div class="mgb20" ref="editor"></div>
		<el-button type="primary" @click="syncHTML">提交</el-button>
	</div>
</template>

<script setup lang="ts" name="editor">
import WangEditor from 'wangeditor';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const editor = ref(null);
const content = reactive({
	html: '',
	text: ''
});
let instance: any;
onMounted(() => {
	instance = new WangEditor(editor.value);
	instance.config.zIndex = 1;
	instance.create();
});
onBeforeUnmount(() => {
	instance.destroy();
	instance = null;
});
const syncHTML = () => {
	content.html = instance.txt.html();
	console.log(content.html);
};
</script>

<style></style>
