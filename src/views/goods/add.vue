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
            <el-form-item label="主图" prop="pctureList" class="picture-list">
              <div v-for="(imageUrl, index) in form.pictureList" :key="index" class="picture-add-item">
                <div class="delete" @click="handleDeleteImg(index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </div>
                <el-image :preview-src-list="form.pictureList" fit="contain" style="width: 148px; height: 148px"
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
            <el-form-item prop="specification" label="商品规格">
              <div class="box-card">
                <div v-for="(item, index) in specification" :key="index" class="box-card-item">
                  <span class="name">{{ item.name }}:</span>
                  <el-tag v-for="(tag, i) in item.tag" :key="tag" class="mx-1" closable @close="handleClose(index, i)">
                    {{ tag }}
                  </el-tag>
                  <el-input v-if="inputVisible[index]" :ref="inputRef => inputRefs[index] = inputRef" v-model="inputValue"
                    class="spce-input" size="small" @keyup.enter="handleInputConfirm(index)"
                    @blur="handleInputConfirm(index)" />
                  <el-button v-else size="small" @click="showInput(index)">
                    + New Tag
                  </el-button>
                  <el-button size="small" class="del-margin" type="danger" @click="handleDeleteSpec(index)">删除</el-button>
                </div>
                <div class="footer-group">
                  <el-input size="small" v-model="spacName" placeholder="请输入规格"></el-input>
                  <el-button size="small" type="primary" @click="handleAddSpecif" class="add-spec">新增规格</el-button>
                  <el-button size="small" type="primary" @click="handleSku" class="add-spec">生成SKU</el-button>
                </div>
              </div>
              <el-table :data="skuTable" style="width: 100%" v-if="skuTable.length > 0">
                <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop"
                  :label="column.label"></el-table-column>
                <el-table-column prop="skuPrice" label="价格">
                  <template #default="{ row }">
                    <el-input v-model="row.skuPrice"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="skuStock" label="库存">
                  <template #default="{ row }">
                    <el-input v-model="row.skuStock"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import WangEditor from 'wangeditor';
import { ElMessage, ElInput } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { fetchClassiFication, fetchAddGoods, fetchGoodsGetDetails, fetchUpdateGoods } from '../../api/goods/index'
import { useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';
import { isImageUrl } from '../../utils/utils'
import { Specification, Classification, Form, Columns } from './d'

// 规格 
const inputValue = ref('')
const spacName = ref('')
const specification = ref<Specification[]>([]);
const inputVisible = ref(<boolean[]>[])
const inputRefs = ref<(any)[]>([]);
const skuTable = ref<[]>([])
const columns = ref<Columns[]>([])
const handleAddSpecif = () => {
  if (spacName.value) {
    specification.value.push({
      name: `${spacName.value}`,
      tag: []
    })
    spacName.value = ''
  }
}
const handleClose = (index: number, i: number) => {
  const row = specification.value[index]
  row.tag.splice(i, 1)[0]; // 删除指定位置的元素，并返回删除的元素
}

const showInput = (index: number) => {
  inputVisible.value[index] = true
  nextTick(() => {
    inputRefs.value[index]?.focus();
  });
}
const handleDeleteSpec = (index: number) => {
  specification.value.splice(index, 1)
}
const handleInputConfirm = (index: number) => {
  const row = specification.value[index]
  if (inputValue.value) {
    row.tag.push(inputValue.value)
  }
  inputVisible.value[index] = false
  inputValue.value = ''
}

function getColumns() {
  const labelName = specification.value.map(item => ({ name: item.name }));
  columns.value = labelName.map((item, index) => ({
    prop: `name${index}`,
    label: item.name
  }))
}

const handleSku = () => {
  getColumns()
  // 将笛卡尔积转换为对象
  skuTable.value = cartesian(...specification.value.map(item => item.tag))
    .map((item: any, index: number) => {
      const obj: any = {};
      item.forEach((tag: any, i: number) => {
        obj[`name${i}`] = tag;
      });
      return obj;
    });
}

// 生成笛卡尔积
const cartesian = function (...args: any) {
  return args.reduce((prev: any, curr: any) => {
    let res: any = [];
    prev.forEach((p: any) => {
      curr.forEach((c: any) => {
        res.push(p.concat(c));
      });
    });
    return res;
  }, [[]]);
};



function handleDelete(index: number) {
  skuTable.value.splice(index, 1)
}
// 规格结束
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
  volume: 0,
});
const id = router?.currentRoute?.value?.query?.id;
const editor = ref(null);
// 编辑
if (id) {
  fetchGoodsGetDetails({
    id
  }).then(res => {
    specification.value = JSON.parse(res?.data?.specification) || []
    Object.assign(form, res?.data, {
      classiFication: JSON.parse(res?.data?.classiFication)
    });
    skuTable.value = res?.data?.sku || []
    instance.txt.html(res?.data?.introduction)
    getColumns()

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
        sku: skuTable.value,
        specification: JSON.stringify(specification.value),
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

.box-card {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #f8f9fc;
  padding: 10px;

  .name {
    margin-right: 10px;
  }

  .box-card-item {
    display: flex;
    align-items: center;

    :deep(.el-tag) {
      margin-right: 5px;
    }

    :deep(.el-input) {
      width: 80px;
      height: 24px;
    }
  }

}

.spce-input {
  width: 80.81px !important;
}

.del-margin {
  margin: 0;
  margin-left: 12px;
}

.footer-group {
  display: flex;
  align-items: center;
  margin-top: 10px;

  .el-input {
    width: 80px;
    height: 24px;
    margin-right: 5px;

  }
}
</style>>


