#!/bin/bash
# app.html を監視して変更があれば自動コミット＆プッシュ

TARGET="app.html"
LAST_MOD=""

echo "👀 監視開始: $TARGET (Ctrl+C で停止)"

while true; do
    CURRENT_MOD=$(stat -f "%m" "$TARGET" 2>/dev/null)

    if [ "$CURRENT_MOD" != "$LAST_MOD" ] && [ -n "$LAST_MOD" ]; then
        echo "🔄 変更検知 — コミット＆プッシュ中..."
        git add "$TARGET"
        git commit -m "Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        echo "✅ プッシュ完了"
    fi

    LAST_MOD="$CURRENT_MOD"
    sleep 2
done
