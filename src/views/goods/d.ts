
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
  order: string;
  pictureList: string[]; // 明确指定为 string 类型的数组
  volume: number;
  href:string,
  freight:string | number
}