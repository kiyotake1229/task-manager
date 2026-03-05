# タスク管理アプリ

## 概要

`app.html` 1ファイルで完結するシングルページの個人タスク管理・歩み記録ツール。
バックエンドなし、データは `localStorage` に保存。

## ファイル構成

```
app.html        ← すべてのHTML/CSS/JSが入った単一ファイル（約4900行）
watch-push.sh   ← app.html を監視して自動コミット＆プッシュするスクリプト
```

## タブ構成

| タブ | ID | 内容 |
|---|---|---|
| 🏠 ホーム | `dashboard` | 励まし・名言・気分・週次レビュー・グラフ・タスク・目標 |
| ✅ タスク | `tasks` | タスク追加・一覧（優先度・繰り返し対応） |
| 🔄 習慣 | `habits` | 習慣トラッカー・週間カレンダー・連続日数 |
| 📝 記録 | `records` | 活動ログ / 日記 / 睡眠・勉強 / 読書 / 筋トレ（サブタブ） |
| 📅 計画 | `plan` | スケジュール（カレンダー） / 目標管理（サブタブ） |
| ⏱ タイマー | `pomodoro` | ポモドーロタイマー |

### 📝 記録のサブタブ

| サブタブ | ID | 内容 |
|---|---|---|
| 📋 活動ログ | `actlog` | テンプレート管理＋活動の詳細記録 |
| 📔 日記 | `diary` | 気分・よかったこと・振り返り・明日の目標 |
| 😴 睡眠・勉強 | `study` | 起床/就寝時間・勉強時間・勉強内容 |
| 📚 読書 | `books` | 読了本・星評価・月別集計 |
| 💪 筋トレ | `workout` | レベル別メニュー・トレーニング記録 |

### 📅 計画のサブタブ

| サブタブ | ID | 内容 |
|---|---|---|
| 📅 スケジュール | `schedule` | 月カレンダー・予定管理 |
| 🎯 目標 | `goals` | 目標・マイルストーン・進捗管理 |

## ホーム画面のセクション（上から順）

1. `#encouragement` — 励ましバナー（ストリーク・達成状況ベースのメッセージ）
2. `#quoteSection` — 今日の名言（20句内蔵＋ユーザー追加可能、日付ベース選択）
3. `#moodSection` — 気分クイックログ（😫😕😐😊🤩 ワンタップ）
4. `#weeklyReviewSection` — 週次レビュー（習慣率・勉強時間・読書・活動・日記数・平均気分）
5. `#chartsSection` — グラフ4種（習慣14日・勉強14日・気分推移・活動内訳ドーナツ）
6. `#statsContainer` — 今日のタスク数・未完了・習慣・目標達成率
7. `#todayTasks` — 今日のタスク一覧
8. `#activeGoals` — 進行中の目標

## データ構造（localStorage）

```
tasks         - タスク配列
schedules     - 予定配列
goals         - 目標配列
habits        - 習慣配列
pomodoroData  - ポモドーロ統計
workoutLogs   - 筋トレ記録
studyLogs     - 睡眠・勉強記録 {id, date, wakeUpTime, bedTime, studyDuration, studyContent}
books         - 読書記録 {id, title, author, finishDate, rating, notes}
actTemplates  - 活動ログ テンプレート {id, emoji, name, defaultDuration}
actLogs       - 活動ログ記録 {id, date, emoji, name, totalMin, method, memo, templateId}
diaryLogs     - 日記 {id, date, mood(1-5), good, reflection, tomorrow}
userQuotes    - ユーザー追加名言 {id, text, author}
```

## 主要な関数

### ダッシュボード
| 関数 | 役割 |
|---|---|
| `renderDashboard()` | ホーム全体再描画（以下を順に呼ぶ） |
| `renderEncouragement()` | 励ましバナー |
| `renderQuote()` | 名言カード |
| `renderMoodQuick()` | 気分ログボタン |
| `renderWeeklyReview()` | 週次レビューカード |
| `renderCharts()` | グラフ4種（SVG生成） |

### グラフ（SVGヘルパー）
| 関数 | 役割 |
|---|---|
| `svgBars(rows, opts)` | 縦棒グラフ SVG文字列を返す |
| `svgLine(rows, opts)` | 折れ線グラフ SVG文字列を返す |
| `svgDonut(segments, centerText)` | ドーナツグラフ SVG文字列を返す |

### 記録系
| 関数 | 役割 |
|---|---|
| `initActLogTab()` | 活動ログ初期化 |
| `initDiaryTab()` | 日記初期化 |
| `saveDiaryEntry()` | 日記保存（同日は上書き） |
| `initStudyTab()` | 睡眠・勉強初期化 |
| `initBooksTab()` | 読書初期化 |
| `renderWorkout()` | 筋トレ描画 |
| `renderCalendar()` | カレンダー描画 |
| `renderHabits()` | 習慣一覧描画 |

### 励ましメッセージのロジック
| 関数 | 役割 |
|---|---|
| `vari(arr, seed)` | 決定論的バリエーション選択（`seed = streak * 31 + hour`） |
| `habitCardInfo(habit)` | 習慣ごとのカード情報 |
| `studyCardInfo()` | 勉強記録のカード情報 |
| `bookCardInfo()` | 読書のカード情報 |
| `computeMainBanner(...)` | メインバナー文言（優先順位付き評価） |

## テーマ

- デフォルト: ダークモード（`data-theme="dark"`）
- ライトモード: `data-theme="light"` を `<html>` に付与
- トグルボタンは右上に常時表示

## コーディング規約

- CSSはすべて `<style>` 内（外部ファイルなし）
- JSはすべて `<script>` 内（外部ライブラリなし・SVGも自前生成）
- 大きな変更はPythonスクリプトで一括置換（Edit toolのold_stringマッチが難しい場合）
- `localStorage` への保存は各 `save〇〇()` 関数を通じて行う
- エクスポート/インポート対象を追加した際は `exportData()` と `importData()` も必ず更新

## 自動プッシュ

`watch-push.sh` を起動しておくと、`app.html` を保存するたびに自動で GitHub にプッシュされる。

```bash
cd ~/Desktop/タスク管理
./watch-push.sh
```

- 2秒ごとにファイル更新時刻を監視
- 変更検知 → `git add` → `git commit` → `git push` を自動実行
- `Ctrl+C` で停止
- GitHub Pages URL: https://kiyotake1229.github.io/task-manager/app.html

## 注意事項

- ファイル1つで完結 → 変更後は `Cmd + Shift + R` でハードリロード
- データはブラウザのlocalStorageに保存（ブラウザをまたぐと引き継がれない）
- バックアップはエクスポートボタンからJSONで出力可能
