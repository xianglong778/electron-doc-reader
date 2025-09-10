<script>

export default {
  data() {
    return {
      imageSrc: '',
      imageAlt: '',
      imageScale: 1,
      alertInfoDisplay: 'none',
      scrollTimeout: null,
      changeStep: 0.1,
      imageCursor: 'default',
    }
  },

  props: {
    fileNode: Object
  },

  methods: {
    callbackOfKeydown(event) {
      if (event.ctrlKey) {
        event.preventDefault();
        this.imageCursor = 'move'
      }
      if (event.ctrlKey && event.key === '0') {
        event.preventDefault();
        this.imageScale = 1
      }
    },

    callbackOfKeyup(event) {
      this.imageCursor = 'default'
      this.alertInfoDisplay = 'none'
    },

    // 处理滚轮事件的逻辑
    handleWheel(event) {
      if (event.ctrlKey) {
        // 显示提示词
        this.alertInfoDisplay = 'block'
        // 滚轮方向朝上
        if (event.deltaY < 0 &&
            this.$refs.img.getBoundingClientRect().width * (1 + this.changeStep) <= this.$refs.imgBox.getBoundingClientRect().width &&
            this.$refs.img.getBoundingClientRect().height * (1 + this.changeStep) <= this.$refs.imgBox.getBoundingClientRect().height
        ) {
          this.imageScale += this.changeStep;
        }
        // 滚轮方向朝下
        if (event.deltaY > 0 && this.imageScale >= 0.5) {
          // 向下滚动，缩小图片
          this.imageScale -= this.changeStep;
        }
      }
    }
  },

  mounted() {
    this.imageSrc = 'file://' + this.fileNode.fileAbsolutePath
    this.imageAlt = this.fileNode.fileFullName

    window.addEventListener('keydown', this.callbackOfKeydown);
    window.addEventListener('keyup', this.callbackOfKeyup);
    window.addEventListener('wheel', this.handleWheel);
  },

  unmounted() {
    window.removeEventListener('keydown', this.callbackOfKeydown);
    window.removeEventListener('keyup', this.callbackOfKeyup);
    window.removeEventListener('wheel', this.handleWheel);
  }
}
</script>

<template>
  <div class="image" ref="imgBox">
    <h1 :style="{display: alertInfoDisplay}">按下 Ctrl + 0 复原</h1>
    <img ref="img" :src="imageSrc" :alt="imageAlt" :style="{'scale': imageScale, cursor: imageCursor}"/>
  </div>
</template>

<style scoped lang="less">
.image {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  h1 {
    position: absolute;
    width: 100%;
    text-align: right;
    padding-right: 50px;
    padding-top: 50px;
    z-index: 999;
    opacity: .5;
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    transform: translateX(-50%) translateY(-50%);
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border: 2px solid #000000;
  }
}
</style>