<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="商品分类" prop="classiFication">
          <el-cascader :options="options" v-model="form.classiFication"></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="副名称" prop="goodsSubName">
          <el-input v-model="form.goodsSubName"></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brand">
          <el-select v-model="form.brand" placeholder="请选择">
            <el-option key="小明" label="小明" value="小明"></el-option>
            <el-option key="小红" label="小红" value="小红"></el-option>
            <el-option key="小白" label="小白" value="小白"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品介绍" prop="introduction">
          <el-input type="textarea" rows="5" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item label="商品货号" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="price">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品原价" prop="originPrice">
          <el-input v-model="form.originPrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="quantity">
          <el-input v-model="form.quantity" type="number"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model="form.order" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品上架" prop="shelf">
          <el-switch v-model="form.online"></el-switch>
        </el-form-item>
        <template>
          <el-form-item label="新品" prop="shelf">
            <el-switch v-model="form.new"></el-switch>
          </el-form-item>
          <el-form-item label="推荐" prop="shelf">
            <el-switch v-model="form.recommend"></el-switch>
          </el-form-item>
        </template>
        <el-form-item label="属性类型" prop="attribute">
          <el-select v-model="form.attribute" placeholder="请选择">
            <el-option key="小明" label="小明" value="小明"></el-option>
            <el-option key="小红" label="小红" value="小红"></el-option>
            <el-option key="小白" label="小白" value="小白"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

const options = [
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          {
            value: 'tianhe',
            label: '天河区',
          },
          {
            value: 'haizhu',
            label: '海珠区',
          },
        ],
      },
      {
        value: 'dongguan',
        label: '东莞市',
        children: [
          {
            value: 'changan',
            label: '长安镇',
          },
          {
            value: 'humen',
            label: '虎门镇',
          },
        ],
      },
    ],
  },
  {
    value: 'hunan',
    label: '湖南省',
    children: [
      {
        value: 'changsha',
        label: '长沙市',
        children: [
          {
            value: 'yuelu',
            label: '岳麓区',
          },
        ],
      },
    ],
  },
];
const rules: FormRules = {
  goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  classiFication: '',
  goodsName: '',
  goodsSubName: '',
  brand: '',
  introduction: '',
  number: '',
  price: '',
  originPrice: '',
  quantity: '',
  order: '小红',
  new: false,
  recommend: false,
  online: false,
  attribute: '',
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(form);
      ElMessage.success('提交成功！');
    } else {
      return false;
    }
  });
};

</script>
