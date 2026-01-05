<template>
  <div class="image-upload-component">
    <!-- 多图模式 -->
    <template v-if="!single">
      <div class="image-list">
        <div v-for="(url, index) in imageList" :key="index" class="image-item">
          <el-image
            :src="url"
            fit="contain"
            :preview-src-list="imageList"
            :initial-index="index"
            :z-index="9999"
          />
          <div class="image-mask">
            <el-icon class="icon-view" @click.stop="() => handlePreview(index)"><View /></el-icon>
            <el-icon class="icon-delete" @click="removeImage(index)"><Delete /></el-icon>
          </div>
        </div>

        <div v-if="imageList.length < maxCount" class="upload-box">
          <el-upload
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            accept="image/*"
            class="upload-wrapper"
          >
            <div class="upload-trigger">
              <el-icon :size="20"><Plus /></el-icon>
            </div>
          </el-upload>

          <el-popover placement="bottom" :width="200" trigger="click">
            <template #reference>
              <el-button size="small" link class="url-btn">地址</el-button>
            </template>
            <el-input
              v-model="urlInput"
              placeholder="输入图片地址"
              size="small"
              @keyup.enter="addImageUrl"
            >
              <template #append>
                <el-button @click="addImageUrl">添加</el-button>
              </template>
            </el-input>
          </el-popover>
        </div>
      </div>
    </template>

    <!-- 单图模式 -->
    <template v-else>
      <div class="single-image" :class="{ compact: compact }">
        <template v-if="imageList[0]">
          <div class="image-item-single">
            <el-image
              :src="imageList[0]"
              fit="contain"
              :style="{ cursor: compact ? 'default' : 'pointer' }"
              :preview-src-list="compact ? [] : [imageList[0]]"
              :z-index="9999"
            />
            <div class="image-mask" v-if="!compact">
              <el-icon class="icon-view" @click.stop="handleSinglePreview($event)"><View /></el-icon>
              <el-icon class="icon-delete" @click.stop="removeImage(0)"><Delete /></el-icon>
            </div>
            <div class="image-mask-compact" v-else>
              <el-icon class="icon-delete" @click.stop="removeImage(0)"><Delete /></el-icon>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="single-upload-container">
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              accept="image/*"
              class="upload-wrapper-single"
            >
              <div class="upload-trigger-single">
                <el-icon :size="20"><Plus /></el-icon>
              </div>
            </el-upload>

            <el-popover placement="bottom" :width="200" trigger="click">
              <template #reference>
                <el-button size="small" link class="url-btn-single">地址</el-button>
              </template>
              <el-input
                v-model="urlInput"
                placeholder="输入图片地址"
                size="small"
                @keyup.enter="addImageUrl"
              >
                <template #append>
                  <el-button @click="addImageUrl">添加</el-button>
                </template>
              </el-input>
            </el-popover>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { Plus, Delete, View } from '@element-plus/icons-vue';
import { ElMessage, ElImageViewer, ElPopover } from 'element-plus';
import { h } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => []
  },
  single: {
    type: Boolean,
    default: false
  },
  maxCount: {
    type: Number,
    default: 20  // 改成20张，足够用了
  },
  uploadUrl: {
    type: String,
    default: '/api/admin/upload'
  },
  imageSize: {
    type: Number,
    default: 148
  },
  compact: {
    type: Boolean,
    default: false  // 紧凑模式，用于表格中
  }
});

const emit = defineEmits(['update:modelValue']);

const urlInput = ref('');

// 获取原始的modelValue（不带域名处理）
const getRawModelValue = () => {
  if (props.single) {
    return props.modelValue || '';
  } else {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
};

// 处理图片URL，确保有完整路径
const formatImageUrl = (url) => {
  if (!url) return '';
  // 确保url是字符串
  const urlStr = String(url);
  // 如果已经是完整的http/https链接，直接返回
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    return urlStr;
  }
  // 如果是以/开头的路径，直接返回（相对路径）
  if (urlStr.startsWith('/')) {
    return urlStr;
  }
  // 否则拼接域名
  const baseUrl = window.location.origin;
  return `${baseUrl}/${urlStr}`;
};

// 使用计算属性避免循环更新
const imageList = computed(() => {
  if (props.single) {
    const url = props.modelValue;
    const formatted = url ? [formatImageUrl(url)] : [];
    return formatted;
  } else {
    const list = Array.isArray(props.modelValue) ? props.modelValue : [];
    const formatted = list.map(url => formatImageUrl(url));
    return formatted;
  }
});

const headers = computed(() => ({
  type: 'goodsImage',
  authorization: sessionStorage.getItem('authorization') || ''
}));

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt20M = file.size / 1024 / 1024 < 20;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt20M) {
    ElMessage.error('图片大小不能超过 20MB！');
    return false;
  }
  return true;
};

const handleSuccess = (res) => {
  if (res.code === 0 && res.data?.path) {
    // 直接使用返回的路径，不要拼接域名
    const path = res.data.path;

    if (props.single) {
      emit('update:modelValue', path);
    } else {
      const newList = [...getRawModelValue(), path];
      emit('update:modelValue', newList);
    }
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(res.message || '上传失败');
  }
};

