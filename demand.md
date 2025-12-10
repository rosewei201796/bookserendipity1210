1. App & 导航
- 移动端 App，要求预览内容呈现在一个 mock iPhone 样式中。风格采用蒙德里安设计风格，参考代码
- 底部导航：
  - 左：Explore
  - 中：My Channels
  - 右：Serendipity
- 底部中央有悬浮的 FAB（+），用于创建新 Channel（覆盖在底栏上方）。

---
2. Explore（默认首页）
核心：一屏一张卡地刷“拆书卡片”。
- Explore 里按 Channel 维度展示，每个 Channel 对应一本书。
- 当前只显示一个 Channel 的一张卡（卡片占满屏幕）。
1.1 浏览交互
- 上下滑 / 滚动：在当前 Channel 内切换不同卡片。
- 左右切换 Channel：
  - 通过左右滑动或左右按钮模拟“上一书 / 下一书”。
  - 切换到新 Channel 时，从该 Channel 的随机一张卡开始展示。
1.2 卡片内容结构
每张卡包含：
- 上部信息区：
  - 书名（bookTitle）
  - 作者（author，可选）
  - 卡片类型 Badge：Quote / Concept / Insight
- 主内容区（占页面 30% 以上）：
  - text：主文案，醒目大字。
  - subtext：可选说明。
- 右侧（或右下）操作区按钮：
  - ❤️ Like（点赞）
  - 🌀 Twist（显著按钮）
- Worldchat（见下）是整个 Channel 的公共聊天区域，位于 Feed 底部半透明叠层，类似直播间公屏。
1.3 Worldchat（公共 Channel 聊天）
- 当用户在浏览某个“公共 Channel”（被 drop 到 feed 的 Channel）时，底部出现聊天区。
- 形式：
  - 底部有一个类似直播间的半透明公屏：
    - 实时显示该 Channel 内的消息，滚动几条后自动消失/上滑。
  - 底部有输入框 + 发送按钮。
- 行为：
  - 用户输入文字 → 发送 → 消息显示在该 Channel 公屏中。
  - 所有用户（理论上）都能看到该 Channel 的公屏消息；MVP 里先本地模拟。

---
3. FAB：创建新 Book Channel
- FAB 悬浮在底部中间（+ icon）。
- 点击后打开 Create a Book Channel 的 bottom sheet / modal：
  - Book Title（必填）
  - Author（选填）
  - Drop to feed（开关，默认开启）：
    - 开启：该 Channel 会出现在 Explore feed（作为公共 Channel）。
    - 关闭：只在 My Channels 里可见，不进入公共 Explore 流。
  - 按钮：Create
- 点击 Create：
  - 创建 Channel：
    - ownedByUser = true
    - dropToFeed = true/false（取决于开关）
  - 自动生成 10–20 张冷启卡片。
  - 加入全局 Channel 列表。
  - Explore 跳转到该 Channel，从第一张卡开始刷。

---
4. Twist 功能
3.1 Twist 按钮
- 每张卡底部/右侧都有一个显著的 🌀 Twist 按钮。
- 语义：基于当前卡片内容，生成一个“反向 / 对立 / 互补”的新卡片（及衍生内容）。
3.2 Twist 页面（Modal / Sheet）
- 打开后包含：
- Twist 预览卡：
  - 根据原卡自动生成一条“相反理论 / 另一书中的一句话”。
  - UI 与普通卡片一致（可以有新的 bookTitle / 作者 / text）。
- 原卡片简要信息（只读）：
  - 原书名 + 作者。
  - 原卡类型 + 截断的一两句原文。
- 可选 Prompt 输入框：
  - 文本框：Add a twist prompt (optional)...
  - 用户可以指定 twist 角度，如：
    - “从女性主义视角反驳它”
    - “用存在主义来拆解”
- Regenerate Preview 按钮：
  - 使用当前 Prompt + 原卡，重新生成一张预览 twist 卡（前端 mock）。
- 目标位置选择：
  - 单选 / 下拉：
    - A. 添加到已有 Channel
    - B. 创建为新 Channel
  - 默认逻辑：
    - 若当前 Channel 是他人创建（ownedByUser = false）：
      - 默认选 B：创建新 Channel。
      - 同时提供 “Add to one of my channels…” 下拉，列出所有自己的 Channel。
    - 若当前 Channel 是自己创建（ownedByUser = true）：
      - 默认选 A：添加到当前 Channel。
      - 同时提供 “Create a new channel from this twist”。
