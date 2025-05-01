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
              { text: '前端性能优化', link: '/work/browser/前端性能优化' },
            ]
          },
          { 
            text: 'JavaScript', 
            collapsed: true,
            items: [
              { text: 'JS基础手写题', link: '/work/js/JS基础手写题/index' },
              { text: 'JS数据处理手写题', link: '/work/js/JS数据处理手写题/index' },
              { text: 'JSDEV手写题', link: '/work/js/JSDEV手写题/index' },
              { text: '如何学习JS框架', link: '/work/js/如何学习JS框架/index' },
              { text: '手写Object.groupBy', link: '/work/js/手写Object.groupBy/index' },
              { text: '手写Promise', link: '/work/js/手写Promise/index' },
            ]
          },
          { 
            text: 'HTML', 
            collapsed: true,
            items: [
              { text: 'iframe', link: '/work/html/iframe/index' },
            ]
          },
          { 
            text: 'CSS', 
            collapsed: true,
            items: [
              { text: 'flex布局怎么让最后一行元素靠左排列?', link: '/work/css/flex布局怎么让最后一行元素靠左排列/index' },
              { text: '保持元素宽高比', link: '/work/css/保持元素宽高比/index' },
            ]
          },
          { 
            text: 'VUE', 
            collapsed: true,
            items: [
              { text: 'vue3版无限滚动加载', link: '/work/vue/vue3版无限滚动加载' },
              { text: 'vite-plugin-legacy解读', link: '/work/vue/vite-plugin-legacy解读/index' },
              { text: '深入理解vite', link: '/work/vue/深入理解vite/index' },
            ]
          },
          { 
            text: 'TypeScript', 
            collapsed: true,
            items: [
              { text: '类型体操基础', link: '/work/ts/类型体操基础' },
            ]
          },
          { 
            text: 'Node', 
            collapsed: true,
            items: [
              { text: 'express中台', link: '/work/node/express中台/index' },
            ]
          },
          { 
            text: '应用', 
            collapsed: true,
            items: [
              { text: 'nutui组件库主题定制', link: '/work/use/nutui组件库主题定制' },
              { text: '前端导入、导出EXCEL-SheetJs', link: '/work/use/前端导入、导出EXCEL-SheetJs' },
            ]
          },
          {
            text:'其他',
            collapsed: true,
            items: [
              { text:'前端也来了解AI了', link: '/work/other/前端也来了解AI了' },
              { text:'重拾八股文', link: '/work/other/重拾八股文' },
              { text:'leetCode Top100', link: '/work/other/leetCodeTop100' },
              { text:'network', link: '/work/other/network' },
              { text:'随便问问', link: '/work/other/随便问问' },
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  base: '/T-web/',
})
