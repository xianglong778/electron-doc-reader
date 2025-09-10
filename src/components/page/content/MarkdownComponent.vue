<script>
import {marked} from "marked"

export default {
  data() {
    return {
      fileContent: '',
    }
  },
  props: {
    fileNode: Object
  },

  methods: {
    solveMarkdown() {
      // 代码块
      {
        Array.from(document.querySelector('.markdown').children).forEach(node => {
          if (node.tagName === 'PRE') {
            const pre = node

            // 创建按钮元素
            const button = document.createElement('button')
            button.classList.add('button-copy-code')
            button.textContent = '复制'
            pre.appendChild(button)
            button.addEventListener('click', () => {
              const text = pre.querySelector('code').textContent || pre.querySelector('code').innerText
              navigator.clipboard.writeText(text)
                  .then(() => {
                    document.querySelector('.markdown').querySelectorAll('pre .markdown-button-copy-code').forEach(item => {
                      item.textContent = '复制'
                    })
                    button.textContent = '已复制'
                  })
                  .catch((error) => {
                    console.log(error)
                    const inputElement = document.createElement('input')
                    inputElement.value = text
                    inputElement.select()
                    document.execCommand('copy')
                    document.querySelector('.markdown').querySelectorAll('pre .markdown-button-copy-code').forEach(item => {
                      item.textContent = '复制'
                    })
                    button.textContent = '已复制'
                  })
            })

            // 创建按钮元素
            const buttonOfClickRunCode = document.createElement('button')
            buttonOfClickRunCode.classList.add('button-run-code')
            buttonOfClickRunCode.classList.add('iconfont')
            buttonOfClickRunCode.textContent = '\ue61b'
            pre.appendChild(buttonOfClickRunCode)
            buttonOfClickRunCode.addEventListener('click', () => {
              const text = pre.querySelector('code').textContent || pre.querySelector('code').innerText
              window.electronAPI.openRunCodeWindow(text)
            })
          }
        })
      }
      // 图片
      {
        // 链接问题
        document.querySelector('.markdown').querySelectorAll('img').forEach(imgElement => {
          //  - 相对路径
          //  - 绝对路径
          //  - http链接
          //  - https链接
          // console.log('\n', this.filePath)
          // console.log('src1 1= ', imgElement .src)
          // console.log('src2 = ', 'C:\\Users\\PC-BUGU\\Desktop\\BuGu笔记大全\\Git 的常用方法\\img\\image-20240702135406208.png')
          // imgElement.src = 'file://' + 'C:\\Users\\PC-BUGU\\Desktop\\BuGu笔记大全\\Git 的常用方法\\img\\image-20240702135406208.png'
          console.log(imgElement.src)
          // imgElement.src = 'file://' + 'E:\\相册\\桌面背景\\1.jpg'
          imgElement.setAttribute('title', '图片XXXX')
        })
      }
      // 链接
      {
        document.querySelector('.markdown').querySelectorAll('a[href]').forEach(link => {
          link.addEventListener('click', e => {
            e.preventDefault();
            // 发出通知：使用默认的浏览器打开链接
            window.electronAPI.openHref(link.getAttribute('href'))
          })
        })
      }
      // 给首级元素增加统一的外部的盒子
      {
        const fragment = document.createDocumentFragment();
        Array.from(document.querySelector('.markdown').children).forEach(node => {
          let div = document.createElement('div')
          div.classList.add('markdown-item-box')
          div.append(node)
          fragment.appendChild(div)
        })
        document.querySelector('.markdown').innerHTML = ''
        document.querySelector('.markdown').appendChild(fragment)
      }
    }
  },

  mounted() {
    window.electronAPI.readMarkdownFile(this.fileNode.fileAbsolutePath).then(content => {
      this.fileContent = marked(content, {
        smartLists: true,
        highlight: false,
        breaks: true,
        gfm: true,
      })
      this.$nextTick(() => {
        this.solveMarkdown()
      })
    })
  }

}
</script>

<template>
  <div class="box">
<!--    <div class="edit">-->
<!--      <button>导出PDF、HTML、HTML（style）</button>-->
<!--    </div>-->
    <div class="markdown markdown-content" ref="htmlCon" v-html="fileContent"></div>
  </div>
</template>

<style scoped lang="less">
.box {
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  .edit {
    width: 100%;
    height: 40px;

    button {
      width: 100px;
      height: 100%;
    }
  }

  .markdown {
    width: 100%;
    height: auto;
    padding-left: 100px;
    padding-right: 100px;
    //padding-bottom: 50vh50vh;
    padding-bottom: 100px;
    //background-color: lightpink;
  }
}
</style>