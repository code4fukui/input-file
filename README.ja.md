# input-file

依存関係のない、ドラッグ＆ドロップ対応のファイルプレビュー一覧付きカスタマイズ可能なファイル入力Webコンポーネント。

## デモ

[GitHub Pagesのデモ](https://code4fukui.github.io/input-file/)

## 機能

-   **簡単な導入**: CDNから読み込み、標準のHTML要素として使用できます。
-   **柔軟な入力**: 従来のファイルダイアログ、またはコンポーネントへのドラッグ＆ドロップでファイルを選択できます。
-   **ファイルプレビュー**: 選択されたファイルのリアルタイムな一覧（ファイル名、サイズ、個別のファイル削除オプション）を表示します。
-   **複数ファイル対応**: 単一および複数ファイルの選択をサポートします。
-   **カスタマイズ可能**: HTML属性を使用して、動作や外観を簡単に設定できます。
-   **プログラマティックAPI**: JavaScriptのメソッド（`.open()`, `.clear()`）でコンポーネントを制御し、`.files`プロパティで選択されたファイルにアクセスできます。

## 使い方

CDNからコンポーネントを読み込み、HTMLで`<input-file>`タグを使用します。

```html
<!-- 1. コンポーネントをインポート -->
<script type="module" src="https://code4fukui.github.io/input-file/input-file.js"></script>

<!-- 2. HTMLで使用 -->
<input-file id="my-uploader"></input-file>

<!-- 3. JavaScriptで変更を監視 -->
<script type="module">
  const uploader = document.getElementById('my-uploader');
  uploader.addEventListener('change', (e) => {
    const files = e.detail.files; // 選択されたFileオブジェクトの配列
    console.log(files);
  });
</script>
```

## APIと設定

### 属性

以下のHTML属性を設定することで、コンポーネントをカスタマイズできます。

| 属性       | 説明                                                                                                                                       | 例                                                         |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| `multiple` | 複数ファイルの選択を許可します。                                                                                                           | `<input-file multiple></input-file>`                       |
| `accept`   | ユーザーが選択できるファイルの種類を定義する文字列です。有効な値については[MDNドキュメント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)を参照してください。 | `<input-file accept="image/png, image/jpeg"></input-file>` |
| `label`    | ファイル選択ボタンのテキストを設定します。                                                                                                 | `<input-file label="Choose or drop files"></input-file>`   |

### プロパティ

JavaScriptのプロパティを使用して、コンポーネントの状態にアクセスできます。

-   **`.files`**
    現在選択されている `File` オブジェクトの配列のコピーを返します。

    ```javascript
    const uploader = document.querySelector('input-file');
    const currentFiles = uploader.files;
    console.log(currentFiles); // [File, File, ...]
    ```

### メソッド

要素のインスタンスに対して以下のメソッドを呼び出すことで、アクションを実行できます。

-   **`.open()`**
    プログラムからシステムのファイル選択ダイアログを開きます。

    ```javascript
    uploader.open();
    ```

-   **`.clear()`**
    選択されたすべてのファイルをリストから削除します。

    ```javascript
    uploader.clear();
    ```

### イベント

イベントをリッスンすることで、ユーザーの操作に応答できます。

-   **`change`**
    選択されたファイルのリストが変更されたとき（ファイルが追加または削除されたとき）に発火します。現在のファイルリストは、イベントの `detail` オブジェクトに渡されます。

    ```javascript
    uploader.addEventListener('change', (e) => {
      // e.detail.files には更新されたFileオブジェクトの配列が含まれます
      console.log(`${e.detail.files.length} file(s) selected.`);
    });
    ```

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
