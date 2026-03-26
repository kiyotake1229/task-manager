#!/bin/bash
# ファイル変更を監視して自動コミット＆プッシュ

echo "監視開始: app.html service-worker.js manifest.json (Ctrl+C で停止)"

MOD_APP=$(stat -f "%m" "app.html" 2>/dev/null)
MOD_SW=$(stat -f "%m" "service-worker.js" 2>/dev/null)
MOD_MF=$(stat -f "%m" "manifest.json" 2>/dev/null)

while true; do
    sleep 2

    CUR_APP=$(stat -f "%m" "app.html" 2>/dev/null)
    CUR_SW=$(stat -f "%m" "service-worker.js" 2>/dev/null)
    CUR_MF=$(stat -f "%m" "manifest.json" 2>/dev/null)

    CHANGED=""
    [ "$CUR_APP" != "$MOD_APP" ] && CHANGED="$CHANGED app.html"   && MOD_APP="$CUR_APP"
    [ "$CUR_SW"  != "$MOD_SW"  ] && CHANGED="$CHANGED service-worker.js" && MOD_SW="$CUR_SW"
    [ "$CUR_MF"  != "$MOD_MF"  ] && CHANGED="$CHANGED manifest.json"     && MOD_MF="$CUR_MF"

    if [ -n "$CHANGED" ]; then
        echo "変更検知:$CHANGED — プッシュ中..."
        git add $CHANGED
        git commit -m "Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
        git push
        echo "完了"
    fi
done
