# 刺激の受け取り方・セルフチェック

日常生活における刺激、情報量、対人場面の負担と回復資源を振り返るための、独自作成20項目の静的Webアプリです。

## 位置づけ

- 標準化された心理尺度、HSP診断、医療機器ではありません。
- HSPS、HSPS-J19その他の既存心理尺度の質問文、項目順、因子名、判定値は使用していません。
- 得点は本ツール内の回答を整理するための参考値です。

## プライバシー

回答と結果はブラウザのメモリ上だけで処理します。サーバー送信、Cookie、localStorage、sessionStorage、アクセス解析はありません。再読み込みや終了操作で消去されます。

## ファイル構成

- `dist/index.html`：画面の構造
- `dist/styles.css`：スマートフォン・PC共通のデザイン
- `dist/questions.js`：独自20項目と4領域の生データ
- `dist/scoring.js`：得点計算・メーター換算・アドバイス選択
- `dist/app.js`：画面遷移と回答の一時保持
- `test.mjs`：質問データと採点処理の自動テスト

質問データ、採点処理、画面処理を分離しているため、GitHub上で内容を個別に確認できます。すべて相対パスで参照しており、リポジトリ名にかかわらずGitHub Pagesで動作します。

## 自動テスト

```bash
node test.mjs
```

または、次を実行します。

```bash
npm test
```

## GitHub Pagesで公開する方法

1. このフォルダの内容をGitHubリポジトリの`main`ブランチへ登録します。
2. リポジトリの`Settings` → `Pages`を開きます。
3. `Build and deployment`の`Source`で`GitHub Actions`を選択します。
4. `Actions`の「Test and deploy to GitHub Pages」が成功すると公開URLが発行されます。

公開URLは通常、次の形式です。

```text
https://ユーザー名.github.io/リポジトリ名/
```

GitHub Actionsは、公開前に質問数、得点範囲、未回答・不正値、メーター換算、アドバイス選択を自動確認し、`dist`フォルダだけをGitHub Pagesへ配置します。
