<template>
  <div class="container">
    <div class="form-warp">
      <el-card>
        <div class="form-box">
          <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
             <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="classiFication">
              <el-cascader
                :props="{ label: 'label', value: 'id' }"
                :options="options.list"
                v-model="form.classiFication"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="主图" prop="pictureList">
              <ImageUpload v-model="form.pictureList" />
            </el-form-item>
            <el-form-item prop="specification" label="商品规格">
              <div class="box-card">
                <div v-for="(item, index) in specification" :key="index" class="box-card-item">
                  <span class="name">{{ item.name }}:</span>
                  <el-tag v-for="(tag, i) in item.tag" :key="tag" class="mx-1" closable @close="handleClose(index, i)">
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="inputVisible[index]"
                    :ref="(inputRef) => (inputRefs[index] = inputRef)"
                    v-model="inputValue"
                    class="spce-input"
                    size="small"
                    @keyup.enter="handleInputConfirm(index)"
                    @blur="handleInputConfirm(index)"
                  />
                  <el-button v-else size="small" @click="showInput(index)"> + New Tag </el-button>
                  <el-button size="small" class="del-margin" type="danger" @click="handleDeleteSpec(index)"
                    >删除</el-button
                  >
                </div>
                <div class="footer-group">
                  <el-input size="small" v-model="spacName" placeholder="请输入规格"></el-input>
                  <el-button size="small" type="primary" @click="handleAddSpecif" class="add-spec">新增规格</el-button>
                  <el-button size="small" type="primary" @click="handleSku" class="add-spec">生成SKU</el-button>
                </div>
              </div>
              <el-table :data="skuTable" style="width: 100%" v-if="skuTable.length > 0">
                <el-table-column
                  v-for="(column, index) in columns"
                  :key="index"
                  :prop="column.prop"
                  :label="column.label"
                ></el-table-column>
                <el-table-column prop="goods_picture" label="图片" width="150">
                  <template #default="{ row }">
                    <ImageUpload v-model="row.goods_picture" :single="true" :compact="true" />
                  </template>
                </el-table-column>
                <el-table-column prop="skuPrice" label="售价">
                  <template #default="{ row }">
                    <el-input v-model="row.skuPrice"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="skuOriginPrice" label="原价">
                  <template #default="{ row }">
                    <el-input v-model="row.skuOriginPrice"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="cost_price" label="成本">
                  <template #default="{ row }">
                    <el-input v-model="row.cost_price"></el-input>
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
            <el-form-item label="运费" prop="freight">
              <el-input v-model="form.freight"></el-input>
            </el-form-item>
            <el-form-item label="商品货号" prop="number">
              <el-input v-model="form.number"></el-input>
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
              <el-button plain @click="router.back()">取消</el-button>
              <el-button type="primary" @click="onSubmit(formRef)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import WangEditor from 'wangeditor';
import { ElMessage, ElInput } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import ImageUpload from '@components/ImageUpload.vue';
import {
  fetchClassiFication,
  fetchAddGoods,
  fetchGoodsGetDetails,
  fetchUpdateGoods,
  fetchGetTargetInfo,
} from '@api/goods';
import { useRouter } from 'vue-router';
import { Plus, Delete } from '@element-plus/icons-vue';
import { isImageUrl } from '@utils/utils';
import { Specification, Classification, Form, Columns } from './d';

const loading = ref(false);
const outerSeparator = '|';
const innerSeparator = '!';
// 规格
const inputValue = ref('');
const spacName = ref('');
const specification = ref<Specification[]>([]);
const inputVisible = ref(<boolean[]>[]);
const inputRefs = ref<any[]>([]);
const skuTable = ref<[]>([]);
const skuCopyTable = ref<[]>([]);
const columns = ref<Columns[]>([]);
const handleAddSpecif = () => {
  if (spacName.value) {
    specification.value.push({
      name: `${spacName.value}`,
      tag: [],
    });
    spacName.value = '';
  }
};

const handleClose = (index: number, i: number) => {
  const row = specification.value[index];
  row.tag.splice(i, 1)[0]; // 删除指定位置的元素，并返回删除的元素
};

const showInput = (index: number) => {
  inputVisible.value[index] = true;
  nextTick(() => {
    inputRefs.value[index]?.focus();
  });
};
const handleDeleteSpec = (index: number) => {
  specification.value.splice(index, 1);
};
const handleInputConfirm = (index: number) => {
  const row = specification.value[index];
  if (inputValue.value) {
    row.tag.push(inputValue.value);
  }
  inputVisible.value[index] = false;
  inputValue.value = '';
};

function getColumns() {
  const labelName = specification.value.map((item) => ({ name: item.name }));
  columns.value = labelName.map((item, index) => ({
    prop: `name${index}`,
    label: item.name,
  }));
}

const matchAndMergeData = (skuTable: any, sku: any) => {
  const result = skuTable.map((tableRow: any) => {
    const matchedSku = sku.find((skuRow: any) => {
      return Object.keys(tableRow).every((key) => {
        return tableRow[key] === skuRow[key];
      });
    });
    return {
      ...tableRow,
      ...matchedSku,
    };
  });
  return result;
};

const handleSku = () => {
  getColumns();
  // 将笛卡尔积转换为对象
  const skuTableArr = cartesian(...specification.value.map((item) => item.tag)).map((item: any, index: number) => {
    const obj: any = {};
    item.forEach((tag: any, i: number) => {
      obj[`name${i}`] = tag;
    });
    return obj;
  });
  skuTable.value = matchAndMergeData(skuTableArr, skuCopyTable.value);
};

