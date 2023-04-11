<!--
 * @Author: lizesheng
 * @Date: 2023-04-07 16:21:29
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-07 21:24:20
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/views/category/index.vue
-->
<template>
  <div class="add-category">
    <el-row>
      <el-col :span="6">
        <div class="category-tree">
          <el-tree :data="categoryTree" :props="defaultProps" default-expand-all :highlight-current="true"
            :expand-on-click-node="false" @current-change="handleCurrentChange" @node-click="handleNodeClick">
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ data?.name }}</span>
                <span class="tree-node-actions">
                  <el-button type="text" size="mini" @click.stop="handleDelete(node)">
                    <el-icon>
                      <el-icon-delete />
                    </el-icon>
                  </el-button>
                </span>
              </span>
            </template>
          </el-tree>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">
            添加分类
          </el-button>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="category-detail">
          <el-form :model="currentCategory" ref="categoryForm" label-width="80px" style="width: 80%; margin: 0 auto;">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="currentCategory.name" />
            </el-form-item>
            <el-form-item label="父级分类">
              <el-input v-if="!currentCategory.parent" value="顶级分类" disabled />
              <el-input v-else :value="getParentName(currentCategory.parent)" disabled />
            </el-form-item>
            <el-form-item label="排序" prop="order">
              <el-input-number v-model="currentCategory.order" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSave">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
// 双向绑定当前选中的分类对象
const currentCategory = reactive({
  name: '',
  parent: null,
  order: 0,
})

const defaultProps = {
  children: 'children',
  label: 'name',
}

// 树结构数据
const categoryTree = reactive([
  {
    id: 1,
    name: '服饰',
    order: 0,
    children: [
      {
        id: 2,
        name: '男装',
        order: 0,
        children: [
          {
            id: 4,
            name: '上装',
            order: 0,
          },
          {
            id: 5,
            name: '下装',
            order: 0,
          },
        ],
      },
      {
        id: 3,
        name: '女装',
        order: 0,
      },
    ],
  },
  {
    id: 6,
    name: '餐饮',
    order: 0,
  },
])



// 点击分类树节点时触发
const handleNodeClick = (data) => {
  currentCategory.name = data.name
  currentCategory.parent = data.parentId
  currentCategory.order = data.order
}


const handleEdit = () => { }
const handleDelete = () => { }
// 新增分类
const addCategory = () => {
  // TODO: 实现新增分类逻辑
}

// 编辑分类
const editCategory = () => {
  // TODO: 实现编辑分类逻辑
}

// 删除分类
const deleteCategory = () => {
  // TODO: 实现删除分类逻辑
}
</script>
