/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-02-26 12:44:00
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/store/permiss.ts
 */
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
	state: () => {
		const menu = sessionStorage.getItem('menu');
		return {
			menu: menu ? JSON.parse(menu) : <string[]>[],
		};
	},
});

export const useConstantStore = defineStore('constant', {
	state: () => {
		const constant = sessionStorage.getItem('constant');
		return {
			key: constant ? JSON.parse(constant) : <string[]>[],
		};
	},
});
