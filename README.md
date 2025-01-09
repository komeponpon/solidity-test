## 1. 技術スタック

### フロントエンド

- Next.js 15（App Router）
- React
- TanStack Query
- Wagmi v2
- Viem v2

### スマートコントラクト

- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- Balancer V2
- Uniswap V2/V3

### 開発ツール

- TypeScript
- Hardhat Toolbox
- Solhint（Solidityリンター）

## 2. 仕様

このプロジェクトは、DeFiプロトコル間の価格差を利用したフラッシュローン・アービトラージシステムです。

### 主要機能

1. **フラッシュローンを活用したアービトラージ取引**
    - Balancer V2からフラッシュローンを借り入れ
    - Uniswap V3とSushiswap間での裁定取引
    - 最小利益率（0.5%）を確保
2. **価格監視と収益性チェック**
    - リアルタイムな価格チェック機能
    - 取引前の収益性計算
    - フラッシュローン手数料（0.02%）を考慮した利益計算
3. **セキュリティ機能**
    - ReentrancyGuard による再入攻撃防止
    - オーナーのみが実行可能な重要機能
    - スマートコントラクトの承認管理

## 3. ディレクトリ構成

```
├── app/                    # Next.jsアプリケーション
│   ├── components/         # Reactコンポーネント
│   ├── config/            # 設定ファイル
│   ├── hooks/             # カスタムフック
│   └── layout.tsx         # レイアウトコンポーネント
├── contracts/             # Solidityコントラクト
├── scripts/               # デプロイメントスクリプト
├── artifacts/             # コンパイル済みコントラクト
├── cache/                 # Hardhatキャッシュ
└── typechain-types/       # 生成された型定義

```

## 4. 各ファイルの内容と処理

### スマートコントラクト

- `FlashLoanArbitrage.sol`
    - フラッシュローン実行ロジック
    - アービトラージ取引の実装
    - 価格チェックと収益性計算
    - イベント発行機能

### フロントエンド

- `app/page.tsx`
    - メインページコンポーネント
    - アービトラージパネルの表示
- `app/components/ArbitragePanel.tsx`
    - アービトラージ実行インターフェース
    - 取引パラメータ入力フォーム
- `app/hooks/useArbitrage.ts`
    - アービトラージ関連のカスタムフック
    - コントラクト操作ロジック

### 設定ファイル

- `hardhat.config.ts`
    - Hardhat設定
    - ネットワーク設定
    - コンパイラ設定
- `.env`
    - 環境変数（APIキー、プライベートキーなど）

## 5. 使い方

1. **環境設定**

```bash
# 環境変数の設定
cp .env.example .env
# 必要な環境変数を設定

# 依存関係のインストール
npm install

```

1. **コントラクトのデプロイ**

```bash
npx hardhat compile
npx hardhat deploy --network <network_name>

```

1. **フロントエンド開発サーバーの起動**

```bash
npm run dev

```

1. **アービトラージの実行**
- Webインターフェースにアクセス
- ウォレットを接続
- トークンペアと取引量を選択
- 「Check Profitability」ボタンで収益性を確認
- 「Execute Arbitrage」ボタンで取引を実行

### 注意事項

- フラッシュローンには十分なガス代が必要
- 取引前に必ず収益性チェックを実行
- 高速なブロック確認が必要な環境での実行を推奨

コントラクトアドレス

https://amoy.polygonscan.com/address/0x0e6c5e7BCdb38634211D0FE0dcc6dE2625a72F31#code
