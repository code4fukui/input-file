# input-file

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A zero-dependency, customizable file input web component with drag-and-drop support and a file preview list.

## Demo

[Demo on GitHub Pages](https://code4fukui.github.io/input-file/)

## Features

-   **Easy Integration**: Use as a standard HTML element from a CDN.
-   **Flexible Input**: Select files via a traditional file dialog or by dragging and dropping them onto the component.
-   **File Previews**: Displays a live list of selected files, including their name, size, and an option to remove individual files.
-   **Multiple Files**: Supports both single and multiple file selection.
-   **Customizable**: Easily configure behavior and appearance with HTML attributes.
-   **Programmatic API**: Control the component with JavaScript methods (`.open()`, `.clear()`) and access selected files via a `.files` property.

## Usage

Load the component from the CDN, then use the `<input-file>` tag in your HTML.

```html
<!-- 1. Import the component -->
<script type="module" src="https://code4fukui.github.io/input-file/input-file.js"></script>

<!-- 2. Use it in your HTML -->
<input-file id="my-uploader"></input-file>

<!-- 3. Listen for changes in JavaScript -->
<script type="module">
  const uploader = document.getElementById('my-uploader');
  uploader.addEventListener('change', (e) => {
    const files = e.detail.files; // The array of selected File objects
    console.log(files);
  });
</script>
```

## API and Configuration

### Attributes

Customize the component by setting these HTML attributes.

| Attribute  | Description                                                                                             | Example                                             |
| :--------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------- |
| `multiple` | Allows multiple files to be selected.                                                                   | `<input-file multiple></input-file>`                |
| `accept`   | A string that defines the file types the user can select. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) for valid values. | `<input-file accept="image/png, image/jpeg"></input-file>` |
| `label`    | Sets the text for the file selection button.                                                            | `<input-file label="Choose or drop files"></input-file>` |

### Properties

Access the component's state using JavaScript properties.

-   **`.files`**
    Returns a copy of the current array of selected `File` objects.

    ```javascript
    const uploader = document.querySelector('input-file');
    const currentFiles = uploader.files;
    console.log(currentFiles); // [File, File, ...]
    ```

### Methods

Call these methods on the element instance to perform actions.

-   **`.open()`**
    Programmatically opens the system's file selection dialog.

    ```javascript
    uploader.open();
    ```

-   **`.clear()`**
    Removes all selected files from the list.

    ```javascript
    uploader.clear();
    ```

### Events

Listen for events to react to user interactions.

-   **`change`**
    Fires whenever the list of selected files is modified (files are added or removed). The current file list is passed in the event's `detail` object.

    ```javascript
    uploader.addEventListener('change', (e) => {
      // e.detail.files contains the updated array of File objects
      console.log(`${e.detail.files.length} file(s) selected.`);
    });
    ```

## License

MIT License — see [LICENSE](LICENSE).