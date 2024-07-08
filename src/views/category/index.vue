<template>
  <div class="add-category">
    <el-row>
      <el-col :span="10">
        <div class="category-tree">
          <el-tree
            :data="categoryTree"
            :props="defaultProps"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node" @click="handleEdit(node)">
                <span>{{ data?.label }}</span>
                <span :class="node.level !== 1 ? 'tree-node-actions' : 'mr-20'">
                  <el-tooltip v-if="data?.parentId" :hide-after="0" content="删除">
                    <el-button type="text" size="small" @click.stop="handleDelete(node)">
                      <el-icon>
                        <el-icon-delete />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="添加" :hide-after="0">
                    <el-button style="margin-left: 0" type="text" size="small" @click.stop="handleAdd(node)">
                      <el-icon>
                        <el-icon-plus />
                      </el-icon>
                    </el-button>
                  </el-tooltip>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="category-detail">
          <el-form
            ref="myForm"
            :model="currentCategory"
            label-width="80px"
            style="width: 80%; margin: 0 auto"
            v-if="openInfo?.type || categoryTree?.length === 0"
          >
            <el-form-item label="父级名称" prop="parentLabel" required v-if="openInfo.type === 'add'">
              <el-input v-model="currentCategory.parentLabel" :disabled="openInfo?.type === 'add'" />
            </el-form-item>
            <el-form-item :label="openInfo.type === 'edit' ? '分类名称' : '名称'" prop="label" required>
              <el-input v-model="currentCategory.label" />
            </el-form-item>
            <el-form-item label="分类图标">
              <el-input v-model="currentCategory.icon" placeholder="请输入线上链接" />
            </el-form-item>
            <el-form-item label="分类图标" prop="icon" v-if="categoryTree?.length !== 0 && currentCategory.parentId">
              <el-upload
                :headers="uploadHeaders"
                class="avatar-uploader"
                action="/api/admin/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div>
                  <img v-if="currentCategory.icon" :src="currentCategory.icon" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon el-upload-list__item-thumbnail"><Plus /></el-icon>
                  <span
                    v-if="currentCategory.icon"
                    :src="currentCategory.icon"
                    class="el-upload-list__item-actions"
                    @click.stop="handleRemove"
                  >
                    <span class="el-upload-list__item-preview">
                      <el-icon><delete /></el-icon>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="排序"
              prop="order"
              required
              v-if="categoryTree?.length !== 0 && currentCategory.parentId"
            >
              <el-input-number v-model="currentCategory.order" />
            </el-form-item>
            <el-form-item
              label="展示首页"
              prop="is_show_home"
              v-if="categoryTree?.length !== 0 && currentCategory.parentId"
            >
              <el-switch :active-value="1" :inactive-value="0" v-model="currentCategory.is_show_home" />
            </el-form-item>
            <el-form-item
              label="推荐分类"
              prop="recommend_class"
              v-if="categoryTree?.length !== 0 && currentCategory.parentId"
            >
              <el-switch :active-value="1" :inactive-value="0" v-model="currentCategory.recommend_class" />
            </el-form-item>
            <el-button type="primary" @click="handleSave"> 提交 </el-button>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { fetchGetClassiFication, fetchAddCategory, fetchEditCategory, fetchDelCategory } from '@api/category';
import { useBasciInfo } from '@store/permiss';

const basicInfo = useBasciInfo();
const currentCategory = ref({});
const openInfo = ref({});
const defaultProps = {
  children: 'children',
  label: 'label',
};
const myForm = ref(null);

// 计算属性：上传请求头
const uploadHeaders = computed(() => {
  const authorization = sessionStorage.getItem('authorization');
  return {
    type: 'categoryImage',
    authorization: authorization ? authorization : '',
  };
});

const handleAvatarSuccess = (_, uploadFile) => {
  currentCategory.value.icon = `${basicInfo?.basicInfo?.domin}/showImage/category_images/${uploadFile?.response?.data.fileName}`;
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('分类图标不能超过5MB');
    return false;
  }
  return true;
};

const handleRemove = () => {
  currentCategory.value.icon = '';
};

// 树结构数据
let categoryTree = ref([]);
const fetchTree = () => {
  fetchGetClassiFication().then((res) => {
    categoryTree.value = res.data?.list;
  });
};
fetchTree();

// 点击分类树节点时触发
const handleAdd = (data) => {
  openInfo.value = { type: 'add' };
  currentCategory.value = {
    parentId: data?.data?.id,
    parentLabel: data?.label,
  };
};

const handleEdit = (data) => {
  openInfo.value = { type: 'edit' };
  currentCategory.value = { ...data?.data };
};

const handleDelete = (data) => {
  openInfo.value = false;
  ElMessageBox.confirm('确认删除吗?', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    fetchDelCategory({
      id: data?.data?.id,
    }).then((res) => {
      ElMessage.success('删除成功');
      fetchTree();
    });
  });
};

const handleSave = () => {
  myForm.value.validate(async (valid) => {
    if (valid) {
      let res;
      if (openInfo.value.type === 'edit') {
        res = await fetchEditCategory({
          ...currentCategory?.value,
        });
      } else {
        res = await fetchAddCategory({
          ...currentCategory?.value,
        });
      }
      if (res) {
        ElMessage.success(openInfo.value.type === 'add' ? '新增成功' : '修改成功');
        fetchTree();
      }
    }
  });
};
</script>
<style lang="scss">
.add-category {
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: 0.2s;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .el-upload-list__item-actions {
    display: none;
  }
  .avatar-uploader:hover {
    .el-upload-list__item-actions {
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      align-items: center;
      justify-content: center;
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  .category-tree {
    font-size: 12px;
    .custom-tree-node {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
    .tree-node-actions {
      display: none;
    }
    .tree-node-actions,
    .mr-20 {
      margin-right: 20px;
    }
    .el-tree-node__content:hover {
      .tree-node-actions {
        display: block;
      }
    }
  }
}
</style>
