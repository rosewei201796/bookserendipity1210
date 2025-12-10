# 预置频道功能测试

## 功能清单

### ✅ 已完成
1. **类型定义扩展**
   - 添加 `MediaType` 类型支持图片和视频
   - 为 `BookCard` 添加 `mediaType` 字段
   - 为 `Channel` 添加 `isPreset` 字段

2. **预置频道数据结构**
   - 创建 `src/data/presetChannels.ts` 文件
   - 定义 `PRESET_CHANNELS` 数组（目前为空，等待用户提供内容）
   - 定义 `SYSTEM_USER_ID` 常量

3. **存储层支持**
   - 修改 `cleanupOldChannels`：预置频道不会被清理
   - 添加 `initializePresetChannels`：自动加载预置频道
   - 修改 `getAllChannels`：包含预置频道
   - 修改 `deleteChannel`：阻止删除预置频道

4. **UI 组件支持**
   - 更新 `Card` 组件：支持视频渲染
   - 更新 `ExploreView`：支持视频播放
   - 视频控件：播放/暂停/音量控制

5. **辅助工具**
   - 创建 `PRESET_CHANNELS_GUIDE.md`：详细的添加指南
   - 创建 `presetChannelsTemplate.ts`：便捷的模板和辅助函数

## 测试步骤

### 1. 添加测试预置频道

编辑 `src/data/presetChannels.ts`，添加一个测试频道：

```typescript
import { Channel } from '@/types';

export const SYSTEM_USER_ID = 'system';

export const PRESET_CHANNELS: Channel[] = [
  {
    id: 'preset_test_1',
    name: '测试预置频道',
    author: '系统',
    description: '这是一个测试预置频道',
    userId: SYSTEM_USER_ID,
    cards: [
      {
        id: 'preset_test_card_1',
        text: '这是一个测试图片卡片',
        cardType: 'Quote',
        bookTitle: '测试预置频道',
        author: '系统',
        // 使用外部图片 URL 进行测试
        imageUrl: 'https://picsum.photos/seed/test1/800/1200',
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        userId: SYSTEM_USER_ID,
        likesCount: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownedByUser: false,
    dropToFeed: true,
    isPreset: true,
  },
];
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 验证功能

#### 在 Explore 视图中
- [ ] 能看到预置频道
- [ ] 可以浏览预置频道的卡片
- [ ] 图片正常显示
- [ ] 可以点赞预置频道的卡片
- [ ] 可以使用 Twist 功能

#### 在 My Channels 视图中
- [ ] 预置频道不会出现在"我的频道"列表中（因为 ownedByUser=false）

#### 删除保护
- [ ] 尝试删除预置频道时，应该被阻止（虽然 UI 可能不提供删除按钮）

#### 存储清理
- [ ] 创建多个用户频道后，预置频道仍然存在
- [ ] 刷新页面后，预置频道仍然可见

### 4. 视频测试

如果你有视频内容要测试，可以添加视频卡片：

```typescript
{
  id: 'preset_test_video_1',
  text: '测试视频卡片',
  cardType: 'Concept',
  bookTitle: '测试预置频道',
  imageUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',  // 使用测试视频
  mediaType: 'video',
  createdAt: new Date().toISOString(),
  userId: SYSTEM_USER_ID,
  likesCount: 0,
}
```

验证：
- [ ] 视频能正常播放
- [ ] 视频控件正常工作（播放/暂停/音量）
- [ ] 视频在 Explore 视图中正常显示

## 已知限制

1. **存储空间**：Base64 编码的图片和视频会占用大量 localStorage 空间（~5-10MB 限制）
   - 建议使用外部 URL 或压缩的图片
   - 视频建议使用外部 URL

2. **性能**：大量 Base64 数据可能影响加载速度
   - 考虑使用 CDN 或云存储
   - 图片建议压缩到 800px 宽度

3. **跨用户共享**：预置频道对所有用户可见，但点赞、评论等操作是用户独立的

## 下一步

等待用户提供具体的预置频道内容：
1. 频道名称和作者
2. 卡片内容（文字）
3. 媒体文件（图片或视频的 URL 或 Base64）
4. 卡片类型（Quote/Concept/Insight）

