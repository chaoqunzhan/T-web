## 主题定制
1、vite.config.ts中注入主题全局变量
```js
// vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: `
          @import "src/styles/bdc-variables.sass";
          @import "src/styles/variables.sass";
        `,
      },
    },
  },
});
```

2、单组件样式复写

- `_VUE/package`中新增`bdc.scss`文件，复写样式
- 遍历`config`组件列表，读取`bdc.scss`
- 使用`scss.compile`转换为`css`文件

`fs.readFile ` `fs.outputFile` `fs.copy`

3、导出css文件npm包，给项目使用

## 业务组件

1、机构树
2、