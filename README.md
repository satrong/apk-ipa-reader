Read apk file and ipa file's name, logo, version.

> Part of codes come from https://fir.im .

# Usage
```js
APK_IPA_READER(fileInputDom, callback, workerScriptsPath);
```

- `fileInputDom`: The file input element, i.e. `document.getElementById('fileInputId')`
- `callback`: The callback function, will get two arguments: `error`(if ok it will be `null`) and `fileinfo`(i.e. name, logo, version)
- `workerScriptsPath`: set zip.workerScriptsPath, you can look for http://gildas-lormeau.github.io/zip.js/