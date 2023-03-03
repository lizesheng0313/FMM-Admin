/*
 * @Author: lizesheng
 * @Date: 2023-03-03 11:17:32
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-03 16:01:30
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/views/goods/d.ts
 */
export interface Columns {
  prop:string,
  label:string
}
export interface Specification {
  name: string;
  tag: Array<string>
}
export interface Classification {
  label: string,
  value: number
}
export interface Form {
  classiFication: string;
  name: string;
  introduction: string;
  number: string;
  price: string;
  originPrice: string;
  quantity: string;
  order: string;
  pictureList: string[]; // 明确指定为 string 类型的数组
  volume: number;
}