<script>

export default {

  data() {
    return {
      // 存储每个节点的 id 值
      map: {},
    }
  },

  methods: {
    getUlElementOfFileTree(config, _DataList) {
      const ul = document.createElement('ul')
      _DataList.forEach(item => {
        const li = document.createElement('li')
        li.classList.add('file-tree-item-li')
        li.classList.add('collapse')
        const arrow = document.createElement('div')
        arrow.classList.add('arrow', 'iconfont')
        arrow.textContent = (item[config.attributeNameOfNodeChildren] && Array.isArray(item[config.attributeNameOfNodeChildren]) && item[config.attributeNameOfNodeChildren].length > 0) ? config.IconOfArrow : ''
        const icon = document.createElement('div')
        icon.classList.add('icon', 'iconfont')
        icon.textContent = item[config.attributeNameOfNodeIcon]
        const name = document.createElement('div')
        name.classList.add('name')
        name.textContent = item[config.attributeNameOfNodeName]
        name.title = item[config.attributeNameOfNodeName]
        const div = document.createElement('div')
        div.classList.add('file-tree-item-title')
        this.map[item[config.attributeNameOfNodeId]] = item
        div.setAttribute('id', item[config.attributeNameOfNodeId])
        div.appendChild(arrow)
        div.appendChild(icon)
        div.appendChild(name)
        li.appendChild(div)
        if (item[config.attributeNameOfNodeChildren] && Array.isArray(item[config.attributeNameOfNodeChildren]) && item[config.attributeNameOfNodeChildren].length > 0) {
          li.appendChild(this.getUlElementOfFileTree(config, item[config.attributeNameOfNodeChildren]))
        }
        ul.appendChild(li)
      })
      return ul
    },
    init(config) {
      let fontSizeOfNormal = 18
      let heightOfNormal = 30
      let widthOfNormal = 20 // 图标的宽度、ul的左内边距大小
      let fontSizeOfBig = 22
      let heightOfBig = 40
      let widthOfBig = 28 // 图标的宽度、ul的左内边距大小

      // 获取全部的子元素
      let fileTreeBox = document.querySelector('.file-tree-box')
      let ul = this.getUlElementOfFileTree(config, config.data)
      fileTreeBox.appendChild(ul)

      // 给第一个li增加一个统一的展开、收起按钮
      if (fileTreeBox.querySelectorAll('li').length > 1) {
        let fileTreeItemTitle = fileTreeBox.querySelector('.file-tree-item-title')
        const all = document.createElement('div')
        all.className = 'all iconfont'
        all.textContent = config.IconOfAll
        fileTreeItemTitle.appendChild(all)
      }

      // 设置首次加载文件树时默认的收起展开状态
      {
        // 仅展开第一级
        if (config.fileTreeStyle === 'expand-first') {
          const li = fileTreeBox.querySelector('li')
          li.className = 'expand'
          li.style.height = 'auto'
          li.querySelector('.arrow').style.transform = 'rotate(0)'
          li.querySelectorAll('li').forEach(item => {
            item.className = 'collapse'
            item.style.height = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`
            item.querySelector('.arrow').style.transform = 'rotate(-90deg)'
          })
        }
        // 展开全部
        else if (config.fileTreeStyle === 'expand-all') {
          fileTreeBox.querySelectorAll('li').forEach(item => {
            item.className = 'expand'
            item.style.height = 'auto'
            item.querySelector('.arrow').style.transform = 'rotate(0)'
          })
        }
        // 收起全部
        else {
          fileTreeBox.querySelectorAll('li').forEach(item => {
            item.className = 'collapse'
            item.style.height = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`
            item.querySelector('.arrow').style.transform = 'rotate(-90deg)'
          })
        }
      }

      // 设置基础样式
      fileTreeBox.querySelectorAll('li').forEach(li => {
        const item = li.querySelector('.file-tree-item-title')
        item.style.height = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`
        item.style.lineHeight = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`

        item.querySelector('.arrow').style.fontSize = `${config.isNormalStyle ? fontSizeOfNormal : fontSizeOfBig}px`
        item.querySelector('.arrow').style.color = config.fontColorOfDefault
        item.querySelector('.arrow').style.width = `${config.isNormalStyle ? widthOfNormal : widthOfBig}px`

        item.querySelector('.icon').style.fontSize = `${config.isNormalStyle ? fontSizeOfNormal : fontSizeOfBig}px`
        item.querySelector('.icon').style.color = config.fontColorOfDefault
        item.querySelector('.icon').style.width = `${config.isNormalStyle ? widthOfNormal : widthOfBig}px`

        item.querySelector('.name').style.fontSize = `${config.isNormalStyle ? fontSizeOfNormal : fontSizeOfBig}px`
        item.querySelector('.name').style.color = config.fontColorOfDefault
        item.querySelector('.name').style.width = 'auto'

        if (item.querySelector('.all')) {
          item.querySelector('.all').style.fontSize = `${config.isNormalStyle ? fontSizeOfNormal : fontSizeOfBig}px`
          item.querySelector('.all').style.color = config.fontColorOfDefault
          item.querySelector('.all').style.width = `${config.isNormalStyle ? widthOfNormal : widthOfBig}px`
        }

        if (li.querySelector('ul')) {
          li.querySelector('ul').style.paddingLeft = `${config.isNormalStyle ? widthOfNormal : widthOfBig}px`
        }
      })

      // ===========================================================================================================================================

      // 设置鼠标移入移出时的字体颜色
      fileTreeBox.querySelectorAll('.file-tree-item-title').forEach(fileTreeItem => {
        fileTreeItem.addEventListener('mouseenter', () => {
          fileTreeBox.querySelectorAll('.file-tree-item-title').forEach(item => {
            item.querySelector('.arrow').style.color = config.fontColorOfDefault
            item.querySelector('.icon').style.color = config.fontColorOfDefault
            item.querySelector('.name').style.color = config.fontColorOfDefault
            if (item.querySelector('.all')) {
              item.querySelector('.all').style.color = config.fontColorOfDefault
            }
          })
          fileTreeItem.querySelector('.arrow').style.color = config.fontColorOfFocus
          fileTreeItem.querySelector('.icon').style.color = config.fontColorOfFocus
          fileTreeItem.querySelector('.name').style.color = config.fontColorOfFocus
          if (fileTreeItem.querySelector('.all')) {
            fileTreeItem.querySelector('.all').style.color = config.fontColorOfFocus
          }
        })
        fileTreeItem.addEventListener('mouseleave', () => {
          fileTreeBox.querySelectorAll('.file-tree-item-title').forEach(item => {
            item.querySelector('.arrow').style.color = config.fontColorOfDefault
            item.querySelector('.icon').style.color = config.fontColorOfDefault
            item.querySelector('.name').style.color = config.fontColorOfDefault
            if (item.querySelector('.all')) {
              item.querySelector('.all').style.color = config.fontColorOfDefault
            }
          })
        })
      })

      // 点击节点：展开收起目录
      fileTreeBox.querySelectorAll('li').forEach(fileTreeItemLi => {
        const elementOfBox = fileTreeItemLi
        const elementOfTitle = fileTreeItemLi.querySelector('.file-tree-item-title')
        const elementOfArrow = fileTreeItemLi.querySelector('.file-tree-item-title .arrow')
        const nowElement = config.isFocusAll ? elementOfTitle : elementOfArrow
        nowElement.style.cursor = 'pointer'
        nowElement.addEventListener('click', () => {
          // 收起 -> 展开
          if (elementOfBox.classList.contains('collapse')) {
            elementOfBox.className = 'expand'
            elementOfBox.style.height = 'auto'
            elementOfTitle.querySelector('.arrow').style.transform = 'rotate(0)'
          }
          // 展开 -> 收起
          else {
            elementOfBox.className = 'collapse'
            elementOfBox.style.height = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`
            elementOfTitle.querySelector('.arrow').style.transform = 'rotate(-90deg)'
          }
        })
      })

      // 点击节点：执行选中节点的回调函数
      fileTreeBox.querySelectorAll('.file-tree-item-title').forEach(fileTreeItemTitle => {
        fileTreeItemTitle.addEventListener('click', () => {
          config.callback(this.map[fileTreeItemTitle.getAttribute('id')])
        })
      })

      // 给 all 图标增加点击事件
      if (fileTreeBox.querySelector('.all')) {
        let fileTreeItemLi = fileTreeBox.querySelector('li')
        fileTreeBox.querySelector('.all').addEventListener('click', (e) => {
          // 阻止点击事件的穿透效果，避免鼠标展开收集的脚本为整个节点时，点击all图标会触发到父元素的点击事件
          e.stopPropagation()
          // 收起 -> 展开
          if (fileTreeItemLi.classList.contains('collapse')) {
            fileTreeBox.querySelectorAll('li').forEach(li => {
              li.className = 'expand'
              li.style.height = 'auto'
              li.querySelector('.arrow').style.transform = 'rotate(0)'
            })
          }
          // 展开 -> 收起
          else {
            fileTreeBox.querySelectorAll('li').forEach(liElement => {
              liElement.className = 'collapse'
              liElement.style.height = `${config.isNormalStyle ? heightOfNormal : heightOfBig}px`
              liElement.querySelector('.arrow').style.transform = 'rotate(-90deg)'
            })
          }
        })
      }
    }
  },

  props: {
    fileTreeData: Object
  },

  mounted() {
    if (this.fileTreeData !== null) {
      this.init(this.fileTreeData)
    }
  },
}

</script>

<template>
  <div class="file-tree-box"></div>
</template>

<style lang="less">
.file-tree-box {
  width: 100%;
  height: 100%;
  display: block;
  background-color: #ffffff;

  ul {
    height: auto;
  }

  li {
    display: block;
    list-style: none;
    overflow: hidden;

    .file-tree-item-title {
      display: flex;
      flex-direction: row;
      width: 100%;

      .arrow {
        height: 100%;
        text-align: center;
        z-index: 777;
        user-select: none;
      }

      .icon {
        height: 100%;
        text-align: center;
        z-index: 888;
        user-select: none;
      }

      .name {
        flex: 1;
        height: 100%;
        text-align: left;
        z-index: 999;
        user-select: none;
        overflow: hidden;
      }

      .all {
        height: 100%;
        text-align: center;
        z-index: 888;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>