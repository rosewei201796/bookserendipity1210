#!/bin/bash

# 添加视频文件到预置媒体目录的脚本
# 使用方法：./add-videos.sh /path/to/your/video.mp4

TARGET_DIR="/Users/rosewei/SPG/book serendipity/public/preset-media"

if [ $# -eq 0 ]; then
    echo "用法: ./add-videos.sh <视频文件路径>"
    echo "示例: ./add-videos.sh ~/Downloads/video1.mp4"
    echo ""
    echo "或者复制多个文件:"
    echo "  ./add-videos.sh ~/Downloads/*.mp4"
    exit 1
fi

echo "📁 目标目录: $TARGET_DIR"
echo ""

for file in "$@"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "📹 复制: $filename"
        cp "$file" "$TARGET_DIR/$filename"
        echo "✅ 完成: $filename"
    else
        echo "❌ 文件不存在: $file"
    fi
done

echo ""
echo "✨ 文件已复制到 $TARGET_DIR"
echo "📝 请在 src/data/presetChannels.ts 中添加卡片配置"

