# 预置频道总览

## 📚 已配置的预置频道

### 1. 健全的社会 by 弗洛姆
**频道 ID**: `preset_healthy_society`

**卡片列表**：
1. **弗洛姆1** (`fromm-1.mp4`)
   - 类型: Quote
   - 文字: "我们以为自己是自由的,但我们只是在选择别人为我们设定的选项。"

2. **弗洛姆2** (`fromm-2.mp4`)
   - 类型: Quote
   - 文字: "个人的整个一生不是别的而是诞下自己的过程。的确，我们在死亡之时应达到最完全的生——虽然大多数人的悲惨命运是在诞下自己之前便死了。"

---

### 2. Self Growth by bookthing
**频道 ID**: `preset_self_growth`

**卡片列表**：
1. **bookthingboundary** (`bookthingboundary.mp4`)
   - 类型: Insight
   - 文字: "My no isn't a personal attack on you. It's a yes to my own peace of mind."

2. **bookthingintimacypattern** (`bookthingintimacypattern.mp4`)
   - 类型: Quote
   - 文字: ""改变型伴侣"追求成长、洞见和进步；而"接纳型伴侣"，则守护着"当下"的堡垒，觉得一切都很好 轻松自在。这既是吸引，也会带来错配和问题"

3. **bookthingletthemgo** (`bookthingletthemgo.mp4`)
   - 类型: Insight
   - 文字: "有两样东西我们不应该去强求，真正的朋友和真正的爱。人们总会为真正在乎的人腾出时间，当有人说他们太忙时，只是优先级不够罢了"

4. **bookthingnoone** (`bookthingnoone.mp4`)
   - 类型: Insight
   - 文字: "最终你会发现 ，只有你自己；没人会来救你，始终只有你，永远只有你"

---

## 📊 统计

- **总频道数**: 2
- **总卡片数**: 6 (2 + 4)
- **总视频文件**: 6
- **总大小**: ~50MB

---

## 🔄 如何清除缓存查看新内容

由于预置频道会被缓存到 localStorage，添加新频道后需要清除缓存：

### 方法 1: 使用清除页面
访问: `http://localhost:5173/clear-storage.html`
点击 "Clear Storage" 按钮

### 方法 2: 开发者工具
1. 打开开发者工具 (F12)
2. Application → Local Storage → `http://localhost:5173`
3. 右键 → Clear
4. 刷新页面

---

## 📝 添加更多预置频道

编辑文件: `src/data/presetChannels.ts`

参考现有频道的格式，在数组末尾添加新的频道对象。

详细指南请查看: `PRESET_CHANNELS_GUIDE.md`

