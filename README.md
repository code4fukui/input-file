# input-file

- input-file: custom element for uploading files

## usage

```html
<script type="module" src="https://code4fukui.github.io/input-file/input-file.js"></script>

<input-file id="infile"></input-file>

<script type="module">
infile.addEventListener("change", async (e) => {
  const files = e.detail.files;
  console.log(files);
  inbody.value = files.map(i => i.name);
});
</script>
```
