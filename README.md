Browser Javascript read apk file and ipa file's name, logo, version.

> Part of codes come from https://fir.im .

# Usage
```js
var reader = new APK_IPA_READER({
    callback: function(err, infos){
        // do something after get file info
    }, 
    workerScriptsPath: './'
});
reader.byInput(fileInputDom);
// or
// reader.byDrag(dragDom);
```

- `callback`: The callback function, will get two arguments: `error`(if ok it will be `null`) and `fileinfo`(i.e. name, logo, version)
- `workerScriptsPath`: set zip.workerScriptsPath, you can look for http://gildas-lormeau.github.io/zip.js/
- `fileInputDom`: The file input element, i.e. `document.getElementById('fileInputId')`

# Demo
https://satrong.github.io/apk-ipa-reader/