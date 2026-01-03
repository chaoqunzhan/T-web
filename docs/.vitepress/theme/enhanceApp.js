import mermaid from 'mermaid'

export default ({ router }) => {
  if (typeof window === 'undefined') return

  // 配置 mermaid（根据需要调整）
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default', // or 'dark', 'forest', ...
  })

  const renderMermaid = () => {
    // 找到所有 mermaid code block（VitePress 渲染后 class 是 language-mermaid）
    document.querySelectorAll('pre > code.language-mermaid').forEach((codeBlock) => {
      const code = codeBlock.textContent || ''
      const container = document.createElement('div')
      container.className = 'mermaid'
      // 把原始 mermaid 源放进 div（mermaid 会读取 div.innerText）
      container.textContent = code
      // 把 <pre><code> 替换为 div.mermaid
      const pre = codeBlock.parentNode
      pre.parentNode.replaceChild(container, pre)
    })

    // 渲染所有 .mermaid
    mermaid.init(undefined, document.querySelectorAll('.mermaid'))
  }

  // 首次渲染（页面初次加载）
  window.requestAnimationFrame(renderMermaid)

  // 每次路由变化后渲染（SPA 导航）
  router.afterEach(() => {
    // 等 DOM 更新后再渲染
    window.requestAnimationFrame(renderMermaid)
  })
}