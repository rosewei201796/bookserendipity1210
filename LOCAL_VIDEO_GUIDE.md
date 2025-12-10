# 本地视频添加指南

## 步骤 1：准备视频文件

将你的视频文件复制到项目的 `public/preset-media/` 目录下。

### 文件位置示例
```
/Users/rosewei/SPG/book serendipity/public/preset-media/
├── healthy-society-1.mp4
├── healthy-society-2.mp4
└── healthy-society-3.mp4
```

### 建议
- **文件格式**：MP4 格式（兼容性最好）
- **文件大小**：建议每个视频 < 10MB，以确保加载速度
- **分辨率**：建议 720p 或 1080p（竖屏视频更佳）
- **命名**：使用英文和连字符，避免空格和特殊字符

## 步骤 2：复制视频到目录

### macOS/Linux 命令行方式
```bash
# 复制单个文件
cp /path/to/your/video.mp4 "/Users/rosewei/SPG/book serendipity/public/preset-media/healthy-society-1.mp4"

# 复制多个文件
cp /path/to/videos/*.mp4 "/Users/rosewei/SPG/book serendipity/public/preset-media/"
```

### Finder 方式（macOS）
1. 打开 Finder
2. 导航到：`/Users/rosewei/SPG/book serendipity/public/preset-media/`
3. 将视频文件拖拽到这个文件夹

## 步骤 3：在代码中引用

在 `src/data/presetChannels.ts` 中，使用路径 `/preset-media/文件名`：

```typescript
{
  id: 'preset_healthy_society_card_1',
  text: '卡片文字内容',
  cardType: 'Quote',
  bookTitle: '健全的社会',
  author: '弗洛姆',
  imageUrl: '/preset-media/healthy-society-1.mp4',  // ← 使用这个路径格式
  mediaType: 'video',
  createdAt: new Date().toISOString(),
  userId: SYSTEM_USER_ID,
  likesCount: 0,
}
```

## 步骤 4：验证

1. 确保开发服务器正在运行：`npm run dev`
2. 在浏览器中访问应用
3. 检查 Explore 视图是否能看到并播放视频

## 常见问题

### Q: 视频无法播放
A: 
- 检查文件路径是否正确（区分大小写）
- 确认文件格式是否为 MP4
- 查看浏览器控制台是否有错误信息

### Q: 视频文件太大
A: 使用视频压缩工具：
```bash
# 使用 ffmpeg 压缩视频
ffmpeg -i input.mp4 -vcodec h264 -acodec mp2 -b:v 1M output.mp4
```

### Q: 需要转换为竖屏视频
A:
```bash
# 使用 ffmpeg 旋转视频
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4
```

## 替代方案：使用 Base64

如果你的视频很小（< 1MB），也可以转换为 Base64：

```bash
# macOS/Linux
base64 -i video.mp4 -o video-base64.txt

# 然后在代码中使用
imageUrl: 'data:video/mp4;base64,AAAA...'
```

⚠️ **注意**：Base64 会增加约 33% 的文件大小，且占用 localStorage 空间。

