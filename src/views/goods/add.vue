<template>
  <div class="container">
    <div class="form-warp">
      <el-card>
        <div class="form-box">
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="商品分类" prop="classiFication">
              <el-cascader :options="options.list" v-model="form.classiFication"></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品介绍" prop="introduction">
          <el-input type="textarea" rows="5" v-model="form.introduction"></el-input>
        </el-form-item> -->
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
            <el-form-item label="销量" prop="volume">
              <el-input v-model="form.volume" type="number"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="mgb20" ref="editor"></div>
            </el-form-item>

            <!-- <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        </el-upload> -->
            <el-form-item>
              <el-button plain @click=router.back(-1)>取消</el-button>
              <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts" >
import { reactive, ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import WangEditor from 'wangeditor';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchClassiFication, fetchAddGoods } from '../../api/goods/index'
import { useRouter } from 'vue-router';

interface Classification {
  label: string,
  value: number
}
const options = reactive<{ list: Classification[] }>({ list: [] });
const router = useRouter();
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

fetchClassiFication().then(res => {
  options.list = res.data.list;
})

const rules: FormRules = {
  classiFication: [{ required: true, message: '请选择分类', trigger: 'blur' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  classiFication: '',
  name: '',
  introduction: '',
  number: '',
  price: '',
  originPrice: '',
  quantity: '',
  order: '',
  volume: 0
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      content.html = instance.txt.html();
      const params = {
        ...form,
        classiFication: form.classiFication[form.classiFication.length - 1],
        introduction: content.html
      }
      await fetchAddGoods(params).then(res => {
        ElMessage.success('提交成功！');
        console.log(res, '成功')
      })
    } else {
      return false;
    }
  });
};

</script>
