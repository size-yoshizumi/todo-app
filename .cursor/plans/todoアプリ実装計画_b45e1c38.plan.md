---
name: TODOアプリ実装計画
overview: Next.jsとReactを使用して、TODOの新規作成と一覧表示機能を実装します。データはReactのuseStateでメモリ内管理します。
todos:
  - id: implement-todo-page
    content: page.tsxをクライアントコンポーネントとして実装し、useStateでTODOリストを管理する機能を追加
    status: completed
  - id: add-todo-form
    content: TODO入力フォーム（テキスト入力と追加ボタン）を実装
    status: completed
    dependencies:
      - implement-todo-page
  - id: add-todo-list
    content: TODO一覧表示機能を実装（作成日時順で表示）
    status: completed
    dependencies:
      - implement-todo-page
  - id: style-ui
    content: Tailwind CSSを使用してモダンで使いやすいUIを実装
    status: completed
    dependencies:
      - add-todo-form
      - add-todo-list
---

# TODOアプリ実装計画

## 概要

Next.js 16とReact 19を使用して、TODOの新規作成と一覧表示機能を持つシンプルなTODOアプリを実装します。データはReactの`useState`でメモリ内管理し、データベースやローカルストレージは使用しません。

## 実装内容

### 1. メインページの実装 (`my-todo-app/app/page.tsx`)

- クライアントコンポーネント（`'use client'`）として実装
- `useState`でTODOリストを管理
- TODO入力フォーム（テキスト入力と追加ボタン）
- TODO一覧表示エリア

### 2. データ構造

- TODOアイテムは以下の構造：
  ```typescript
  interface Todo {
    id: string;
    text: string;
    createdAt: Date;
  }
  ```

- `id`は一意性を保つため、`Date.now()`とランダム値の組み合わせで生成

### 3. UIコンポーネント

- **入力フォーム**: テキスト入力フィールドと「追加」ボタン
- **TODO一覧**: 作成されたTODOをリスト形式で表示
- Tailwind CSSを使用してモダンなUIを実装

### 4. 機能詳細

- **TODO作成**: 入力フィールドにテキストを入力し、ボタンクリックまたはEnterキーで追加
- **一覧表示**: 作成されたTODOを時系列順（新しいものから）で表示
- **バリデーション**: 空文字列のTODOは追加できないようにする

## 実装ファイル

- `my-todo-app/app/page.tsx`: メインのTODOアプリコンポーネント（既存ファイルを置き換え）

## 技術スタック

- Next.js 16.0.10 (App Router)
- React 19.2.1
- TypeScript
- Tailwind CSS 4

## 注意事項

- データはメモリ内のみで管理されるため、ページをリロードするとデータは失われます
- クライアントコンポーネントとして実装するため、`'use client'`ディレクティブが必要です