// 生成笛卡尔积
const cartesian = function (...args: any) {
  return args.reduce(
    (prev: any, curr: any) => {
      let res: any = [];
      prev.forEach((p: any) => {
        curr.forEach((c: any) => {
          res.push(p.concat(c));
        });
      });
      return res;
    },
    [[]]
  );
};

function handleDelete(index: number) {
  skuTable.value.splice(index, 1);
}
const options = reactive<{ list: Classification[] }>({ list: [] });
const router = useRouter();
const formRef = ref<FormInstance>();
const form: Form = reactive({
  classiFication: '',
  name: '',
  introduction: '',
  number: '',
  order: '',
  pictureList: [],
  volume: 0,
  href: '',
  freight: 0,
});
const id = router?.currentRoute?.value?.query?.id;
const editor = ref(null);
// 编辑
if (id) {
  fetchGoodsGetDetails({
    id,
  }).then((res) => {
    // 将字符串转回数组
    const items = res.data.specification.split('|');
    const result = [];
    for (let i = 0; i < items.length; i += 2) {
      const name = items[i];
      const tagStr = items[i + 1];
      const tags = tagStr ? tagStr.split('!') : [];
      result.push({
        name,
        tag: tags,
      });
    }
    specification.value = result;
    // 反序列化
    Object.assign(form, res?.data, {
      classiFication: JSON.parse(res?.data?.classiFication),
    });
    skuTable.value = res?.data?.sku || [];
    skuCopyTable.value = res?.data?.sku || [];
    instance.txt.html(res?.data?.introduction);
    getColumns();
  });
}
const content = reactive({
  html: '',
  text: '',
});
let instance: any;

onMounted(() => {
  instance = new WangEditor(editor.value);
  instance.config.zIndex = 1;

  // 配置图片上传
  instance.config.uploadImgServer = '/api/admin/upload';
  instance.config.uploadImgHeaders = {
    type: 'goodsImage',
    authorization: sessionStorage.getItem('authorization') || '',
  };
  instance.config.uploadFileName = 'file';
  instance.config.uploadImgMaxSize = 20 * 1024 * 1024; // 20MB
  instance.config.uploadImgMaxLength = 10; // 一次最多上传10张
  instance.config.uploadImgTimeout = 60 * 1000; // 60秒超时

  // 自定义上传图片的返回格式
  instance.config.uploadImgHooks = {
    customInsert: function (insertImgFn: any, result: any) {
      // result 是服务器返回的数据
      if (result.code === 0 && result.data && result.data.path) {
        insertImgFn(result.data.path);
      } else {
        ElMessage.error(result.message || '图片上传失败');
      }
    },
    fail: function (xhr: any, editor: any, resData: any) {
      ElMessage.error('图片上传失败');
    },
    error: function (xhr: any, editor: any, resData: any) {
      ElMessage.error('图片上传出错');
    },
  };

  instance.create();
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});

fetchClassiFication().then((res) => {
  options.list = res.data.list;
});

async function handleSetImageSku(row: any) {
  if (!row.goods_picture) return;
  if (!(await isImageUrl(row.goods_picture))) {
    ElMessage.warning('图片地址不正确');
    row.goods_picture = '';
    return;
  }
}

const rules: FormRules = {
  classiFication: [{ required: true, message: '请选择分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  number: [{ message: '请输入商品货号', trigger: 'blur' }],
  order: [{ required: true, message: '请输入商品排序', trigger: 'blur' }],
  pictureList: [
    {
      required: true,
      message: '请上传至少一张图片',
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (value && value.length > 0) {
          callback();
        } else {
          callback(new Error('请上传至少一张图片'));
        }
      },
    },
  ],
};

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      // 将数组转成字符串
      const str = specification.value
        .map((item) => {
          const tagStr = item.tag ? item.tag.join(innerSeparator) : ''; // 将tag数组拼接成一个字符串
          return `${item.name}${outerSeparator}${tagStr}`;
        })
        .join(outerSeparator); // 将每个对象的字符串拼接成一个总的字符串

      content.html = instance.txt.html();
      const params = {
        ...form,
        sku: skuTable.value,
        specification: str,
        introduction: content.html,
        classiFication: JSON.stringify(form.classiFication),
      };
      if (id) {
        await fetchUpdateGoods(params).then((res) => {
          ElMessage.success('修改成功！');
          router.back();
        });
      } else {
        await fetchAddGoods(params).then((res) => {
          ElMessage.success('新增成功！');
          router.back();
        });
      }
    }
    return;
  });
};
</script>
<style lang="scss" scoped>
.loading {
  position: absolute;
  right: 0;
}

.picture-list {
  .picture-add-item {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;

    .delete {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      .el-icon {
        color: #f56c6c;
        font-size: 16px;
      }

      &:hover {
        background: #fee;
      }
    }
  }

  .add_image {
    display: inline-block;
    width: 148px;
    height: 148px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    background: #fbfdff;

    .upload-button {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #8c939d;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }
    }
  }
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
    flex-wrap: wrap;
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

.sku-image-item {
  position: relative;
  display: inline-block;

  .sku-delete {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    .el-icon {
      color: #f56c6c;
      font-size: 14px;
    }

    &:hover {
      background: #fee;
    }
  }
}

.sku-image-upload {
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}
</style>
