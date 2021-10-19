# SCML
Simple Component Markup Language

生HTMLでのコーディングを支援するツールです。

## インストール
1. npmプロジェクトを生成します
2. フォルダ直下に`.npmrc`を配置し、
    ```npmrc
    @zoi-dayo:registry="https://npm.pkg.github.com"
    ```
    と記述します
3. `$ npm install @zoi-dayo/scml`でインストールします
4. 必要であれば`$ npx @zoi-dayo/scml init`でプロジェクトを初期化します

## コマンド
- プロジェクトの初期化<br>
    `$ npx @zoi-dayo/scml init`
- プロジェクトのビルド<br>
    `$ npx @zoi-dayo/scml build`
    ### Options
    - src
        `--src <path>` | `-s <path>`
        `<path>`: ビルドするファイルのパス<br>デフォルト値: `pages`
    - out
        `--src <path>` | `-s <path>`
        `<path>`: ビルドの出力パス<br>デフォルト値: `pages`