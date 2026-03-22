# AWS RI Simulator

AWS Reserved Instances (RI) の費用対効果をシミュレーションする Web アプリケーションです。

## 概要

オンデマンド料金とリザーブドインスタンス料金を比較し、節約額・節約率・損益分岐点をグラフで可視化します。インスタンスタイプや利用時間を入力するだけで、RI 購入が有利かどうかを素早く判断できます。

## 主な機能

- **料金比較**: オンデマンド vs RI の月額・年額コスト比較
- **節約額シミュレーション**: 利用時間に応じた節約額・節約率の計算
- **損益分岐点グラフ**: RI 購入コストが元を取れる時点をグラフで表示
- **複数インスタンス対応**: 複数のインスタンスタイプを一覧比較

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Vue 3 + TypeScript |
| ビルドツール | Vite |
| スタイリング | Tailwind CSS |
| グラフ描画 | Chart.js + vue-chartjs |
| ユニットテスト | Vitest |
| E2E テスト | Playwright |

## 起動手順

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:5173）
npm run dev

# プロダクションビルド
npm run build

# ビルド結果プレビュー
npm run preview
```

## テスト実行手順

```bash
# ユニットテスト（Vitest）
npm run test

# ユニットテスト（ウォッチモード）
npm run test:watch

# E2E テスト（Playwright）
npm run test:e2e
```

## ブランチ戦略

GitFlow に従って開発を行います。

```
main        本番リリース済みのコードのみ
develop     開発の統合ブランチ
feature/*   機能開発（例: feature/result-chart）
release/*   リリース準備
hotfix/*    本番バグ修正
```
