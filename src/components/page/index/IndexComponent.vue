<script>

import ASideComponent from "@/components/page/aside/AsideComponent.vue";
import HeaderComponent from "@/components/page/header/HeaderComponent.vue";
import MainComponent from "@/components/page/main/MainComponent.vue";
import {Config} from "@/assets/js/Config";

export default {

  data() {
    return {
      // 读取配置类，不会发生改变
      backgroundColorOfAside: Config.BACKGROUND_COLOR_OF_ASIDE,
      backgroundColorOfMain: Config.BACKGROUND_COLOR_OF_MAIN,
      backgroundColorOfSelLine: Config.BACKGROUND_COLOR_OF_SEP_LINE,
      backgroundColorOfHiddenSepLine: Config.BACKGROUND_COLOR_OF_HIDDEN_SEP_LINE,
      widthOfHiddenSepLine: Config.WIDTH_OF_HIDDEN_SEP_LINE,
      widthOfSepLine: Config.WIDTH_OF_SEP_LINE,
      maxWidthOfHiddenAside: Config.MAX_WIDTH_OF_HIDDEN_ASIDE,

      // 会发生改变的变量
      hiddenSepLineOfLeft: 0,
      hiddenSepLineOfDisplay: 'none',
      heightOfHeader: Config.HEIGHT_OF_HEADER, // 进入全屏时，变为0
      widthOfAside: Config.WIDTH_OF_ASIDE, // 菜单栏的宽度
      recordMouseLeftX: Config.WIDTH_OF_ASIDE, // 记录鼠标拖动分割线的最终位置，初始值无意义
    };
  },

  components: {
    ASideComponent,
    HeaderComponent,
    MainComponent,
  },

  methods: {

    handlerMouseDown(e) {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseup)
      this.hiddenSepLineOfDisplay = 'block'
      this.hiddenSepLineOfLeft = e.clientX
    },

    handleMouseMove(e) {
      // 获取鼠标距离左侧的距离
      let leftX = e.clientX
      // 获取鼠标距离右侧的距离
      let rightX = window.innerWidth - leftX
      // 鼠标移动到中间内容区域，直接改变左侧区域宽度
      if (leftX >= Config.MIN_WIDTH_OF_LEFT_ASIDE && rightX >= Config.MIN_WIDTH_OF_RIGHT_MAIN) {
        this.hiddenSepLineOfLeft = e.clientX
        this.recordMouseLeftX = e.clientX // 记录鼠标的位置
      }
      if (leftX <= this.maxWidthOfHiddenAside) {
        this.hiddenSepLineOfLeft = e.clientX
      }
    },

    handleMouseup(e) {
      // 隐藏曲线
      this.hiddenSepLineOfDisplay = 'none'
      // 鼠标移动到中间内容区域：改变菜单栏宽度
      if (this.recordMouseLeftX >= Config.MIN_WIDTH_OF_LEFT_ASIDE) {
        this.widthOfAside = this.recordMouseLeftX
      }
      // 鼠标移动到收缩菜单栏区域：收起菜单栏【发布消息：改变窗口菜单栏收缩状态】
      if (this.hiddenSepLineOfLeft <= this.maxWidthOfHiddenAside) {
        this.$emitter.emit(Config.CHANGE_STATE_OF_ASIDE)
      }
      // 取消监听事件
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseup)
    },

  },

  mounted() {
    // 订阅事件：进入全屏
    window.electronAPI.onWindowEnterFullScreen(() => {
      this.heightOfHeader = 0
    })

    // 订阅事件：退出全屏
    window.electronAPI.onWindowLeaveFullScreen(() => {
      this.heightOfHeader = Config.HEIGHT_OF_HEADER
    })

    // 监听改变窗口菜单栏收缩状态的消息
    this.$emitter.on(Config.CHANGE_STATE_OF_ASIDE, () => {
      this.widthOfAside = this.widthOfAside > 0 ? 0 : this.recordMouseLeftX
    })

    // 监听到 F12 时，打开/关闭开发者工具
    window.addEventListener('keyup', (event) => {
      if (event.key === 'F12') {
        // 阻止事件的默认行为
        event.preventDefault()
        // 打开/关闭开发者工具
        window.electronAPI.changeStateOfDevTools()
      }
    });

    // 监听到 Ctrl+Shift+L 时，发布改变菜单栏宽度的消息
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        // 阻止事件的默认行为
        event.preventDefault()
        // 发布消息：改变窗口菜单栏收缩状态
        this.$emitter.emit(Config.CHANGE_STATE_OF_ASIDE)
      }
    });

    // 监听到 Ctrl+Shift+Q 时，退出程序
    window.addEventListener('keyup', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'Q') {
        event.preventDefault();
        window.electronAPI.closeWindow()
      }
    });
  }

}

</script>

<template>

  <div id="container">

    <div id="hidden-drag-line"
         :style="{'display': hiddenSepLineOfDisplay, 'left': hiddenSepLineOfLeft + 'px', 'border-right': widthOfHiddenSepLine + 'px dashed ' + backgroundColorOfHiddenSepLine}">
    </div>

    <div id="aside"
         :style="{'width': widthOfAside + 'px', 'background-color': backgroundColorOfAside}" ref="aside">

      <div class="aside">
        <ASideComponent></ASideComponent>
      </div>

      <div class="drag-line"
           :style="{'width': widthOfSepLine + 'px', 'border-right': '1px solid ' + backgroundColorOfSelLine}"
           @mousedown.prevent="handlerMouseDown">
      </div>

    </div>

    <div id="main-box">

      <div id="header" :style="{'height': heightOfHeader + 'px'}">
        <HeaderComponent></HeaderComponent>
      </div>

      <div id="main" :style="{'background-color': backgroundColorOfMain}">
        <MainComponent></MainComponent>
      </div>

    </div>

  </div>

</template>

<style scoped lang="less">

#container {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;

  #hidden-drag-line {
    position: absolute;
    z-index: 999;
    left: 260px;
    height: 100%;
  }

  #aside {
    display: flex;
    overflow: hidden;
    //transition: all .5s;

    .aside {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }

    .drag-line {
      height: 100%;
      cursor: ew-resize;
      background-color: #ffffff;
    }
  }

  #main-box {
    flex: 1;
    display: flex;
    flex-direction: column; //从上到下

    #header {
      width: 100%;
      transition: all .5s;
      overflow: hidden;
    }

    #main {
      flex: 1;
      overflow-y: auto;
    }
  }
}

</style>