<script>

import {Config} from "@/assets/js/Config";

export default {

  data() {
    return {
      backgroundColorOfFileTitle: Config.BACKGROUND_COLOR_OF_FILE_TITLE,
      fontColorOfFileTitle: Config.FONT_COLOR_OF_FILE_TITLE,
      fontColorOfButton: Config.FONT_COLOR_OF_BUTTON,
      backgroundColorOfButton: Config.BACKGROUND_COLOR_OF_BUTTON,
      backgroundColorOfMinButton: Config.BACKGROUND_COLOR_OF_BUTTON,
      backgroundColorOfMaxButton: Config.BACKGROUND_COLOR_OF_BUTTON,
      backgroundColorOfCloseButton: Config.BACKGROUND_COLOR_OF_BUTTON,
      fontSizeOfFileTitle: Config.FONT_SIZE_OF_FILE_TITLE,
      paddingLeftOfFileTitle: Config.PADDING_LEFT_OF_FILE_TITLE,

      heightOfHeader: Config.HEIGHT_OF_HEADER,

      fileName: '',
      isShowMaxWindowIcon: true,
      tempRecordIsShowMaxWindowIcon: false, // 记录窗口进入全屏前的状态
    }
  },

  methods: {

    /**
     * 点击最小化
     */
    handlerMinButton() {
      window.electronAPI.minimizeWindow()
    },

    /**
     * 点击关闭窗口，退出程序
     */
    handlerCloseButton() {
      window.electronAPI.closeWindow()
    },

    /**
     * 点击最大化、退出最大化、退出全屏
     */
    handlerMaxButton() {
      window.electronAPI.getIsFullScreen().then((isFullScreen) => {
        // 非全屏状态下，点击窗口最大化、最小化改变
        if (!isFullScreen) {
          window.electronAPI.maximizeWindow()
          this.isShowMaxWindowIcon = !this.isShowMaxWindowIcon
        }
      })
    },


    /**
     * 鼠标进入最小化窗口按钮
     */
    handlerMouseEnterMinButton() {
      this.backgroundColorOfMinButton = Config.BACKGROUND_COLOR_OF_MOUSE_ENTER_MIN_BUTTON
    },

    /**
     * 鼠标进入最大化窗口按钮
     */
    handlerMouseEnterMaxButton() {
      this.backgroundColorOfMaxButton = Config.BACKGROUND_COLOR_OF_MOUSE_ENTER_MAX_BUTTON
    },

    /**
     * 鼠标进入关闭窗口按钮
     */
    handlerMouseEnterCloseButton() {
      this.backgroundColorOfCloseButton = Config.BACKGROUND_COLOR_OF_MOUSE_ENTER_CLOSE_BUTTON
    },

    /**
     * 鼠标移除窗口控制按钮
     */
    handlerMouseLeaveButton() {
      this.backgroundColorOfMinButton = Config.BACKGROUND_COLOR_OF_BUTTON
      this.backgroundColorOfMaxButton = Config.BACKGROUND_COLOR_OF_BUTTON
      this.backgroundColorOfCloseButton = Config.BACKGROUND_COLOR_OF_BUTTON
    }

  },

  mounted() {
    // 订阅事件：用文件夹加载成功
    this.$emitter.on(Config.MESSAGE_OF_LOAD_FOLDER, fileNode => {
      this.fileName = fileNode.fileFullName + '【' + fileNode.fileSize + '】' + '【' + fileNode.createTime + '】' + '【' + fileNode.updateTime + '】'
    })

    // 订阅事件：点击文件树的某个子节点
    this.$emitter.on(Config.MESSAGE_OF_CLICK_TREE_NODE, fileNode => {
      this.fileName = fileNode.fileFullName + '【' + fileNode.fileSize + '】' + '【' + fileNode.createTime + '】' + '【' + fileNode.updateTime + '】'
    })
  }

}

</script>


<template>

  <div class="header-container" :style="{'height': heightOfHeader + 'px'}">

    <div class="file-full-name"
         :style="{'color': fontColorOfFileTitle, 'padding-left': paddingLeftOfFileTitle + 'px', 'font-size': fontSizeOfFileTitle + 'px', 'background-color': backgroundColorOfFileTitle, 'line-height': heightOfHeader + 'px'}">
      {{ fileName }}
    </div>

    <div class="close"
         :style="{'color': fontColorOfButton, 'background-color': backgroundColorOfButton, 'line-height': heightOfHeader + 'px'}">
      <div class="min" @mouseenter="handlerMouseEnterMinButton" @mouseleave="handlerMouseLeaveButton"
           @click="handlerMinButton" :style="{'background-color': backgroundColorOfMinButton}">
        <span class="iconfont">&#xe600;</span>
      </div>
      <div class="max" @mouseenter="handlerMouseEnterMaxButton" @mouseleave="handlerMouseLeaveButton"
           @click="handlerMaxButton" :style="{'background-color': backgroundColorOfMaxButton}">
        <span class="iconfont" v-show="isShowMaxWindowIcon">&#xe639;</span>
        <span class="iconfont" v-show="!isShowMaxWindowIcon">&#xe67a;</span>
      </div>
      <div class="close" @mouseenter="handlerMouseEnterCloseButton" @mouseleave="handlerMouseLeaveButton"
           @click="handlerCloseButton" :style="{'background-color': backgroundColorOfCloseButton}">
        <span class="iconfont">&#xe60e;</span>
      </div>
    </div>

  </div>

</template>


<style scoped lang="less">

.header-container {
  display: flex;
  width: 100%;
  //height: 24px; // 通过行内样式动态设置

  .file-full-name {
    flex: 1;
    height: 100%;
    overflow: hidden;
    -webkit-app-region: drag;
    user-select: none;
    font-family: Verdana, sans-serif;
  }

  .close {
    width: auto;
    height: 100%;

    div {
      float: left;
      width: 50px;
      height: 100%;

      span {
        display: block;
        font-size: 18px;
        text-align: center;
        user-select: none;
      }
    }
  }
}

</style>