<script>
export default {
  data() {
    return {
      fileContent: '',
    }
  },
  props: {
    fileNode: Object
  },
  mounted() {
    this.fileContent = this.fileNode.fileAbsolutePath + '【' + this.fileNode.fileSize + '】'
  }
}
</script>

<template>
  <p>
    {{ fileContent }}
  </p>
</template>

<style scoped lang="less">
p {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  margin: 0 auto;
  color: #000;
  text-wrap: wrap;
  text-align: center;
  white-space: pre-wrap; /* 或 pre-line，取决于你的需求 */
  word-break: break-all; /* 在任意字符处断行 */
}
</style>