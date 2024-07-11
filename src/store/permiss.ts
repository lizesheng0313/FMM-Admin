/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-07 14:01:19
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/store/permiss.ts
 */
import { defineStore } from 'pinia';
interface MyObject {
  title: string;
  menuUrl: string;
  id: string;
  icon: string;
  children: Array<MyObject>;
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: JSON.parse(sessionStorage.getItem('menu') || '[]') as MyObject[],
  }),
  actions: {
    increment(value: MyObject[]) {
      this.menu = value;
      sessionStorage.setItem('menu', JSON.stringify(value));
    },
  },
});

export const userInfoSet = defineStore('userInfo', {
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo') || '{}'),
  }),
  actions: {
    increment(value: any) {
      this.userInfo = value;
      sessionStorage.setItem('userInfo', JSON.stringify(value || {}));
    },
  },
});

export const useBasciInfo = defineStore('basciInfo', {
  state: () => ({
    basicInfo: JSON.parse(sessionStorage.getItem('basicInfo') || '{}'),
  }),
  actions: {
    increment(value: any) {
      this.basicInfo = value;
      sessionStorage.setItem('basicInfo', JSON.stringify(value || {}));
    },
  },
});
