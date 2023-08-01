<template>
  <div style="width: 100%; height: 100%; background-color: #fff"></div>
</template>

<script setup lang="ts">
import { Printer, Refresh, View } from '@element-plus/icons-vue'
import { reactive, shallowRef } from 'vue'
import ApContextmenu from '../'
import { MenuItem } from '../src/constants'

const menus: MenuItem[] = reactive<MenuItem[]>([
  {
    label: '返回(B)',
    loading: false,
    onClick: item => {
      item.loading = !item.loading
    }
  },
  {
    label: '前进(F)',
    disabled: true,
    onClick: item => {}
  },
  {
    label: '重新加载(R)',
    divided: true,
    icon: shallowRef(Refresh),
    onClick: () => {
      window.location.reload()
    }
  },
  {
    label: '另存为(A)...'
  },
  {
    label: '打印(P)...',
    icon: shallowRef(Printer)
  },
  {
    label: '投射(C)...'
  },
  {
    label: '使用网页翻译(T)',
    children: [
      {
        label: '翻译成简体中文'
      },
      {
        label: '翻译成繁体中文'
      }
    ]
  },
  {
    label: '截取网页(R)'
  },
  {
    label: '查看网页源代码(V)',
    icon: shallowRef(View)
  },
  {
    label: '检查(N)',
    divided: true
  },
  {
    label: '新建',
    children: [
      {
        label: '新建文件夹'
      },
      {
        label: '新建文本文档'
      },
      {
        label: '新建Java文件'
      },
      {
        label: '新建Vue文件'
      },
      {
        label: '新建HTML文件'
      },
      {
        label: '新建Word文档'
      },
      {
        label: '新建Excel文档'
      },
      {
        label: '新建Csv文档',
        children: [{ label: '我就说可以插入3级菜单的吧。。。（好像真的不行）' }]
      }
    ]
  }
])

window.addEventListener('contextmenu', e => {
  e.preventDefault()

  ApContextmenu({
    menus,
    event: e,
    beforeClose: () => {
      return false
    }
  })
})
</script>

<style scoped lang="scss"></style>
