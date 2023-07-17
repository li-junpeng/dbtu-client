# 右键菜单 ContextMenu

#### 使用方法 `useContextmenu`
```js
import {ApContextmenu, MenuItem, ContextmenuOption} from '@/components/context-menu'

const menus: MenuItem[] = [{
    label: '菜单1'
}, {
    label: '菜单2',
    divided: true
}, {
    label: '菜单3',
    children: [{
        label: '子菜单1'
    }, {
        label: '子菜单2'
    }]
}]

window.addEventListener('contextmenu', e => {
    e.preventDefault()

    const options: ContextmenuOption = {
        menus,
        event: e
    }

    ApContextmenu(options)
})
```

#### 配置项 `ContextmenuOption`
| 属性名           | 说明                    | 类型                   | 可选值               | 默认值             |
|:--------------|:----------------------|:---------------------|:------------------|:----------------|
| menus         | 必填项。菜单项               | MenuItem[]           | —                 | —               |
| event         | 必填项。鼠标事件对象            | MouseEvent           | —                 | —               |
| showIcon      | 是否显示icon              | boolean              | —                 | true            |
| zIndex        | 同css的z-index          | number               | —                 | 3               |
| clickItemHide | 点击菜单项后关闭菜单            | boolean              | —                 | true            |
| childTrigger  | 显示子菜单项的触发方式           | string               | 'click' / 'hover' | 'hover'         |
| target        | 菜单插入的容器               | string / HTMLElement | —                 | HTMLBodyElement |
| width         | 菜单宽度                  | string / number      | —                 | 'auto'          |
| minWidth      | 菜单最小宽度                | number               | —                 | 180             |
| maxWidth      | 菜单最大宽度                | number               | —                 | 400             |
| beforeClose   | 关闭前的回调函数，返回false可终止关闭 | Function             | —                 | —               |

#### 菜单项属性 `MenuItem`
| 属性名      | 说明              | 类型                                                                                         | 可选值 | 默认值   |
|:---------|:----------------|:-------------------------------------------------------------------------------------------|:----|:------|
| label    | 必填项。菜单项的显示名称    | string                                                                                     | —   | —     |
| disabled | 是否禁用            | boolean                                                                                    | —   | false |
| hidden   | 是否隐藏            | boolean                                                                                    | —   | false |
| children | 子菜单项，目前最多有1级子菜单 | MenuItem[]                                                                                 | —   | —     |
| icon     | icon图标          | string / Component。<br>当类型为string时。值为图片链接，当类型为Component时，值为vue组件                           | —   | —     |
| divided  | 是否显示菜单分割线       | boolean                                                                                    | —   | false |
| onClick  | 点击菜单项的回调函数      | Function(menu: MenuItem, index: number): void <br><li>menu: 当前点击的菜单项<li>index: 当前点击的菜单项的索引 | —   | —     |
| loading  | 加载状态            | boolean                                                                                    | —   | false |


#### 菜单方法 `Methods`
| 方法名     | 说明   | 参数  |
|:--------|:-----|:----|
| onClose | 关闭菜单 | —   |
