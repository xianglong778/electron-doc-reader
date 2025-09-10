<script>

import {Config} from "@/assets/js/Config";
import FileTreeComponent from "@/components/page/aside/FileTreeComponent.vue";

export default {

  data() {
    return {
      backgroundColorOfAsideHeader: Config.BACKGROUND_COLOR_OF_ASIDE_HEADER,
      backgroundColorOfAsideMain: Config.BACKGROUND_COLOR_OF_ASIDE_MAIN,
      backgroundColorAsideFooter: Config.BACKGROUND_COLOR_OF_ASIDE_FOOTER,
      fontColorOfAsideHeader: Config.FONT_COLOR_OF_ASIDE_HEADER,
      fontColorOfFileTree: Config.FONT_COLOR_OF_FILE_TREE,

      isAscByFileFullName: true,

      fileTreeData: null
    }
  },

  components: {
    FileTreeComponent,
  },


  methods: {
    /**
     * 待完成
     *    -
     *    -
     */

    /**
     *  文件树的配置
     *  TODO
     *    - 高亮当前选中的节点
     *    - 优化效率：先字符串，然后渲染，最后添加事件
     */
    createFileTreeDataByRootNode(rootNode) {
      return {
        data: [rootNode],
        attributeNameOfNodeIcon: 'fileIcon',
        attributeNameOfNodeId: 'id',
        attributeNameOfNodeName: 'fileFullName',
        attributeNameOfNodeChildren: 'children',
        IconOfArrow: '\ue662',
        IconOfAll: '\ue70c',
        fontColorOfDefault: '#808080',
        fontColorOfFocus: '#60dbbd',
        isNormalStyle: true,
        isFocusAll: true, // 【展开收起、点击回调】的触发点是不是小li全部
        fileTreeStyle: 'collapse-all', // 默认展开风格：全部展开(expand-all)、展开第一个(expand-first)、全部收起(collapse-all)、其他统统是全部收起
        callback: treeNode => {
          this.handleNodeClick(treeNode)
        }
      }
    },

    /**
     * 点击加载文件夹
     */
    handlerClick() {
      window.electronAPI.getFolderPath(false).then(dirPath => {
        if (dirPath !== '') {
          window.electronAPI.getFileListByFolderPath(dirPath, this.isAscByFileFullName).then(rootNodeOfFileTree => {
            // 发布消息：文件夹加载成功
            this.$emitter.emit(Config.MESSAGE_OF_LOAD_FOLDER, rootNodeOfFileTree)
            // 更新文件树
            this.fileTreeData = null
            this.$nextTick(() => {
              this.fileTreeData = this.createFileTreeDataByRootNode(rootNodeOfFileTree)
            })
          })
        }
      })
    },

    /**
     * 点击文件树的某个节点
     */
    handleNodeClick(treeNode) {
      // 发送消息：将被点击节点的全部信息发出
      this.$emitter.emit(Config.MESSAGE_OF_CLICK_TREE_NODE, treeNode)
    },
  },

  mounted() {
    // window.electronAPI.getFolderPath(true).then(dirPath => {
    //   if (dirPath !== '') {
    //     window.electronAPI.getFileListByFolderPath(dirPath, this.isAscByFileFullName).then(rootNodeOfFileTree => {
    //       // 发布消息：文件夹加载成功
    //       this.$emitter.emit(Config.MESSAGE_OF_LOAD_FOLDER, rootNodeOfFileTree)
    //       // 更新文件树
    //       this.fileTreeData = null
    //       this.$nextTick(() => {
    //         this.fileTreeData = this.createFileTreeDataByRootNode(rootNodeOfFileTree)
    //       })
    //     })
    //   }
    // })
  },
}

</script>


<template>

  <div class="aside-container">

    <div class="header" :style="{'background-color': backgroundColorOfAsideHeader, 'color': fontColorOfAsideHeader}"
         @dblclick="handlerClick">
      <span class="iconfont">&#xe761;</span>
      <span class="title">&nbsp;文档库&nbsp;</span>
    </div>

<!--    <div class="edit">-->
<!--      <span class="iconfont">&#xe761;</span>-->
<!--      <span class="iconfont">&#xe761;</span>-->
<!--      <span class="iconfont">&#xe761;</span>-->
<!--    </div>-->

    <div class="main" :style="{'background-color': backgroundColorOfAsideMain}">
      <FileTreeComponent v-if="fileTreeData !== null" :fileTreeData="fileTreeData"></FileTreeComponent>
    </div>

    <div class="footer" :style="{'background-color': backgroundColorAsideFooter}">

    </div>

  </div>

</template>


<style scoped lang="less">

.aside-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    height: 50px;
    margin: 0 auto;
    text-align: center;

    span {
      font-size: 20px;
      font-weight: bold;
      line-height: 50px;
      user-select: none;
      cursor: pointer;
    }
  }

  .edit {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #ffffff;
  }

  .main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-left: 20px;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  .footer {
    width: 100%;
    height: 40px;
  }
}

</style>