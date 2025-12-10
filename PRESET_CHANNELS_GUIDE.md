# 预置频道添加指南

## 概述
预置频道是所有用户打开应用时都能看到的频道，包含预定义的图片和视频内容。

## 如何添加预置频道

编辑文件：`src/data/presetChannels.ts`

### 频道结构示例

```typescript
{
  id: 'preset_channel_1',  // 唯一 ID，建议用 preset_channel_ 开头
  name: '书名',  // 频道名称
  author: '作者',  // 可选
  description: '频道描述',  // 可选
  userId: SYSTEM_USER_ID,  // 使用系统用户 ID
  cards: [  // 卡片数组
    // 卡片定义见下文
  ],
  createdAt: '2024-01-01T00:00:00.000Z',  // 创建时间
  updatedAt: '2024-01-01T00:00:00.000Z',  // 更新时间
  ownedByUser: false,  // 预置频道设为 false
  dropToFeed: true,  // 设为 true 以在 Explore 中显示
  isPreset: true,  // 标记为预置频道，不能被删除
}
```

### 卡片结构示例

#### 图片卡片
```typescript
{
  id: 'preset_card_1',  // 唯一 ID
  text: '卡片文字内容',  // 主文案
  subtext: '说明文字',  // 可选说明
  cardType: 'Quote',  // 或 'Concept' 或 'Insight'
  bookTitle: '书名',  // 必须与频道名称一致
  author: '作者',  // 可选
  imageUrl: 'data:image/jpeg;base64,/9j/4AAQ...',  // Base64 图片 URL
  mediaType: 'image',  // 图片类型
  createdAt: '2024-01-01T00:00:00.000Z',
  userId: SYSTEM_USER_ID,
  likesCount: 0,
}
```

#### 视频卡片
```typescript
{
  id: 'preset_card_2',
  text: '视频卡片文字',
  cardType: 'Quote',
  bookTitle: '书名',
  imageUrl: 'data:video/mp4;base64,AAAAIGZ0eXBpc...',  // Base64 视频 URL
  mediaType: 'video',  // 视频类型
  createdAt: '2024-01-01T00:00:00.000Z',
  userId: SYSTEM_USER_ID,
  likesCount: 0,
}
```

## 完整示例

```typescript
export const PRESET_CHANNELS: Channel[] = [
  {
    id: 'preset_sample_channel',
    name: '示例书籍',
    author: '示例作者',
    description: '这是一个示例预置频道',
    userId: SYSTEM_USER_ID,
    cards: [
      {
        id: 'preset_sample_card_1',
        text: '这是第一张卡片',
        subtext: '卡片说明',
        cardType: 'Quote',
        bookTitle: '示例书籍',
        author: '示例作者',
        imageUrl: 'data:image/jpeg;base64,...',
        mediaType: 'image',
        createdAt: '2024-01-01T00:00:00.000Z',
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
      {
        id: 'preset_sample_card_2',
        text: '这是视频卡片',
        cardType: 'Concept',
        bookTitle: '示例书籍',
        imageUrl: 'data:video/mp4;base64,...',
        mediaType: 'video',
        createdAt: '2024-01-01T00:00:00.000Z',
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ownedByUser: false,
    dropToFeed: true,
    isPreset: true,
  },
];
```

## 注意事项

1. **媒体格式**：
   - 图片：使用 Base64 编码的 data URL（`data:image/jpeg;base64,...` 或 `data:image/png;base64,...`）
   - 视频：使用 Base64 编码的 data URL（`data:video/mp4;base64,...`）
   - 也可以使用外部 URL（如 `https://...`）

2. **ID 唯一性**：每个频道和卡片的 ID 必须唯一

3. **频道标识**：
   - `isPreset: true` - 标记为预置频道，不能被用户删除
   - `ownedByUser: false` - 不属于任何用户
   - `dropToFeed: true` - 在 Explore 中显示

4. **媒体类型**：
   - 如果是图片，设置 `mediaType: 'image'`（或省略，默认为图片）
   - 如果是视频，必须设置 `mediaType: 'video'`

5. **卡片类型**：
   - `Quote` - 引用（红色标签）
   - `Concept` - 概念（蓝色标签）
   - `Insight` - 洞察（黄色标签）

## 转换媒体文件为 Base64

你可以使用以下方法将图片/视频转换为 Base64：

### 在线工具
- https://base64.guru/converter/encode/image
- https://www.base64-image.de/

### 命令行（macOS/Linux）
```bash
# 图片
base64 -i image.jpg | pbcopy

# 视频
base64 -i video.mp4 | pbcopy
```

### JavaScript/浏览器
```javascript
// 读取文件并转换为 Base64
const file = event.target.files[0];
const reader = new FileReader();
reader.onload = (e) => {
  const base64 = e.target.result;  // 这就是 data URL
  console.log(base64);
};
reader.readAsDataURL(file);
```

准备好后，请告诉我你的第一个预置频道的内容！

