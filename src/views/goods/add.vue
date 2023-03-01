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
            <el-form-item label="主图" prop="pictureList" class="picture-list">
              <div v-for="(imageUrl, index) in form.pictureList" :key="index" class="picture-add-item">
                <div class="delete" @click="handleDeleteImg(index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </div>
                <el-image :preview-src-list="form.pictureList" fit="cover" style="width: 148px; height: 148px"
                  :src="imageUrl" :initial-index="index"></el-image>
              </div>
              <div class="add_image">
                <el-input :onblur="handleSetImage" v-model="imageAddress" placeholder="图片地址">
                  <template #prepend>
                    <el-button :icon="Plus" />
                  </template>
                </el-input>
              </div>
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
            <el-form-item label="销量" prop="volume">
              <el-input v-model="form.volume" type="number"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="mgb20" ref="editor"></div>
            </el-form-item>

            <el-form-item>
              <el-button plain @click=router.back()>取消</el-button>
              <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts" >
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import WangEditor from 'wangeditor';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchClassiFication, fetchAddGoods, fetchGoodsGetDetails, fetchUpdateGoods } from '../../api/goods/index'
import { useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';
import { isImageUrl } from '../../utils/utils'

interface Classification {
  label: string,
  value: number
}
interface Form {
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

const options = reactive<{ list: Classification[] }>({ list: [] });
const router = useRouter();
const imageAddress = ref('')
const formRef = ref<FormInstance>();
const form: Form = reactive({
  classiFication: '',
  name: '',
  introduction: '',
  number: '',
  price: '',
  originPrice: '',
  quantity: '',
  order: '',
  pictureList: [],
  volume: 0
});
const id = router?.currentRoute?.value?.query?.id;
const editor = ref(null);
if (id) {
  fetchGoodsGetDetails({
    id
  }).then(res => {
    Object.assign(form, res?.data, {
      classiFication: JSON.parse(res?.data?.classiFication)
    });
    instance.txt.html(res?.data?.introduction)
  })
}
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

async function handleSetImage() {
  if (!imageAddress.value) return
  if (!await isImageUrl(imageAddress.value)) {
    ElMessage.warning('图片地址不正确')
    return
  }
  form.pictureList.push(imageAddress?.value)
  imageAddress.value = ''
}

function handleDeleteImg(index: number) {
  form.pictureList.splice(index, 1)
}

const rules: FormRules = {
  classiFication: [{ required: true, message: '请选择分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  number: [{ required: true, message: '请输入商品货号', trigger: 'blur' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  originPrice: [{ required: true, message: '请输入商品原价', trigger: 'blur' }],
  order: [{ required: true, message: '请输入商品排序', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
  pictureList: [{
    required: true, message: '请上传至少一张图片', trigger: 'change', validator: (rule, value, callback) => {
      if (value && value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传至少一张图片'));
      }
    },
  }]
};

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      content.html = instance.txt.html();
      const params = {
        ...form,
        introduction: content.html,
        classiFication: JSON.stringify(form.classiFication)
      }
      if (id) {
        await fetchUpdateGoods(params).then(res => {
          ElMessage.success('修改成功！');
          router.back()
        })
      }
      else {
        await fetchAddGoods(params).then(res => {
          ElMessage.success('新增成功！');
          router.back()
        })
      }

    } else {
      return false;
    }
  });
};

</script>
<style lang="scss" scoped>
.add_image {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  padding: 0 5px;
}

:deep(.el-image) {
  font-size: 0;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fbfdff;
  border: 1px dashed #c0ccda;
}

.picture-add-item {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;

  .delete {
    color: #f56c6c;
    cursor: pointer;
  }
}

:deep(.el-form-item__content) {
  align-items: flex-start;
}
</style>>