const isImageUrl = async (url) => {
  if (!url) return false;

  // 检查URL格式
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);

    // 检查文件扩展名
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const hasImageExt = imageExtensions.some(ext =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );

    if (hasImageExt) return true;

    // 如果没有扩展名，尝试通过加载图片验证
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      setTimeout(() => resolve(false), 5000);
    });
  } catch {
    return false;
  }
};

const addImageUrl = async () => {
  if (!urlInput.value) return;

  if (!(await isImageUrl(urlInput.value))) {
    ElMessage.error('请输入正确的图片地址');
    return;
  }

  // 直接使用输入的URL，不要再拼接域名
  if (props.single) {
    emit('update:modelValue', urlInput.value);
  } else {
    const rawList = getRawModelValue();
    const newList = [...(Array.isArray(rawList) ? rawList : []), urlInput.value];
    emit('update:modelValue', newList);
  }

  urlInput.value = '';
  ElMessage.success('图片添加成功');
};

const handlePreview = (index) => {
  // 获取el-image组件实例并触发预览
  const images = document.querySelectorAll('.image-upload-component .el-image img');
  if (images[index]) {
    images[index].click();
  }
};

// 单图模式的预览（使用ref获取当前组件实例）
const componentInstance = ref(null);

const handleSinglePreview = (event) => {
  // 直接在当前事件的目标元素附近查找
  const parent = event.currentTarget.closest('.image-item-single');
  if (parent) {
    const imgElement = parent.querySelector('.el-image img');
    if (imgElement) {
      imgElement.click();
    }
  }
};

const removeImage = (index) => {
  if (props.single) {
    emit('update:modelValue', '');
  } else {
    const rawList = getRawModelValue();
    const newList = [...(Array.isArray(rawList) ? rawList : [])];
    newList.splice(index, 1);
    emit('update:modelValue', newList);
  }
};
</script>

<style lang="scss" scoped>
.image-upload-component {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .image-item {
    position: relative;
    width: 120px;
    height: 120px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

      .image-mask {
        opacity: 1;
      }
    }

    :deep(.el-image) {
      width: 100%;
      height: 100%;
      background: #f5f7fa;
    }

    .image-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transition: opacity 0.3s;

      .el-icon {
        font-size: 18px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;
        padding: 6px;
        border-radius: 50%;

        &:hover {
          transform: scale(1.2);
        }
      }

      .icon-delete:hover {
        background: rgba(245, 108, 108, 0.8);
      }

      .icon-view:hover {
        background: rgba(64, 158, 255, 0.8);
      }
    }
  }

  .upload-box {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .upload-wrapper {
      display: inline-block;

      .upload-trigger {
        width: 100px;
        height: 100px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #fafafa;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background: #f0f9ff;

          .el-icon {
            color: #409eff;
          }
        }

        .el-icon {
          color: #c0c4cc;
        }
      }
    }

    .url-btn {
      font-size: 12px;
      color: #606266;

      &:hover {
        color: #409eff;
      }
    }
  }

  // 单图模式样式
  .single-image {
    display: inline-block;

    &.compact {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      .url-btn-compact {
        font-size: 12px;
        color: #606266;

        &:hover {
          color: #409eff;
        }
      }
    }

    .image-item-single {
      position: relative;
      display: inline-block;
      width: 120px;
      height: 120px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      overflow: hidden;

      &:hover {
        .image-mask {
          opacity: 1;
        }

        .image-mask-compact {
          opacity: 1;
        }
      }

      :deep(.el-image) {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .image-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;

        &:hover {
          pointer-events: auto;
        }

        .el-icon {
          font-size: 18px;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s;
          pointer-events: auto;

          &:hover {
            transform: scale(1.2);
          }
        }

        .icon-delete:hover {
          color: #f56c6c;
        }

        .icon-view:hover {
          color: #67c23a;
        }
      }

      .image-mask-compact {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s;

        .el-icon {
          font-size: 20px;
          color: #fff;
          cursor: pointer;
          background: rgba(245, 108, 108, 0.9);
          border-radius: 50%;
          padding: 6px;
          transition: transform 0.2s;

          &:hover {
            transform: scale(1.2);
            background: rgba(245, 108, 108, 1);
          }
        }
      }
    }

    .single-upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .url-btn-single {
        font-size: 12px;
        color: #606266;

        &:hover {
          color: #409eff;
        }
      }
    }

    .upload-wrapper-single {
      display: inline-block;

      .upload-trigger-single {
        width: 120px;
        height: 120px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: #fafafa;
        transition: all 0.3s;

        &:hover {
          border-color: #409eff;
          background: #f0f9ff;

          .el-icon {
            color: #409eff;
          }
        }

        .el-icon {
          color: #c0c4cc;
        }
      }
    }
  }
}

// SKU表格中使用时的紧凑样式
.sku-compact {
  .upload-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    width: 100%;
  }
}
</style>