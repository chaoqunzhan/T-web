import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端T站",
  description: "一个前端coder的个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '工作', link: '/work/browser/浏览器跨标签页通信的方式' },
      { text: '生活', link: '/life' },
      { text: '其他', link: '/other/index' }
    ],

    sidebar: [
      {
        text: '工作杂谈',
        items: [
          { 
            text: 'Browser', 
            collapsed: true,
            items: [
              { text: '浏览器跨标签页通信的方式', link: '/work/browser/浏览器跨标签页通信的方式' },
            ]
          },
          { text: 'JavaScript', link: '/work/js' },
          { text: 'HTML', link: '/work/html' },
          { text: 'CSS', link: '/work/css' },
          { 
            text: 'VUE', 
            collapsed: true,
              items: [
                { text: 'vue3版无限滚动加载', link: '/work/vue/vue3版无限滚动加载' },
              ]
          },
          { text: 'TypeScript', link: '/work/ts' },
          { 
            text: '应用', 
            collapsed: true,
              items: [
                { text: '前端导入、导出EXCEL-SheetJs', link: '/work/use/前端导入、导出EXCEL-SheetJs' },
              ]
          },
          {
            text:'其他',
            collapsed: true,
            items: [
              { text:'前端也来了解AI了', link: '/work/other/前端也来了解AI了' },
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  outDir: '../public',
  base: '/tab-zhan/',
})
