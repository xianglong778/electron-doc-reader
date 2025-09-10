<script>

import HeaderComponent from "@/components/page/header/HeaderComponent.vue";

export default {

  data() {
    return {
      runCodeContent: '',
    }
  },

  components: {
    HeaderComponent,
  },

  methods: {
    toIndex() {
      window.electronAPI.returnIndexPage()
    },
  },

  props: {
    codeContent: String
  },

  mounted() {
    window.electronAPI.getRunCodeContent().then(content => {
      this.runCodeContent = content
    })
  }
}

</script>

<template>
  <div>
    <HeaderComponent></HeaderComponent>
    <button @click="toIndex">返回</button>
    <div>
      <pre>
        <code>{{runCodeContent}}</code>
      </pre>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>