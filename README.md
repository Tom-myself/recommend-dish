# 📖 バックエンド設計・実装ガイドライン

本プロジェクトでは、変更に強く、バグが入り込みにくい**「完全性のあるオブジェクト指向設計」**を採用します。データとロジックを分離する「貧血ドメインモデル」を排し、ドメインモデルが自律的にルールを強制する設計を徹底してください。

---

## 1. 核心となる設計原則

### 🚫 「生焼けオブジェクト」の排除

オブジェクトは、生成された瞬間にすべてのバリデーションを通過し、完全に利用可能な状態でなければなりません。

- **Setterの禁止**: `setXxx()` メソッドを公開してはいけません。
- **コンストラクタの責務**: 必須項目はすべてコンストラクタ（または静的ファクトリメソッド）で受け取り、その中で不整合な状態（null、不正な範囲の値など）を拒否してください。

### 🔒 不変性（Immutability）の維持

一度生成されたオブジェクトの状態は、その寿命が尽きるまで変化してはなりません。

- **final キーワードの徹底**: クラスのフィールドはすべて `private final` とします。
- **副作用のない変更**: 状態を変更したい場合は、既存の値を元に新しいインスタンスを生成して返すメソッド（例: `withNewScore` 等）を実装してください。

### 🛠️ ドメインの完全性（Domain Integrity）

ロジックを Service クラスに書き散らしてはいけません。

- **「自己完結」の原則**: そのデータに関連する計算、変換、判定ロジックは、そのデータを保持するクラス自身に実装してください。

---

## 2. クラスの役割定義

### 📦 値オブジェクト (Value Object)

単なるプリミティブ型（String, Integer等）の代わりに、特定の意味と制約を持つ小さなオブジェクトを作ります。

- **例: `WashingUpScore`**
  - 0〜10の範囲外の値を拒否するバリデーションを内包。
  - 「洗い物が少ない（Easy Cleaning）」かどうかを判定するメソッド `isEasy()` を提供。

### 🛡️ エンティティ (Entity)

一意の識別子（ID）を持ち、ビジネスルールの中心となるオブジェクト。

- **例: `Recipe`**
  - 材料リスト、工程リストを不変リスト（`List.copyOf`等）で保持。
  - 「朝食に向いているか」や「平均コストの算出」などのビジネスロジックを保持。

---

## 3. 実装パターン例

「洗い物が少ない順に並べる」ためのスコアリングロジックを持つドメインモデルの例：

```java
/**
 * 洗い物スコア（Value Object）
 * 0-10の値を保証し、不変である。
 */
public final class WashingUpScore implements Comparable<WashingUpScore> {
    private final int value;

    public WashingUpScore(int value) {
        if (value < 0 || value > 10) {
            throw new IllegalArgumentException("Score must be between 0 and 10.");
        }
        this.value = value;
    }

    /**
     * 調理工程からスコアを算出するドメインロジック
     * 例: 「フライパン」という言葉があれば減点、などのルールをここに集約
     */
    public static WashingUpScore calculateFromSteps(List<String> steps) {
        int score = 10;
        for (String step : steps) {
            if (step.contains("フライパン")) score -= 2;
            if (step.contains("揚げ")) score -= 5;
        }
        return new WashingUpScore(Math.max(score, 0));
    }

    public int getValue() { return value; }

    @Override
    public int compareTo(WashingUpScore other) {
        return Integer.compare(this.value, other.value);
    }
}

---

## 4. 実装済みの仕様まとめ（2026年5月現在）

これまでの開発で、以下の機能と設計原則に基づく改修が完了しています。

### 🎨 フロントエンド仕様
- **検索モードの切り替え**: 「材料から探す」と「キーワードで探す」の2つのモードを実装。
- **検索補助機能**: `#超簡単` などのハッシュタグをクリックすることで、検索入力欄にキーワードが自動補完される機能を実装。

### ⚙️ バックエンド設計（オブジェクト指向の適用）
- **完全な不変性（Immutability）の達成**: 
  - `Recipe`, `User` などのエンティティ群と各種リクエスト/レスポンスDTOをすべて Java の `record` クラスに移行。
  - リスト型は `List.copyOf()` を用いてディープイミュータブルを保証。
- **生焼けオブジェクトの撲滅**:
  - `new Recipe()` ＋ `setXxx()` のような手続き型の生成処理を排除し、完全な引数を渡すコンストラクタによる生成に統一。
- **MyBatis による不変オブジェクトの永続化**:
  - `useGeneratedKeys`（後からオブジェクトを書き換える手法）を廃止。
  - PostgreSQL の `RETURNING id` 構文を利用し、INSERT時にIDを受け取り `recipe.withId(newId)` で新しいインスタンスを返す「副作用のない処理」を実装。
- **Value Object の導入**:
  - `WashingUpScore` クラスを実装し、材料と手順の文字列から洗い物の少なさを判定するドメインロジックを集約。AIチャットによるおすすめ順ソートに活用。

### 🤖 AI連携仕様
- Gemini API を利用し、指定されたキーワード、材料、そして「調理器具の条件」を元にレシピを動的生成するエンドポイントを実装。
