# 逆向复现提示词（给 Chrome Agent 用）

用途：在浏览器里用「Claude in Chrome」类 agent **如实抓取某个网页 UI/UX 效果 + 源码信息**，
让它产出一份可直接交给 Claude Code 的 **implement 提示词**，用来在本仓库中尽量 1:1 复现该效果。

分工原则：
- **Chrome agent 只负责把效果抓准**（真实取值、动画参数、源码线索），不需要懂本仓库的 registry 格式。
- **Claude Code（本仓库）负责落地**：拿到 implement 提示词后，落成 `src/registry/examples/<id>/`
  下的 `demo.tsx + showcase.ts`，按 [TAGS-GUIDELINE](TAGS-GUIDELINE.md) 打标签、写 `principle`
  （见 [PRINCIPLE-GUIDELINE](PRINCIPLE-GUIDELINE.md)）、把自定义 CSS 提成 `@utility` 并登记到
  `src/registry/utilities.ts`。这些规范不用 Chrome agent 操心。

---

## 使用建议

1. **一次只分析一个效果**——给 URL + 明确指到具体元素，别让它一次分析整页（会稀释精度）。
2. **强调抓真实 computed 值 + easing 原值**——这是「像不像」的关键。
3. **让它区分「确认值 vs 推测」**——混淆后的 JS 常抓不到，逼它诚实标注，落地时才知道哪些要凭经验补。
4. **产出后**：把它生成的那份 implement 提示词直接贴给 Claude Code 即可。

---

## 提示词模板（替换开头的 URL / 描述后整段发给 Chrome agent）

```
你是一个 UI/UX 逆向分析助手。我会给你一个网页上的 UI 效果，
你的任务是「尽可能精确地还原它的实现细节」，最终产出一份
交给另一个编码 agent（Claude Code）的 implement 提示词。

## 目标案例
- URL: <粘贴链接>
- 具体元素/效果: <例如"首屏那个鼠标跟随的液态玻璃按钮" / "标题逐字入场动画">
- 触发方式: <hover / scroll / load / click / 自动循环>

## 第一步：观察与抓取（务必基于真实页面，不要凭印象猜）
按顺序做，并把每一项的真实取值记录下来：

1. 视觉静态
   - 用 getComputedStyle 抓关键元素的：颜色(含 rgba/渐变原始值)、
     字体(font-family/size/weight/letter-spacing)、圆角、阴影、
     border、backdrop-filter、mix-blend-mode 等。
   - 记录布局尺寸、间距、层叠(z-index / stacking)。

2. 动效与交互（最重要，要抓精确参数）
   - 触发前/触发中/触发后三个状态分别长什么样。
   - transition / animation 的：duration、delay、
     timing-function(cubic-bezier 原值)、transform 具体值、
     是否有 stagger(逐个延迟)及其间隔。
   - 是 CSS 动画、Web Animations API、还是 JS 库(GSAP/Framer/Lottie/
     three.js/canvas/WebGL)驱动？在 DOM/script 里找证据。
   - 若跟随鼠标/滚动：记录映射关系(输入范围→输出范围)、是否有缓动/lerp。

3. 源码线索（有就附上，没有就说明"未找到"）
   - 查看页面的 <style>、内联 style、相关 CSS 文件片段。
   - 查看驱动动画的 JS 片段（关键函数、参数、库名与版本）。
   - 用 read_network_requests 看是否加载了 GSAP/Lottie json/纹理/
     shader 等资源，附上关键请求。
   - 抓 1~3 张不同状态的截图辅助说明。

4. 诚实标注
   - 区分「确认抓到的真实值」与「你的推测」。推测必须标 (推测)。
   - 抓不到的（如混淆后的 JS）就写"无法获取源码，以下为行为推断"。

## 第二步：输出一份 implement 提示词（给 Claude Code）
用以下结构输出，语言中文，参数用真实数值：

---
### 效果名称
<一句话>

### 效果概述
2~4 句：它是什么、给人的感受、核心"aha"在哪。

### 视觉规格
- 配色 / 字体 / 尺寸 / 圆角 / 阴影 / 特殊滤镜（列真实值）

### 交互与动效规格
- 触发: ...
- 状态机: 初始 → 激活 → 结束（各状态样式）
- 动画参数: duration / easing(cubic-bezier) / delay / stagger / transform
- 输入映射（若跟随鼠标或滚动）: 输入范围 → 输出范围 + 缓动方式

### 推荐实现方式
- 纯 CSS 能做的部分 / 需要 JS 的部分
- 建议用的库（若原站用了 GSAP 就说 GSAP，并给等价写法思路）
- 关键技术点（如 backdrop-filter、SVG filter、canvas、shader）

### 抓到的源码片段（原样附上）
```css / js
<真实抓到的关键片段；无则写"未获取到源码"）>
```

### 复现难点与降级方案
- 哪些细节难 100% 还原、可接受的近似做法。
---

约束：不要输出与效果无关的营销文案；参数尽量给数值而非形容词；
分不清就标(推测)。
```
