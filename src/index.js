import './zip/zip.js';
import './zip/zip-ext.js';

import model from './model.js';
import APK from './apk.js';
import IPA from './ipa.js';

export default class {
    // @param {*} options {workerScriptsPath:String, callback:Function}
    constructor(options) {
        zip.workerScriptsPath = options.workerScriptsPath; // 设置引用 zip/inflate.js和z-worker.js的路径
        this.callback = options.callback || function () { };
        this.file = null;
    }

    reader(file, callback) {
        model.getEntries(file, function (entries) {
            if (/\.apk$/i.test(file.name)) {
                APK(entries, callback/* (err, fileinfo) */);
            } else if (/\.ipa$/i.test(file.name)) {
                IPA(entries, callback/* (err, fileinfo) */);
            } else {
                callback('只支持apk和ipa文件格式');
            }
        });
    }

    /**
     * 通过file input获取文件
     * @param {DomObject|DomObjectArray} doms fileinput元素
     */
    byInput(doms) {
        doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
        Array.prototype.forEach.call(doms, dom => {
            dom.addEventListener('change', e => {
                this.file = dom.files[0];
                this.reader(dom.files[0], this.callback);
                e.target.value = '';
            }, false);
        });
    }

    /**
     * 通过拖拽获取文件
     * @param {DomObject|DomObjectArray} doms fileinput元素
     * @param {Object} options {dragenter:Function, dragleave:Function}
     */
    byDrag(doms, options) {
        doms = /HTMLCollection|Array/i.test(Object.prototype.toString.call(doms)) ? doms : [doms];
        options = options || {};
        Array.prototype.forEach.call(doms, dom => {
            //拖进
            dom.addEventListener('dragenter', e => {
                e.preventDefault();
                options.dragenter && options.dragenter();
            }, false);

            //拖离
            dom.addEventListener('dragleave', e => {
                options.dragleave && options.dragleave(e);
            }, false);

            dom.addEventListener('dragover', e => e.preventDefault(), false);

            dom.addEventListener('drop', e => {
                e.preventDefault();
                this.file = e.dataTransfer.files[0];
                this.reader(e.dataTransfer.files[0], this.callback);
            }, false);
        });
    }
};