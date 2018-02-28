import './zip/zip.js';
import './zip/zip-ext.js';

import model from './model.js';
import APK from './apk.js';
import IPA from './ipa.js';

/**
 * 入口函数
 * @param {DomObject|DomObjectArray} doms fileinput元素
 * @param {Function} callback 回调函数
 * @param {String} workerScriptsPath 设置引用 zip/inflate.js和z-worker.js的路径
 */
const APK_IPA_READER = function (doms, callback, workerScriptsPath) {
    zip.workerScriptsPath = workerScriptsPath;
    doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
    Array.prototype.forEach.call(doms, dom => {
        dom.addEventListener('change', function () {
            var file = dom.files[0];
            model.getEntries(file, function (entries) {
                if (/\.apk$/i.test(file.name)) {
                    APK(entries, callback/* (err, fileinfo) */);
                } else if (/\.ipa$/i.test(file.name)) {
                    IPA(entries, callback/* (err, fileinfo) */);
                } else {
                    callback('只支持apk和ipa文件格式');
                }
            });
        }, false);
    });
}

export default APK_IPA_READER;