3.3 Apply Twist 时的行为
按钮：Apply Twist
A. 创建新 Channel：
- 创建新 Channel：
  - bookTitle：
    - 若 twist 预览卡有明确书名，使用之；
    - 否则 fallback："Twist of [原书名]"。
  - ownedByUser = true
  - parentChannelId = 原 Channel id（可选）
  - dropToFeed 可默认开启（或弹窗中让用户勾选，MVP 可先默认开启）。
- 内容：
  - 新 Channel 卡片 = 预览卡 + 5–7 张冷启 twist 卡 → 总计 6–8 张。
- 操作：
  - 加入 Channel 列表。
  - Explore 跳转到该新 Channel，并从 Twist 卡开始显示。
B. 添加到已有 Channel：
- 根据用户选择的目标 Channel（可为当前 Channel 或 My Channels 中任一）。
- 调用 generateTwistCardsForChannel：
  - 基于原卡 + Prompt 生成 3 张新的 twist 卡。
  - 附加到指定 Channel 的 cards 列表末尾。
- 返回该 Channel 浏览视图，并滚动到新卡区域（或弹出 toast 提示）。

---
5. My Channels
- Tab：My Channels
- 展示所有 ownedByUser = true 的 Channel 列表：
  - 列表项包含：
    - Channel 的封面（channel 内某张卡的缩略图或第一张卡）
    - 创建时间
    - 卡片数量
- 点击某个 Channel：
  - 进入该 Channel 的浏览视图（与 Explore 中一致，只是 currentChannel 变化）。
- 用户在自己的 Channel 和卡片上可以：
  - 删除 Channel
  - 删除某张卡片

---
6. Serendipity
核心：随机从用户点赞过的卡片里挑一些，让预置“人设”给出锐评 twist 卡。
- 人设 persona 列表（前端写死）例如：
  - 马克思评：Karl Marx（🧔‍♂️）
  - 撒切尔评：Margaret Thatcher（👩🏼‍💼）
  - 马斯克评：Elon Musk（🚀）
  - 还可以扩展尼采、波伏瓦、弗洛伊德等。
5.1 生成逻辑
- 从 likedCardIds 对应的卡片中随机抽若干张（如最多 10 张）。
- 对每一张被选中的卡：
  - 随机选一个 persona。
  - 生成一条 persona 风格的“锐评”短文：
    - 马克思 → 阶级 / 生产关系 / 资本批判。
    - 撒切尔 → 自由市场 / 个人责任。
    - 马斯克 → 科技乐观 / 效率 / “火星 + 资本”。
  - 形成 SerendipityItem：
    - 原卡简要信息（书名 + 原卡一句摘要）
    - persona 名称 / label
    - persona 的锐评文本（1–3 句）。
5.2 展示
- Serendipity Tab 是一个纵向 Feed：
  - 每个 block 包含：
    - 上半：原卡片 snippet
      - [书名 - 作者]
      - 原卡一行文本简介。
    - 下半：persona 锐评卡
      - persona Tag（如：🧔‍♂️ 马克思评）
      - 锐评正文（1–3 句）。

---
7. 用户系统 & 数据持久化
- 需要一个最简单的用户系统：
  - 用户可以 注册 和 登录。
  - 注册时：
    - 系统自动分配一个默认用户名（如 Reader1234），在表单中可编辑。
    - 用户设置一个简单密码。
  - 登录时：
    - 使用用户名 + 密码。
- 登录状态：
  - 需要记录当前登录用户（例如用 localStorage 存一个 currentUserId）。
  - 页面刷新后仍然保持登录状态。
- 数据归属：
  - Channel 有 ownerUserId 或类似字段。
  - 每个用户有各自的：
    - Channels / Cards
    - Likes / My Channels / Twist 内容
  - 再次登录时，需要从 localStorage 中还原该用户所有数据。
- 删除：
  - 用户可以删除自己创建的 Channel。
  - 用户可以删除自己 Channel 内的卡片。