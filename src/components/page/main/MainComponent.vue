<script>

import MarkdownComponent from "@/components/page/content/MarkdownComponent.vue";
import ImageComponent from "@/components/page/content/ImageComponent.vue";
import OtherComponent from "@/components/page/content/OtherComponent.vue";
import {Config} from "@/assets/js/Config";

export default {

  data() {
    return {
      contentKey: 0, // 每次选择组件时该值加1，避免多次在选择图片查看时由于 isShowImage 一直处于 true 的状态而使得组件不会被重新渲染的问题，相当于手动的触发 Vue 的渲染机制
      isShowMarkdown: false,
      isShowImage: false,
      isShowOther: false,
      fileNode: {},
    }
  },

  components: {
    MarkdownComponent,
    ImageComponent,
    OtherComponent,
  },

  methods: {
    hiddenAll() {
      this.isShowMarkdown = false
      this.isShowImage = false
      this.isShowOther = false
    },
    showContentByType(type) {
      // markdown
      if ('md' === type) {
        this.isShowMarkdown = true
        this.isShowImage = false
        this.isShowOther = false
      }
      // image
      else if ('png' === type || 'jpg' === type) {
        this.isShowMarkdown = false
        this.isShowImage = true
        this.isShowOther = false
      }
      // other
      else {
        this.isShowMarkdown = false
        this.isShowImage = false
        this.isShowOther = true
      }
    },
  },

  mounted() {
    // 订阅事件：重新加载整个文件夹时恢复默认
    this.$emitter.on(Config.MESSAGE_OF_LOAD_FOLDER, fileNode => {
      this.showContentByType(fileNode.fileType)
      this.fileNode = fileNode
      this.contentKey++
    })

    // 订阅事件：用户选择文件树的某个节点，获取该文件节点的全部信息
    this.$emitter.on(Config.MESSAGE_OF_CLICK_TREE_NODE, fileNode => {
      this.showContentByType(fileNode.fileType)
      this.fileNode = fileNode
      this.contentKey++
    })
  }
}

</script>


<template>
  <div class="main-container">
    <MarkdownComponent v-if="isShowMarkdown" :key="contentKey" :fileNode="fileNode"></MarkdownComponent>
    <ImageComponent v-if="isShowImage" :key="contentKey" :fileNode="fileNode"></ImageComponent>
    <OtherComponent v-if="isShowOther" :key="contentKey" :fileNode="fileNode"></OtherComponent>
  </div>
</template>


<style scoped lang="less">

.main-container {
  width: 100%;
  height: 100%;
  //padding: 20px;
  //background-color: linen;
}

</style>