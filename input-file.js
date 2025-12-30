export class InputFile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: inline-block;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 0.9rem;
      }

      .container {
        display: inline-flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 1em 1.5em;
        border-radius: 6px;
        border: 2px solid #bbb;
        cursor: pointer;
        background: #fafafa;
        user-select: none;
        transition: background 0.15s ease, border-color 0.15s ease;
        min-width: 180px;
        text-align: center;
      }

      .wrapper:hover {
        background: #f0f0f0;
      }

      .wrapper.dragover {
        border-color: #4a90e2;
        background: #edf4ff;
      }

      input[type="file"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }

      .label {
        pointer-events: none;
        white-space: nowrap;
      }

      .file-list {
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 220px;
        background: #fff;
      }

      .file-list:empty {
        border-style: dashed;
        color: #999;
        padding: 0.4rem 0.6rem;
      }

      .file-list:empty::before {
        content: "選択されたファイルはありません";
      }

      .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.35rem 0.6rem;
        border-bottom: 1px solid #eee;
      }

      .file-item:last-child {
        border-bottom: none;
      }

      .file-name {
        flex: 1 1 auto;
        word-break: break-all;
      }

      .file-delete {
        flex: 0 0 auto;
        border: none;
        background: #eee;
        border-radius: 3px;
        padding: 0.1rem 0.4rem;
        cursor: pointer;
        font-size: 0.75rem;
      }

      .file-delete:hover {
        background: #e06666;
        color: #fff;
      }
    `;

    const container = document.createElement("div");
    container.className = "container";

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = this.getAttribute("label") ?? "ファイルを選択";

    const input = document.createElement("input");
    input.type = "file";

    const list = document.createElement("ul");
    list.className = "file-list";

    this._input = input;
    this._label = label;
    this._wrapper = wrapper;
    this._listEl = list;
    this._files = []; // ここに File を溜めていく

    // input change（クリックで選択）
    this._onInputChange = () => {
      if (!this._input.files || this._input.files.length === 0) return;
      this._addFiles(this._input.files);
      // 同じファイルを再度選択できるようにクリア
      this._input.value = "";
    };
    input.addEventListener("change", this._onInputChange);

    // drag & drop 周り
    this._onDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._wrapper.classList.add("dragover");
    };

    this._onDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._wrapper.classList.add("dragover");
    };

    this._onDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._wrapper.classList.remove("dragover");
    };

    this._onDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._wrapper.classList.remove("dragover");
      const dt = e.dataTransfer;
      if (!dt || !dt.files || dt.files.length === 0) return;
      this._addFiles(dt.files);
    };

    wrapper.addEventListener("dragover", this._onDragOver);
    wrapper.addEventListener("dragenter", this._onDragEnter);
    wrapper.addEventListener("dragleave", this._onDragLeave);
    wrapper.addEventListener("drop", this._onDrop);

    wrapper.append(label, input);
    container.append(wrapper, list);
    shadow.append(style, container);
  }

  static get observedAttributes() {
    return ["multiple", "accept", "label"];
  }

  connectedCallback() {
    this._syncAttributes();
  }

  disconnectedCallback() {
    if (this._input && this._onInputChange) {
      this._input.removeEventListener("change", this._onInputChange);
    }
    if (this._wrapper) {
      this._wrapper.removeEventListener("dragover", this._onDragOver);
      this._wrapper.removeEventListener("dragenter", this._onDragEnter);
      this._wrapper.removeEventListener("dragleave", this._onDragLeave);
      this._wrapper.removeEventListener("drop", this._onDrop);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    this._syncAttributes();
  }

  _syncAttributes() {
    if (!this._input) return;

    // multiple: true/false
    this._input.multiple = this.hasAttribute("multiple");

    // accept
    if (this.hasAttribute("accept")) {
      this._input.accept = this.getAttribute("accept") ?? "";
    } else {
      this._input.removeAttribute("accept");
    }

    // label
    if (this._label) {
      this._label.textContent =
        this.getAttribute("label") ?? "ファイルを選択";
    }
  }

  /**
    * FileList or ArrayLike<File> を追加
    */
  _addFiles(fileList) {
    const allowMultiple = this.hasAttribute("multiple");

    // multiple が無い場合は、毎回リセットして1つだけ
    if (!allowMultiple) {
      this._files = [];
    }

    for (const f of fileList) {
      if (!allowMultiple && this._files.length >= 1) break;

      // accept チェック（最低限、拡張子/ MIME を確認したければここに実装）
      // ひとまず accept は input 側に任せる運用として、ここでは素通り

      this._files.push(f);
    }

    this._renderList();
    this._emitChange();
  }

  _renderList() {
    if (!this._listEl) return;
    this._listEl.innerHTML = "";

    this._files.forEach((file, index) => {
      const li = document.createElement("li");
      li.className = "file-item";

      const nameSpan = document.createElement("span");
      nameSpan.className = "file-name";
      const sizeKB = Math.round(file.size / 1024);
      nameSpan.textContent = `${file.name} (${sizeKB} KB)`;

      const delBtn = document.createElement("button");
      delBtn.className = "file-delete";
      delBtn.type = "button";
      delBtn.textContent = "削除";
      delBtn.addEventListener("click", () => {
        this._files.splice(index, 1);
        this._renderList();
        this._emitChange();
      });

      li.append(nameSpan, delBtn);
      this._listEl.appendChild(li);
    });
  }

  _emitChange() {
    // 外部には現在のファイル配列を渡す
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { files: this.files },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
    * 現在リストにあるファイル一覧
    * File[] を返す（FileList ではない）
    */
  get files() {
    return this._files.slice(); // コピーを返す
  }

  /**
    * プログラムからダイアログを開く
    */
  open() {
    this._input?.click();
  }

  /**
    * 全てのファイルをクリア
    */
  clear() {
    this._files = [];
    if (this._input) {
      this._input.value = "";
    }
    this._renderList();
    this._emitChange();
  }
}

customElements.define("input-file", InputFile);
